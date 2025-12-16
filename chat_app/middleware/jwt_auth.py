import jwt
from django.conf import settings
from django.http import JsonResponse
from chat_app.models import Users

SECRETKEY = settings.SECRET_KEY


class JWTAuthMiddleware:
    """
    Middleware to protect APIs using JWT access token.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # Skip auth for login & refresh endpoints
        open_paths = [
            "/login/",
            "/refresh/",
            "/reg_user/",
        ]

        if request.path in open_paths:
            return self.get_response(request)

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return JsonResponse(
                {"error": "Authorization header missing"},
                status=401
            )

        try:
            prefix, token = auth_header.split(" ")
            if prefix.lower() != "bearer":
                raise ValueError("Invalid auth header format")

        except ValueError:
            return JsonResponse(
                {"error": "Invalid Authorization header"},
                status=401
            )

        try:
            payload = jwt.decode(
                token,
                SECRETKEY,
                algorithms=["HS256"]
            )

            if payload.get("type") != "access":
                return JsonResponse(
                    {"error": "Invalid token type"},
                    status=401
                )

            user_id = payload.get("userid")

            user = Users.objects.get(Userid=user_id)

            # Attach user to request
            request.user = user

        except jwt.ExpiredSignatureError:
            return JsonResponse(
                {"error": "Access token expired"},
                status=401
            )

        except jwt.InvalidTokenError:
            return JsonResponse(
                {"error": "Invalid access token"},
                status=401
            )

        except Users.DoesNotExist:
            return JsonResponse(
                {"error": "User not found"},
                status=401
            )

        return self.get_response(request)
