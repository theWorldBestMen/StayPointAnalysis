import datetime
from flask import request, render_template, jsonify, url_for, redirect, g
# from .models import User
from index import app, db, mongo
from sqlalchemy.exc import IntegrityError
from .utils.auth import hashed_password
from flask_jwt_extended import ( jwt_required, create_access_token, get_jwt_identity, 
                                unset_jwt_cookies, create_refresh_token, jwt_refresh_token_required )


@app.route('/', methods=['GET'])
def index():
    return jsonify(message='hello')


# @app.route('/<path:path>', methods=['GET'])
# def any_root_path(path):
#     return jsonify(message='abc')


# @app.route("/users", methods=["GET"])
# @requires_auth
# def get_user():
#     return jsonify(result=g.current_user)


@app.route("/auth/signup", methods=["POST"])
def signup():
    if not request.is_json:
        return jsonify(message="JSON 형식으로 요청해야 합니다."), 400
    
    incoming = request.get_json()
    
    name = incoming["name"]
    email = incoming["email"]
    password = incoming["password"]
    
    if not name:
        return jsonify(message="이름이 없습니다."), 400
    if not email:
        return jsonify(message="이메일이 없습니다."), 400
    if not password:
        return jsonify(message="비밀번호가 없습니다."), 400
    
    try:
        hashed_pw = hashed_password(password)
        id = mongo.db.user.insert({'name': name, 'email': email, 'password': hashed_pw})
        
        return jsonify(message="회원가입이 완료되었습니다."), 200
    except IntegrityError:
        return jsonify(message="이미 가입된 이메일입니다."), 409


    
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

    if email != 'test' or password != 'test': # TODO: DB 검색
        return jsonify(message="이메일 혹은 비밀번호가 일치하지 않습니다."), 401
    
    # Identity can be any data that is json serializable
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)

    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.route('/refresh', methods=['GET'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify(access_token=access_token, current_user=current_user)


# 긴 시간이 필요한 토큰 발급(1일)
@app.route('/refresh_long', methods=['GET'])
@jwt_refresh_token_required
def refreshLong():
    cur_user = get_jwt_identity()
    delta = datetime.timedelta(days=1)
    access_token = create_access_token(identity=cur_user, expires_delta=delta)
    return jsonify(access_token=access_token)





# @app.route("/get_token", methods=["POST"])
# def get_token():
#     incoming = request.get_json()
#     user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
#     if user:
#         return jsonify(token=generate_token(user))

#     return jsonify(error=True), 403


# @app.route("/is_token_valid", methods=["POST"])
# def is_token_valid():
#     incoming = request.get_json()
#     is_valid = verify_token(incoming["token"])

#     if is_valid:
#         return jsonify(token_is_valid=True)
#     else:
#         return jsonify(token_is_valid=False), 403
