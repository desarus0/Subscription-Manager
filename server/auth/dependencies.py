import jwt
from jwt import PyJWKClient
from fastapi import Header, HTTPException, status
from core.config import settings

jwks_client = PyJWKClient(settings.CLERK_JWKS_URL)

async def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.removeprefix("Bearer ")
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(token, signing_key.key, algorithms=["RS256"])
        return {"clerk_user_id": payload["sub"]}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
