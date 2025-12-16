from django.db import models

# Create your models here.

class Users(models.Model):
    Userid=models.AutoField(primary_key=True)
    Username=models.CharField(max_length=50)
    Email=models.EmailField(max_length=50,null=False,unique=True)
    Password=models.CharField(max_length=225,null=False)
    

class RefreshToken(models.Model):

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    token_hash = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    is_revoked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Chat(models.Model):
    """
    Represents both private and group chats.
    """
    is_group = models.BooleanField(default=False)
    name=models.CharField(max_length=100, blank=True, null=True)
    created_by = models.ForeignKey(
        Users,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_chats"
    )
    created_at = models.DateTimeField(auto_now_add=True)


class ChatMember(models.Model):
    """
    Many-to-many relationship between users and chats.
    """
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    joined_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    """
    Stores encrypted chat messages.
    """
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(Users, on_delete=models.CASCADE)

    encrypted_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)