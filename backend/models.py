from pydantic import BaseModel, Field,EmailStr
from datetime import datetime

class TokenPayload(BaseModel):
    sub: str
    exp: int


class AuthSchema(BaseModel):
    email: EmailStr
    password: str
