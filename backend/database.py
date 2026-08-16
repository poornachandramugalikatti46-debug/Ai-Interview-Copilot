from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

mongo_uri = os.getenv("MONGODB_URI")
if not mongo_uri:
    raise ValueError("MONGODB_URI is not configured.")

client = MongoClient(mongo_uri)
db = client["interview_db"]

users_collection = db["users"]
sessions_collection = db["sessions"]
answers_collection = db["answers"] 