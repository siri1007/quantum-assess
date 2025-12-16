import traceback
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse,HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from .models import Users, RefreshToken, Chat, ChatMember, Message
from .utils.token_hash import hash_refresh_token
from datetime import datetime, timedelta
from django.utils import timezone
from chat_app.utils.encryption import decrypt_message, encrypt_message
import bcrypt
import jwt
from django.conf import settings
from django.db import IntegrityError
from django.db.models import Count


SECRETKEY= settings.SECRET_KEY


# Create your views here.
@csrf_exempt
def create_user(req):
    if req.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        name = req.POST.get('Username')
        email = req.POST.get('Email')
        pw = req.POST.get('Password')

        if not all([name, email, pw]):
            return JsonResponse({'error': 'All fields are required'}, status=400)

        # if Userid is integer in your model convert it, else keep as string
        # try:
        #     id_val = int(id)
        # except Exception:
        #     id_val = id

        encrypted_password = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt(14)).decode('utf-8')

        
        new_user = Users.objects.create(
            # Userid=id_val,
            Username=name,
            Email=email,
            Password=encrypted_password,
        )

        return JsonResponse({
            'msg': 'User Successfully Created',
            'data': {
                'Userid': new_user.Userid,
                'Username': new_user.Username
            }
        }, status=201)

    except IntegrityError:
        return JsonResponse({'error': 'User with this ID or email already exists'}, status=400)

    except Exception as e:
        print("reg_user exception:", repr(e))  # dev: print full exception
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

def upd_user(req,id):
    pass
def del_user(req,id):
    pass
def list_users(request):
    print("DEBUG request.user:", request.user)
    print("DEBUG all users:", Users.objects.values("Userid", "Username"))

    users = Users.objects.exclude(Userid=request.user.Userid)

    print("DEBUG filtered users:", users.values("Userid", "Username"))

    data = []
    for u in users:
        data.append({
            "userid": u.Userid,
            "username": u.Username,
        })

    return JsonResponse({"users": data})



@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    email = request.POST.get("Email")
    password = request.POST.get("Password")

    if not email or not password:
        return JsonResponse({"error": "Email and Password required"}, status=400)

    try:
        user = Users.objects.get(Email=email)
    except Users.DoesNotExist:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    # Verify password
    if not bcrypt.checkpw(password.encode(), user.Password.encode()):
        return JsonResponse({"error": "Invalid credentials"}, status=401)


    # ACCESS TOKEN (SHORT)
    access_payload = {
        "userid": user.Userid,
        "username": user.Username,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=35),
        "iat": datetime.utcnow()
    }

    access_token = jwt.encode(access_payload, SECRETKEY, algorithm="HS256")

    # -------------------------
    # REFRESH TOKEN (LONG)
    # -------------------------
    refresh_payload = {
        "userid": user.Userid,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }

    refresh_token = jwt.encode(refresh_payload, SECRETKEY, algorithm="HS256")

    # Hash refresh token before saving
    # hashed_refresh = bcrypt.hashpw(
    #     refresh_token.encode(), bcrypt.gensalt()
    # ).decode()

    hashed_refresh = hash_refresh_token(refresh_token)

    RefreshToken.objects.create(
        user=user,
        token_hash=hashed_refresh,
        expires_at=timezone.now() + timedelta(days=7)
    )

    # -------------------------
    # RESPONSE
    # -------------------------
    response = JsonResponse({
        "success": True,
        "access_token": access_token
    })

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=7 * 24 * 60 * 60
    )

    return response


@csrf_exempt
def refresh_access_token(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    refresh_token = request.COOKIES.get("refresh_token")
    if not refresh_token:
        return JsonResponse({"error": "Refresh token missing"}, status=401)

    try:
        payload = jwt.decode(refresh_token, SECRETKEY, algorithms=["HS256"])
        if payload.get("type") != "refresh":
            return JsonResponse({"error": "Invalid token type"}, status=401)
    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Refresh token expired"}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({"error": "Invalid refresh token"}, status=401)

    user_id = payload["userid"]

    from chat_app.utils.token_hash import hash_refresh_token
    hashed = hash_refresh_token(refresh_token)

    try:
        token_obj = RefreshToken.objects.get(
            user_id=user_id,
            token_hash=hashed,
            is_revoked=False,
            expires_at__gt=timezone.now()
        )
    except RefreshToken.DoesNotExist:
        return JsonResponse({"error": "Refresh token not recognized"}, status=401)

    # rotate token
    token_obj.is_revoked = True
    token_obj.save()

    # issue new access token
    new_access_payload = {
        "userid": user_id,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=15),
        "iat": datetime.utcnow()
    }

    new_access_token = jwt.encode(
        new_access_payload, SECRETKEY, algorithm="HS256"
    )

    return JsonResponse({
        "access_token": new_access_token
    })




@csrf_exempt
def create_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    user = request.user
    is_group = request.POST.get("is_group") == "true"
    name = request.POST.get("name")  # ✅ READ NAME

    chat = Chat.objects.create(
        is_group=is_group,
        name=name if is_group else None,  # ✅ SAVE NAME
        created_by=user
    )

    ChatMember.objects.create(chat=chat, user=user)

    return JsonResponse({
        "chat_id": chat.id,
        "is_group": chat.is_group,
        "name": chat.name
    })



@csrf_exempt
def add_member(request, chat_id):
    try:
        user = request.user  # ✅ from JWT middleware

        chat = Chat.objects.get(id=chat_id)

        # prevent duplicate join
        if ChatMember.objects.filter(chat=chat, user=user).exists():
            return JsonResponse(
                {"message": "Already a member"},
                status=200
            )

        ChatMember.objects.create(
            chat=chat,
            user=user
        )

        return JsonResponse(
            {"message": "Joined group successfully"},
            status=201
        )

    except Chat.DoesNotExist:
        return JsonResponse(
            {"error": "Chat not found"},
            status=404
        )

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )


@csrf_exempt
def chat_history(request, chat_id):
    user = request.user

    # authorize
    is_member = ChatMember.objects.filter(
        chat_id=chat_id,
        user=user
    ).exists()

    if not is_member:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    messages = Message.objects.filter(chat_id=chat_id).order_by("created_at")

    data = []
    for msg in messages:
        data.append({
            "sender": msg.sender.Username,
            "message": decrypt_message(msg.encrypted_text),
            "created_at": msg.created_at.isoformat()
        })

    return JsonResponse({"messages": data})


@csrf_exempt
def send_message(request, chat_id):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    user = request.user
    text = request.POST.get("message")

    if not text:
        return JsonResponse({"error": "Message required"}, status=400)

    # authorize: user must be chat member
    is_member = ChatMember.objects.filter(
        chat_id=chat_id,
        user=user
    ).exists()

    if not is_member:
        return JsonResponse({"error": "Unauthorized"}, status=403)

    encrypted = encrypt_message(text)

    Message.objects.create(
        chat_id=chat_id,
        sender=user,
        encrypted_text=encrypted
    )

    return JsonResponse({"message": "Message stored (encrypted)"})


# def list_chats(request):
#     user = request.user  # from JWT middleware

#     chats = Chat.objects.filter(
#         chatmember__user=user
#     ).distinct()

#     data = []
#     for c in chats:
#         data.append({
#             "chat_id": c.id,
#             "is_group": c.is_group,
#             "created_at": c.created_at,
#         })

#     return JsonResponse({"chats": data})

def list_chats(request):
    user = request.user

    chats = Chat.objects.filter(
        chatmember__user=user
    ).distinct()

    data = []

    for c in chats:
        if c.is_group:
            name = c.name or f"Group #{c.id}"
        else:
            # private chat → get other user
            other = (
                ChatMember.objects
                .filter(chat=c)
                .exclude(user=user)
                .select_related("user")
                .first()
            )
            name = other.user.Username if other else "Private Chat"

        data.append({
            "chat_id": c.id,
            "is_group": c.is_group,
            "name": name,
        })

    return JsonResponse({"chats": data})



def explore_groups(request):
    user = request.user

    joined_ids = ChatMember.objects.filter(
        user=user
    ).values_list("chat_id", flat=True)

    groups = Chat.objects.filter(
        is_group=True
    ).exclude(id__in=joined_ids)

    data = []
    for g in groups:
        data.append({
            "chat_id": g.id,
            "name": getattr(g, "name", f"Group #{g.id}")
        })

    return JsonResponse({"groups": data})



def my_groups(request):
    user = request.user

    memberships = ChatMember.objects.filter(user=user)

    data = []
    for m in memberships:
        data.append({
            "chat_id": m.chat.id,
            "is_group": m.chat.is_group
        })

    return JsonResponse({"chats": data})

def get_or_create_private_chat(request):
    user1 = request.user
    user2_id = request.POST.get("user_id")

    if not user2_id:
        return JsonResponse({"error": "user_id required"}, status=400)

    user2 = Users.objects.get(Userid=user2_id)

    
    chats = (
        Chat.objects
        .filter(is_group=False)
        .annotate(member_count=Count("chatmember"))
        .filter(member_count=2)
    )

    for chat in chats:
        members = ChatMember.objects.filter(chat=chat)
        ids = {m.user.Userid for m in members}
        if ids == {user1.Userid, user2.Userid}:
            return JsonResponse({"chat_id": chat.id})

    # ➕ Create new private chat
    chat = Chat.objects.create(is_group=False)

    ChatMember.objects.create(chat=chat, user=user1)
    ChatMember.objects.create(chat=chat, user=user2)

    return JsonResponse({"chat_id": chat.id})

@csrf_exempt
def private_chat(request):
    user = request.user
    other_user_id = request.POST.get("user_id")

    if not other_user_id:
        return JsonResponse({"error": "user_id required"}, status=400)

    other = Users.objects.get(Userid=other_user_id)

    
    existing = (
        Chat.objects
        .filter(is_group=False, chatmember__user__in=[user, other])
        .annotate(cnt=Count("chatmember"))
        .filter(cnt=2)
        .first()
    )

    if existing:
        return JsonResponse({
            "chat_id": existing.id,
            "is_group": False
        })

    
    chat = Chat.objects.create(is_group=False)

    ChatMember.objects.bulk_create([
        ChatMember(chat=chat, user=user),
        ChatMember(chat=chat, user=other)
    ])

    return JsonResponse({
        "chat_id": chat.id,
        "is_group": False
    })