from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    name: str

class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: EmailStr
    name: str
    password_hash: str
    api_key: str
    created_at: datetime = datetime.utcnow()

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    name: str
    api_key: str