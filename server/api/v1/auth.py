from fastapi import APIRouter, HTTPException, status
from models.user import UserResponse, UserCreate
from core.logger import logger
from services.db.users import create_user, get_user_by_email

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    # Check if email exists in database
    existing_email = await get_user_by_email(user_data.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="EMAIL_ACTIVE")
    
    user = await create_user(user_data)

    logger.info(f"New user registered: {user.email}")

    return UserResponse(
        email=user.email, 
        name=user.name, 
        api_key=user.api_key
    )
