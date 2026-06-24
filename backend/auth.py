from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import sqlite3

router = APIRouter()
security = HTTPBearer()

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "mysecretkey")
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

DB_PATH = os.path.join(os.path.dirname(__file__), "copilot.db")


# =========================
# DATABASE SETUP
# =========================

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            job_role TEXT DEFAULT 'Developer',
            experience INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


# Initialize DB on import
init_db()


# =========================
# MODELS
# =========================

class RegisterRequest(BaseModel):
    full_name: str = Field(..., alias="name")
    email: str
    password: str
    job_role: str = Field("Developer", alias="role")
    experience: int = 0

    class Config:
        allow_population_by_field_name = True


class LoginRequest(BaseModel):
    email: str
    password: str


# =========================
# PASSWORD FUNCTIONS
# =========================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


# =========================
# JWT TOKEN
# =========================

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    conn = get_db()
    try:
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (payload.get("email"),)
        ).fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return {
            "name": user["full_name"],
            "email": user["email"],
            "role": user["job_role"],
            "experience": user["experience"],
        }
    finally:
        conn.close()


# =========================
# REGISTER
# =========================

@router.post("/register")
async def register(data: RegisterRequest):
    conn = get_db()
    try:
        existing = conn.execute(
            "SELECT email FROM users WHERE email = ?", (data.email,)
        ).fetchone()
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")

        conn.execute(
            "INSERT INTO users (full_name, email, password, job_role, experience) VALUES (?, ?, ?, ?, ?)",
            (data.full_name, data.email, hash_password(data.password), data.job_role, data.experience)
        )
        conn.commit()
        token = create_token({"email": data.email})
        return {
            "token": token,
            "user": {
                "name": data.full_name,
                "email": data.email,
                "role": data.job_role,
                "experience": data.experience,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    finally:
        conn.close()


# =========================
# LOGIN
# =========================

@router.post("/login")
async def login(data: LoginRequest):
    conn = get_db()
    try:
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (data.email,)
        ).fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not verify_password(data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_token({"email": user["email"]})

        return {
            "token": token,
            "user": {
                "name": user["full_name"],
                "email": user["email"],
                "role": user["job_role"],
                "experience": user["experience"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
    finally:
        conn.close()


# =========================
# GET CURRENT USER (/me)
# =========================

@router.get("/me")
async def get_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    conn = get_db()
    try:
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (payload.get("email"),)
        ).fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return {
            "user": {
                "name": user["full_name"],
                "email": user["email"],
                "role": user["job_role"],
                "experience": user["experience"]
            }
        }
    finally:
        conn.close()