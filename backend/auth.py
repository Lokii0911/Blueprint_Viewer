import os
from dotenv import load_dotenv
from jose import jwt,JWTError
from datetime import datetime, timedelta,timezone
from backend.models import TokenPayload
load_dotenv()
SECRET = os.environ.get('SECRET')
ALGO = os.environ.get('ALGO')

def create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=1)
    token_data = TokenPayload(
        sub=user_id,
        exp=int(expire.timestamp())
    )
    return jwt.encode(token_data.model_dump(), SECRET, algorithm=ALGO)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])
        verified_data = TokenPayload(**payload)
        return verified_data.sub
    except JWTError:
        return None