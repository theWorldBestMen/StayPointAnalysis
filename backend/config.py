import os
from dotenv import load_dotenv

load_dotenv()

# postgres settings
pg_user = os.environ.get('PG_USER')
pg_password = os.environ.get('PG_PASSWORD')
pg_host = os.environ.get('PG_HOST')
pg_port = os.environ.get('PG_PORT')
pg_database = os.environ.get('PG_DB')

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
    SQLALCHEMY_DATABASE_URI = f'postgresql://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_database}'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    JWT_SECRET_KEY = "SO_JWT_SECURE"
    JWT_ACCESS_TOKEN_EXPIRES = FIFTEEN_MINUTES
    JWT_REFRESH_TOKEN_EXPIRES = THIRTY_DAYS
    MONGO_URI = f'mongodb://{mg_user}:{mg_password}@{mg_host}:{mg_port}/{mg_database}'


class TestingConfig(object):
    """Development configuration."""
    TESTING = True
    DEBUG = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    DEBUG_TB_ENABLED = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False