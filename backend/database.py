from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["interview_db"]

users_collection = db["users"]
sessions_collection = db["sessions"]
answers_collection = db["answers"] 