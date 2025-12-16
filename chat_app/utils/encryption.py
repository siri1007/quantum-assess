import os
import base64
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# Load and derive AES-256 key
RAW_KEY = os.environ.get("CHAT_AES_KEY", "mydefaultkey")

# Always derive exactly 32 bytes
SECRET_KEY = hashlib.sha256(RAW_KEY.encode()).digest()


# Encrypt Message
def encrypt_message(plain_text: str) -> str:
    """
    Encrypt message using AES-256-GCM
    """
    aesgcm = AESGCM(SECRET_KEY)
    nonce = os.urandom(12)  # 96-bit nonce (recommended for GCM)

    encrypted = aesgcm.encrypt(
        nonce=nonce,
        data=plain_text.encode(),
        associated_data=None
    )

    # Store nonce + ciphertext together
    return base64.b64encode(nonce + encrypted).decode()


# Decrypt Message
def decrypt_message(encrypted_text: str) -> str:
    """
    Decrypt message using AES-256-GCM
    """
    try:
        raw = base64.b64decode(encrypted_text.encode())
        nonce = raw[:12]
        ciphertext = raw[12:]

        aesgcm = AESGCM(SECRET_KEY)

        decrypted = aesgcm.decrypt(
            nonce=nonce,
            data=ciphertext,
            associated_data=None
        )

        return decrypted.decode()

    except Exception:
        # Handles tampering or invalid data
        raise ValueError("Failed to decrypt message")
