from flask import request, jsonify, Blueprint

from flask_jwt_extended import ( jwt_required, create_access_token, get_jwt_identity, create_refresh_token )
import os
import json
import requests

import skmob
from skmob.preprocessing import clustering

from pytraccar.api import TraccarAPI

from . import mongo, TRACCAR_API_URL

from collections import defaultdict

from dotenv import load_dotenv

load_dotenv()

client_id = os.environ.get('client_id')
client_secret = os.environ.get('client_secret')

stay_point = Blueprint("stay_point", __name__)

def get_address_from_json(result):
  new_str = json.dumps(result)

  json_object = json.loads(new_str)
  if json_object.get('status').get('code') != 0:
    return 0;
  else:
    json_result_list = json_object["results"] 
    count = 0
    for json_result in json_result_list:
      json_result_object = json_result
      json_region = json_result_object["region"]
      if count == 0:
        json_object = {
            "sido": json_region['area1']['name'],
            "gungu": json_region['area2']['name'],
            "dong": json_region['area3']['name'],
            "ri":json_region['area4']['name'],
           }
        count += 1
      if json_result_object["name"] == "roadaddr":
        json_land = json_result_object["land"]
        json_object["doro"] = json_land['name']
        json_object["num1"] = json_land['number1']
        json_object["num2"] = json_land['number2']
        json_object["type"] = json_land['addition0']
    count = 0
    return(json_object)

def get_address(coord):
  coords = coord
  output = "json"
  orders = 'roadaddr'
  endpoint = "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc"

  url = f"{endpoint}?coords={coords}&output={output}&orders={orders}"

  header = {
    "X-NCP-APIGW-API-KEY-ID": client_id,
    "X-NCP-APIGW-API-KEY": client_secret,
  }

  res = requests.get(url, headers=header)
  result = res.json()
  return get_address_from_json(result)

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
  
@stay_point.route('/<user_email>/sigungu')
@jwt_required()
def get_stay_points_sigungu_count(user_email):
    if mongo.db is None:
      return jsonify(message="db error"), 500

    user_info = mongo.db.user.find_one({'email': user_email})

    if not user_info:
      return jsonify(message="no user data"), 400
    
      
    stay_points = mongo.db.devices.find({"deviceid": user_info["device_id"]})

    data = defaultdict(int)
    for stay_point in stay_points:
      data[stay_point["gungu"]] += 1

    return jsonify(data=data), 200
  
@stay_point.route('/<user_email>/cluster')
@jwt_required()
def get_stay_points_cluster_count(user_email):
    if mongo.db is None:
      return jsonify(message="db error"), 500

    user_info = mongo.db.user.find_one({'email': user_email})

    if not user_info:
      return jsonify(message="no user data"), 400
    
    stay_points = mongo.db.devices.find({"deviceid": user_info["device_id"]})

    data_list = []
    for stay_point in stay_points:
      data_list.append([stay_point["deviceid"], stay_point["lat"], stay_point["lng"], stay_point["datetime"]])
    tdf = skmob.TrajDataFrame(data_list, latitude=1, longitude=2, datetime=3)
    cstdf = clustering.cluster(tdf, cluster_radius_km=0.1, min_samples=1)
    
    clusters = {}
    for idx, point in cstdf.iterrows():
      cluster_num = str(point["cluster"])
      if cluster_num in clusters:
        clusters[cluster_num]["center_lat"] += point["lat"]
        clusters[cluster_num]["center_lng"] += point["lng"]
        clusters[cluster_num]["point_count"] += 1
      else:
        clusters[cluster_num] = {
          "center_lat" : 0,
          "center_lng" : 0,
          "point_count" : 0,
        }
        clusters[cluster_num]["center_lat"] += point["lat"]
        clusters[cluster_num]["center_lng"] += point["lng"]
        clusters[cluster_num]["point_count"] += 1
        
    for k, v in clusters.items():
      clusters[k]['center_lat'] /= clusters[k]['point_count']
      clusters[k]['center_lng'] /= clusters[k]['point_count']
    
    data = sorted(clusters.items(), key=lambda x: x[1]['point_count'], reverse=True)[:5]
    for point_data in data:
      lat = point_data[1]['center_lat']
      lng = point_data[1]['center_lng']
      coord = f'{lng},{lat}'
      point_data[1]['address'] = get_address(coord)
      
    return jsonify(data=data), 200
