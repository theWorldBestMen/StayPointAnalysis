from select import select
from flask import request, jsonify, Blueprint

from flask_jwt_extended import ( create_access_token, create_refresh_token )
import requests
from requests.auth import HTTPBasicAuth
from pytraccar.api import TraccarAPI

from . import mongo, bcrypt, TRACCAR_API_URL
from constant import role

import datetime

auth = Blueprint("auth", __name__)


@auth.route("/signup", methods=["POST"])
def signup():
    if not request.is_json:
        return jsonify(message="JSON 형식으로 요청해야 합니다."), 400
    
    incoming = request.get_json()
    
    if not incoming:
        return jsonify(message="error"), 400    
    
    name = incoming["name"]
    phone = incoming["phone"]
    email = incoming["email"]
    password = incoming["password"]
    role = incoming["role"]
    selected_researcher = incoming["selectedResearcher"]
    
    if not name:
        return jsonify(message="이름이 없습니다."), 400
    if not email:
        return jsonify(message="이메일이 없습니다."), 400
    if not password:
        return jsonify(message="비밀번호가 없습니다."), 400
    if not role:
        return jsonify(message="사용자 역할이 없습니다."), 400
    
    if mongo.db is None:
        return jsonify(message="database error"), 400
    
    if mongo.db.user.find_one({'email': email}):
        return jsonify(message="이미 가입된 이메일입니다."), 400
    
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    
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
    traccar = TraccarAPI(base_url=TRACCAR_API_URL)
    user_info = traccar.login_with_credentials(username=email, password=hashed_pw)
    device = traccar.create_device(name="device", unique_id=phone[-4:])
    
    user_data = traccar_data
    user_data["phone"] = phone
    user_data["role"] = role
    user_data["device_id"] = device["id"]
    
    if role == "researcher":
        user_data["subjects"] = []
    elif role == "subject":
        user_data["researcher"] = selected_researcher
        
        query = {'email': selected_researcher}
        researcher = mongo.db.user.find_one(query)
        researcher["subjects"].append(email)
        update_researcher = mongo.db.user.update_one(query, {"$set":researcher})
        print(update_researcher)
    
    id = mongo.db.user.insert_one(user_data)
    
    user = mongo.db.user.find_one({'email': email})
    
    return jsonify(message="회원가입이 완료되었습니다."), 200

@auth.route('/login', methods=['POST'])
def login():
    incoming = request.get_json()
    
    if not incoming:
        return jsonify(message="요청이 잘못되었습니다."), 400

    email = incoming["email"]
    password = incoming["password"]
    
    if not email:
        return jsonify(message="이메일이 없습니다."), 400
    if not password:
        return jsonify(message="비밀번호가 없습니다."), 400
    
    if mongo.db is None:
        return jsonify(message="database error"), 500

    user_info = mongo.db.user.find_one({'email': email})
    if not user_info:
        return jsonify(message="가입하지 않은 이메일입니다."), 401
    
    user_pw = user_info['password']

    if not bcrypt.check_password_hash(user_pw, password):
        return jsonify(message="비밀번호가 일치하지 않습니다."), 401
    
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)

    return jsonify(message="로그인 되었습니다.", access_token=access_token, refresh_token=refresh_token), 200