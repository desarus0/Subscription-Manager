from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database 
    CONNECTION_STRING: str
    DATABASE_NAME: str

    # Logging settings
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"

settings = Settings()