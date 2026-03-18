from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    clerk_user_id: str

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    name: str
    clerk_user_id: str
    created_at: datetime = datetime.utcnow()

class UserResponse(BaseModel):
    email: EmailStr
    name: str