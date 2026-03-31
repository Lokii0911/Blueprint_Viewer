from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from backend.db import users_col
from backend.authorization import create_token
from passlib.hash import bcrypt
from backend.models import AuthSchema
router = APIRouter()

@router.post("/register")
async def register(data: AuthSchema):
    # Check if user already exists
    existing_user = await users_col.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = bcrypt.hash(data.password)
    user = {
        "email": data.email,
        "password": hashed
    }

    res = await users_col.insert_one(user)
    return {"token": create_token(str(res.inserted_id))}


@router.post("/login")
async def login(data: AuthSchema):
    user = await users_col.find_one({"email": data.email})

    # Use HTTPException for proper status codes
    if not user or not bcrypt.verify(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return {"token": create_token(str(user["_id"]))}