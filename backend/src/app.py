import datetime
from flask import request, render_template, jsonify, url_for, redirect, g
# from .models import User
from index import app, db, mongo
from sqlalchemy.exc import IntegrityError
from .utils.auth import hashed_password, check_password
from flask_jwt_extended import ( jwt_required, create_access_token, get_jwt_identity, 
                                unset_jwt_cookies, create_refresh_token )
import requests
from requests.auth import HTTPBasicAuth
import json

from .utils.pytraccar.exceptions import (
    ForbiddenAccessException,
    InvalidTokenException,
    BadRequestException,
    ObjectNotFoundException,
    UserPermissionException
)

from .utils.pytraccar.api import TraccarAPI

from base64 import b64encode

ADMIN="admin"
RESEARCHER="researcher"
SUBJECT="subject"
TRACCAR_API_URL="http://localhost:8082"

basic_auth = HTTPBasicAuth('admin', 'admin')

@app.route('/', methods=['GET'])
def index():
    return jsonify(message='hello')


@app.route("/auth/signup", methods=["POST"])
def signup():
    if not request.is_json:
        return jsonify(message="JSON 형식으로 요청해야 합니다."), 400
    
    incoming = request.get_json()
    
    name = incoming["name"]
    email = incoming["email"]
    password = incoming["password"]
    role = incoming["role"]
    
    if not name:
        return jsonify(message="이름이 없습니다."), 400
    if not email:
        return jsonify(message="이메일이 없습니다."), 400
    if not password:
        return jsonify(message="비밀번호가 없습니다."), 400
    if not role:
        return jsonify(message="사용자 역할이 없습니다."), 400
    
    if mongo.db.user.find_one({'email': email}):
        return jsonify(message="이미 가입된 이메일입니다."), 400
    
    hashed_pw = hashed_password(password)
    
    data = {
        "name": name,
        "email": email,
        "password": hashed_pw,
    }
    
    print(data)
    response = requests.post(url=TRACCAR_API_URL+"/api/users", json=data, auth=basic_auth)
    
    if response.status_code != 200:
        return jsonify(message="회원가입 오류(Traccar)"), 400
    
    id = mongo.db.user.insert_one({'name': name, 'email': email, 'password': hashed_pw, 'role': role})
    
    return jsonify(message="회원가입이 완료되었습니다."), 200

    
@app.route('/auth/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify(message="JSON 형식으로 요청해야 합니다."), 400
    
    incoming = request.get_json()

    email = incoming["email"]
    password = incoming["password"]
    
    if not email:
        return jsonify(message="이메일이 없습니다."), 400
    if not password:
        return jsonify(message="비밀번호가 없습니다."), 400

    user_info = mongo.db.user.find_one({'email': email})
    if not user_info:
        return jsonify(message="가입하지 않은 이메일입니다."), 401
    
    user_pw = user_info['password']
    if not check_password(user_pw, password):
        return jsonify(message="비밀번호가 일치하지 않습니다."), 401
    
    user = TraccarAPI(base_url=TRACCAR_API_URL)
    result = user.login_with_credentials(username=email, password=user_pw)
    assert type(result) == dict
    
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    print()
    print(f"access_token: {access_token}")
    print()
    print(f"refresh_token: {refresh_token}")
    print()
    data = {
        "name": user_info["name"],
        "email": user_info["email"],
        #TODO: result data 넣기
    }
    return jsonify(message="로그인 되었습니다.", access_token=access_token, refresh_token=refresh_token, data=data), 200


@app.route('/users', methods=['GET'])
@jwt_required()
def user_info():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user_info = mongo.db.user.find_one({'email': current_user})
    
    user = TraccarAPI(base_url=TRACCAR_API_URL)
    email = user_info['email']
    password = user_info['password']
    result = user.login_with_credentials(username=email, password=password)
    assert type(result) == dict
    
    print(result)
    
    data = {
        "name": user_info["name"],
        "email": user_info["email"],
        "role": user_info["role"],
    }
    return jsonify(data=data), 200


@app.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify(access_token=access_token, current_user=current_user)


# 긴 시간이 필요한 토큰 발급(1일)
@app.route('/refresh_long', methods=['GET'])
@jwt_required(refresh=True)
def refreshLong():
    cur_user = get_jwt_identity()
    delta = datetime.timedelta(days=1)
    access_token = create_access_token(identity=cur_user, expires_delta=delta)
    return jsonify(access_token=access_token)
