from flask import request, jsonify, Blueprint
from flask_jwt_extended import ( jwt_required, create_access_token, get_jwt_identity, create_refresh_token )

from pytraccar.api import TraccarAPI

from . import mongo, TRACCAR_API_URL
from constant import role



researcher = Blueprint("researcher", __name__)


@researcher.route('')
def get_researchers():
    if mongo.db is None:
        return jsonify(message="db error"), 500
    
    researchers = mongo.db.user.find({'role': role.RESEARCHER})
    
    if not researchers:
        return jsonify(message="no researchers data"), 400
    
    data = []
    for researcher in researchers:
        researcher_data = {
            "name": researcher["name"],
            "email": researcher["email"],
        }
        data.append(researcher_data)
    
    return jsonify(data=data), 200
  
@researcher.route('/subjects')
@jwt_required()
def get_subjects_by_researchers():
    current_user = get_jwt_identity()
    if mongo.db is None:
        return jsonify(message="db error"), 500
    
    user_info = mongo.db.user.find_one({'email': current_user})
    
    if not user_info:
        return jsonify(message="no user data"), 400
    
    if user_info["role"] != role.RESEARCHER:
        return jsonify(message="not researcher"), 400
    
    subjects = mongo.db.user.find({'email': {'$in': user_info["subjects"]}})
    
    device_id_to_subject = {}
    for subject in subjects:
        subject_data = {
            "name": subject["name"],
            "email": subject["email"],
        }
        device_id_to_subject[subject["device_id"]] = subject_data
    
    print(device_id_to_subject)
    
    traccar = TraccarAPI(base_url=TRACCAR_API_URL)
    traccar.login_with_credentials(username='admin', password='admin')
    device_info_list = traccar.get_all_devices()
    
    for device_info in device_info_list:
        device_id = device_info["id"]
        if device_id in device_id_to_subject:
            device_id_to_subject[device_id]["device_info"] = device_info
    
    data = []
    for subject_data in device_id_to_subject.values():
        data.append(subject_data)
    
    return jsonify(data=data), 200

    
    
    
  