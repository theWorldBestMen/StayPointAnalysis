from flask import request, jsonify, Blueprint

from flask_jwt_extended import ( jwt_required, create_access_token, get_jwt_identity, create_refresh_token )

from . import mongo, TRACCAR_API_URL

user = Blueprint("user", __name__)

@user.route('/')
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
  

@user.route('/refresh')
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    
    return jsonify(access_token=access_token, current_user=current_user)