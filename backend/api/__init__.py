from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt


TRACCAR_API_URL="http://localhost:8082"

mongo = PyMongo()
bcrypt = Bcrypt()