import os

from jose import jwt
from datetime import datetime, timedelta, timezone
from backend.models import TokenPayload
SECRET = os.environ.get('SECRET')
ALGO = os.environ.get('ALGO')

def create_token(user_id: str):
    token_data = TokenPayload(
        sub=user_id,
        exp=int((datetime.now(timezone.utc) + timedelta(days=1)).timestamp())
    )
    return jwt.encode(token_data.model_dump(), SECRET, algorithm=ALGO)

def decode_token(token: str):
    raw_payload = jwt.decode(token, SECRET, algorithms=[ALGO])
    verified_data = TokenPayload(**raw_payload)
    return verified_data.sub
