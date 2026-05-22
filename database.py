from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

print("MONGO URI:", os.getenv("MONGO_URI"))  # ← agrega esto

client = MongoClient(os.getenv("MONGO_URI"))
db = client["glamour_db"]