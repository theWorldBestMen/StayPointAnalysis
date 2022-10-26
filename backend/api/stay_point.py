from flask import request, jsonify, Blueprint

from flask_jwt_extended import ( jwt_required, create_access_token, get_jwt_identity, create_refresh_token )

from pytraccar.api import TraccarAPI

from . import mongo, TRACCAR_API_URL

stay_point = Blueprint("stay_point", __name__)

@stay_point.route('/<user_email>')
@jwt_required()
def get_stay_points(user_email):
    if mongo.db is None:
      return jsonify(message="db error"), 500

    user_info = mongo.db.user.find_one({'email': user_email})

    if not user_info:
      return jsonify(message="no user data"), 400
    
      
    stay_points = mongo.db.devices.find({"deviceid": user_info["device_id"]})

    data = []
    for stay_point in stay_points:
      stay_point_data = {
        "id": stay_point["id"], 
        "device_id": stay_point["deviceid"],
        "datetime": stay_point["datetime"],
        "leaving_datetime": stay_point["leaving_datetime"],
        "lat": stay_point["lat"],
        "lng": stay_point["lng"],
        "sido": stay_point["sido"],
        "gungu": stay_point["gungu"],
        "dong": stay_point["dong"],
        "doro": stay_point["doro"],
        "num1": stay_point["num1"],
        "num2": stay_point["num2"],
        "type": {
          "type": stay_point["type"]["type"],
          "value": stay_point["type"]["value"],
        },
      }
      data.append(stay_point_data)
    data.sort(key=lambda x: x["datetime"])
    data = data[::-1]
    return jsonify(data=data), 200
