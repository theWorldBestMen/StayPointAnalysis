from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import BaseConfig
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo

app = Flask(__name__, static_folder="./static/dist", template_folder="./static")
app.config.from_object(BaseConfig)
db = SQLAlchemy(app)
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
cors = CORS(app, resources={r'*': {'origins': 'http://localhost:3000'}})
jwt = JWTManager(app)