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

TRACCAR_API_URL="http://localhost:8082"

ADMIN="admin"
RESEARCHER="researcher"
SUBJECT="subject"


@app.route('/', methods=['GET'])
def index():
    return jsonify(message='hello')


@app.route("/auth/signup", methods=["POST"])
def signup():
    if not request.is_json:
        return jsonify(message="JSON 형식으로 요청해야 합니다."), 400
    
    incoming = request.get_json()
    
    name = incoming["name"]
    phone = incoming["phone"]
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
    
    traccar_data = {
        "name": name,
        "email": email,
        "password": hashed_pw,
        'deviceLimit': 1,
    }
    
    # traccar id 생성
    basic_admin = HTTPBasicAuth('admin', 'admin')
    response = requests.post(url=TRACCAR_API_URL+"/api/users", json=traccar_data, auth=basic_admin)
    
    if response.status_code != 200:
        return jsonify(message="회원가입 오류(Traccar)"), 400
    
    # traccar device 등록
    user = TraccarAPI(base_url=TRACCAR_API_URL)
    user_info = user.login_with_credentials(username=email, password=hashed_pw)
    device = user.create_device(name="device", unique_id=phone[-4:])
    
    user_data = traccar_data
    user_data["phone"] = phone
    user_data["role"] = role
    user_data["device_id"] = device["uniqueId"]
    
    id = mongo.db.user.insert_one(user_data)
    
    user = mongo.db.user.find_one({'email': email})
    print(f'user info in mongo: {user}')
    
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
    
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    data = {
        "name": user_info["name"],
        "email": user_info["email"],
        "role": user_info["role"],
    }
    return jsonify(message="로그인 되었습니다.", access_token=access_token, refresh_token=refresh_token, data=data), 200


@app.route('/devices', methods=['GET'])
def devices_info():
    user = TraccarAPI(base_url=TRACCAR_API_URL)
    user.login_with_credentials(username='admin', password='admin')
    device = user.get_all_devices()
    
    return jsonify(data=device), 200


@app.route('/user', methods=['GET'])
@jwt_required()
def user_info():
    current_user = get_jwt_identity()
    user_info = mongo.db.user.find_one({'email': current_user})
    
    data = {
        "name": user_info["name"],
        "email": user_info["email"],
        "role": user_info["role"],
    }
    
    return jsonify(data=data), 200

@app.route('/researchers', methods=['GET'])
@jwt_required()
def get_researcher():
    researcher_list = mongo.db.user.find({'role': 'researcher'})
    result = [
        { 
            "name": researcher["name"], 
            "email": researcher["email"] 
        } 
        for researcher in researcher_list
    ]
    return jsonify(data=result), 200

@app.route('/researchers', methods=['POST'])
@jwt_required()
def subject_to_researcher():
    current_user = get_jwt_identity()
    
    incoming = request.get_json()
    researcher_email = incoming['researcher_email']
    
    researcher_data = mongo.db.user.find_one({'email': researcher_email})
    subject_data = mongo.db.user.find_one({'email': current_user})
    
    subject_list = researcher_data['subject_list']
    if not subject_list:
        subject_list = []
    subject_list.append({"email": subject_data["email"], "name": subject_data["name"]})
    
    researcher_info = {"email": researcher_email, "name": researcher_data["name"]}
    
    mongo.db.user.update_one({'email': researcher_email}, {'subject_list': subject_list})
    mongo.db.user.update_one({'email': current_user}, {'researcher_info': researcher_info})
    
    researcher_data = mongo.db.user.find_one({'email': researcher_email})
    subject_data = mongo.db.user.find_one({'email': current_user})
    print(researcher_data)
    print(subject_data)
    return jsonify(message="실험 참가자 등록 완료"), 200



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
