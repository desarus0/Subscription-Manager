from database.db import users_collection
from models.user import User, UserCreate
from datetime import datetime
import secrets
import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def create_user(user_data: UserCreate) -> User:
    api_key = f"sk_{secrets.token_urlsafe(32)}"

    password_hash = hash_password(user_data.password)

    user_dict = {
        "username": user_data.username,
        "email": user_data.email,
        "name": user_data.name,
        "password_hash": password_hash,
        "api_key": api_key,
        "created_at": datetime.utcnow(),
    }

    result = await users_collection.insert_one(user_dict)

    user_dict["id"] = str(result.inserted_id)

    return User(**user_dict)

async def get_user_by_email(email: str) -> User:
    user = await users_collection.find_one({"email": email})
    return user

async def get_user_by_username(username: str) -> User:
    user = await users_collection.find_one({"username": username})
    return user