from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiohttp
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# OpenRouter API configuration
API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    raise ValueError("OPENROUTER_API_KEY not found in environment variables")

API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordCheck(BaseModel):
    password: str

class PasswordResponse(BaseModel):
    score: int
    suggestion: str

async def check_password_with_ai(password: str) -> tuple[int, str]:
    """Use OpenRouter to check password strength and get suggestions."""
    system_message = """You are an expert password strength checker. Analyze the password and return a JSON object with two fields:
    1. 'score': An integer from 0-2 where:
       - 0 means weak password (lacks complexity, too short, or too simple)
       - 1 means medium password (has some complexity but could be stronger)
       - 2 means strong password (good length and complexity)
    2. 'stronger_password': Create a suggestion based on these rules:
       - For scores 0 or 1:
         * Make it at least 16 characters long
         * Include uppercase and lowercase letters
         * Include numbers and special characters (!@#$%^&*()_+-=[]{}|;:,.<>?)
         * Try to incorporate parts of the original password but make it more complex
         * Add random special characters in between
         * Example: if input is "cat123", suggest something like "C@t123_Purr!ng$456"
       - For score 2:
         * If already strong, respond with a fun compliment "Damn Bro Crazy Password!"
    
    Example response for weak password: {"score": 0, "stronger_password": "H3ll0_W0rld$2024!@"}
    Example response for medium password: {"score": 1, "stronger_password": "P@ssw0rd_Str0ng!2024$"}
    Example response for strong password: {"score": 2, "stronger_password": "Damn Bro Crazy Password!"}"""
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Password Strength Checker"
    }
    
    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": f"Password: {password}"}
        ]
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(API_URL, json=payload, headers=headers) as response:
                if response.status != 200:
                    raise Exception(f"API returned status code {response.status}")
                
                data = await response.json()
                ai_response = json.loads(data["choices"][0]["message"]["content"])
                return ai_response["score"], ai_response["stronger_password"]
    except Exception as e:
        print(f"Error calling OpenRouter API: {e}")
        # Fallback response
        return 0, password.capitalize() + "!#"

@app.post("/check-password", response_model=PasswordResponse)
async def check_password(password_data: PasswordCheck):
    """Check password strength and provide feedback using AI."""
    score, suggestion = await check_password_with_ai(password_data.password)
    
    return PasswordResponse(
        score=score,
        suggestion=suggestion
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 