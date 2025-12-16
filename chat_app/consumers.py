import json
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async

from chat_app.models import ChatMember, Message, Users
from chat_app.utils.encryption import encrypt_message, decrypt_message

JWT_SECRET = settings.SECRET_KEY


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"chat_{self.chat_id}"

        query_string = self.scope["query_string"].decode()
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]

        if not token:
            await self.close()
            return

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            if payload.get("type") != "access":
                await self.close()
                return
        except jwt.ExpiredSignatureError:
            await self.close()
            return
        except jwt.InvalidTokenError:
            await self.close()
            return

        self.user = await sync_to_async(Users.objects.get)(
            Userid=payload["userid"]
        )

        # Authorization: check chat membership
        is_member = await sync_to_async(ChatMember.objects.filter(
            chat_id=self.chat_id,
            user=self.user
        ).exists)()

        if not is_member:
            await self.close()
            return

        # Join chat group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get("message")

        if not message_text:
            return

        # Encrypt message
        encrypted = encrypt_message(message_text)

        # Save encrypted message
        message = await sync_to_async(Message.objects.create)(
            chat_id=self.chat_id,
            sender=self.user,
            encrypted_text=encrypted
        )

        # Broadcast to chat room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": encrypted,
                "sender": self.user.Username,
                "created_at": message.created_at.isoformat(),
            }
        )

    async def chat_message(self, event):
        # Decrypt before sending to client
        decrypted = decrypt_message(event["message"])

        await self.send(text_data=json.dumps({
            "sender": event["sender"],
            "message": decrypted,
            "created_at": event["created_at"],
        }))
