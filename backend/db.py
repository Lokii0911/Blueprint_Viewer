import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
load_dotenv()
#Creating Client
client = AsyncIOMotorClient(os.environ.get('MONGO_URI'))
db = client["langgraph_db"]
users_col = db["users"]
threads_col = db["threads"]
