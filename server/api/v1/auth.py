from fastapi import APIRouter, HTTPException, status, Depends
from models.user import UserResponse, UserCreate
from core.logger import logger
from services.db.users import create_user, get_user_by_email, delete_user
from auth.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    existing_email = await get_user_by_email(user_data.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="EMAIL_ACTIVE")

    user = await create_user(user_data)

    logger.info(f"New user registered: {user.email}")

    return UserResponse(
        email=user.email,
        name=user.name,
    )

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(current_user: dict = Depends(get_current_user)):
    clerk_user_id = current_user["clerk_user_id"]
    await delete_user(clerk_user_id)
    logger.info(f"User deleted: {clerk_user_id}")
