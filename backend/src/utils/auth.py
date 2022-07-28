from functools import wraps
from flask import request, g, jsonify
from itsdangerous import TimedSerializer as Serializer
from itsdangerous import SignatureExpired, BadSignature
from index import app

TWO_WEEKS = 1209600


def generate_token(user):
    s = Serializer(app.config['SECRET_KEY'])
    token = s.dumps({
        'id': user.id,
        'email': user.email,
    }).decode('utf-8')
    return token


def verify_token(token, max_age=TWO_WEEKS):
    s = Serializer(app.config['SECRET_KEY'])
    try:
        data = s.loads(token, max_age=max_age)
    except (BadSignature, SignatureExpired):
        return None
    return data


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('authorization', None)
        if token:
            string_token = token.encode('ascii', 'ignore')
            user = verify_token(string_token)
            if user:
                g.current_user = user
                return f(*args, **kwargs)

        return jsonify(message="Authentication is required to access this resource"), 401

    return decorated
