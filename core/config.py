import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    FIREBASE_KEY_PATH: str = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY", "config/serviceAccountKey.json")
    
    # LA LIGNE DOIT ÊTRE EXACTEMENT ICI, AVEC CETTE ORTHOGRAPHE :
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    LLM_MODEL: str = os.getenv("LLM_MODEL", "llama-3.1-8b-instant") 
    LLM_TEMPERATURE: float = 0.4

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()