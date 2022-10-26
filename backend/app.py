from flask import Flask

from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import BaseConfig
from api import mongo, bcrypt
from api.auth import auth
from api.user import user
from api.researcher import researcher
from api.stay_point import stay_point


app = Flask(__name__)
app.config.from_object(BaseConfig)
cors = CORS(app, resources={r'*': {'origins': 'http://localhost:3000'}})
jwt = JWTManager(app)
mongo.init_app(app)
bcrypt.init_app(app)

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(user, url_prefix='/user')
app.register_blueprint(researcher, url_prefix='/researcher')
app.register_blueprint(stay_point, url_prefix='/stay_point')


if __name__ == "__main__":
  app.run()