from database.db import users_collection
from models.user import User, UserCreate
from datetime import datetime
import secrets

async def create_user(user_data: UserCreate) -> User:
    api_key = f"sk_{secrets.token_urlsafe(32)}"


    user_dict = {
        "email": user_data.email,
        "name": user_data.name,
        "api_key": api_key,
        "created_at": datetime.utcnow(),
    }

    result = await users_collection.insert_one(user_dict)

    user_dict["id"] = str(result.inserted_id)

    return User(**user_dict)

async def get_user_by_email(email: str) -> User:
    user = await users_collection.find_one({"email": email})
    return user