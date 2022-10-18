import os
from dotenv import load_dotenv

load_dotenv()

# mongo settings
mg_user = os.environ.get('MG_USER')
mg_password = os.environ.get('MG_PASSWORD')
mg_host = os.environ.get('MG_HOST')
mg_port = os.environ.get('MG_PORT')
mg_database = os.environ.get('MG_DB')

FIFTEEN_MINUTES = 15*60
THIRTY_DAYS = 30*24*60*60

class BaseConfig(object):
    SECRET_KEY = "SO_SECURE"
    DEBUG = True
    JWT_SECRET_KEY = "SO_JWT_SECURE"
    JWT_ACCESS_TOKEN_EXPIRES = FIFTEEN_MINUTES
    JWT_REFRESH_TOKEN_EXPIRES = THIRTY_DAYS
    MONGO_URI = f'mongodb://{mg_user}:{mg_password}@{mg_host}:{mg_port}/{mg_database}'