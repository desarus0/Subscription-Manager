from fastapi import FastAPI
from api.v1 import auth, subscriptions, analytics
from core.logger import logger
from middleware.cors import add_cors
from contextlib import asynccontextmanager

app_version = "1.0.0"

app = FastAPI(
    title="Subscription Manager",
    description="Track and manage your subscriptions",
    version=app_version
)

add_cors(app)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])

@app.get("/")
async def root():
    return {
        "message": "Subscription Manager API",
        "status": "running",
        "version": app_version
    }

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Subscription Manager API starting")
    yield
    logger.info("Subscription Manager API shutting down")