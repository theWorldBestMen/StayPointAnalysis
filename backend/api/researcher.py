from flask import request, jsonify, Blueprint
from flask_jwt_extended import ( jwt_required, create_access_token, get_jwt_identity, create_refresh_token )

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
  