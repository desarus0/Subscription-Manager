from fastapi import Header, HTTPException, status
from database.db import users_collection

async def get_current_user(x_api_key: str = Header(...)):
    user = await users_collection.find_one({"api_key": x_api_key})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )

    return user

