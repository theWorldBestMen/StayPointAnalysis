from common.config import read_config
import requests
import json

configs = read_config()
config = configs["naver"]


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
    "X-NCP-APIGW-API-KEY-ID": config.get('client_id'),
    "X-NCP-APIGW-API-KEY": config.get('client_secret'), 
  }

  res = requests.get(url, headers=header)
  result = res.json()
  return get_address_from_json(result)
