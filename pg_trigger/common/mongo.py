from ast import main
from curses import def_shell_mode
from this import d
from typing import Any, List
from pymongo.mongo_client import MongoClient
from common.config import read_config
import skmob
from datetime import datetime
from positions.reverse_geocoding import get_address

configs = read_config()
mongo_url = "mongodb://{host}:{port}".format(**configs["mongo"])
print("print mongo client" +  mongo_url)
client = MongoClient(mongo_url)


def get_device(deviceid: int):
    """
    Read the device from the Mongo database.
    """
    db = client.traccar
    return db.devices.find_one({"id": deviceid})


def add_stay_location(location_df: skmob.TrajDataFrame, deviceId: str, tag: str = None):
    """
    Add the stay location of a device.
    """
    
    data_columns = ["id", "uid", "datetime", "lat", "lng", "altitude", "leaving_datetime", "attributes"]
    
    data = location_df[data_columns].to_dict()
    # if uniqueId:
    #     data["uniqueId"] = uniqueId

    if tag:
        data["tag"] = tag

    data["deviceid"] = data["uid"]
    
    data["raw"] = location_df.to_json()
    address_json = get_address(str(data["lng"]) + "," + str(data["lat"]))
    
    for key in address_json:
        data[key] = address_json[key]

    db = client.traccar
    print("staypoint added")
    db.devices.insert_one(data)
    

def get_stay_locations(deviceid: int, start: datetime = None, end: datetime = None) -> List[Any]:
    """
    Read the stay locations of a device.
    """

    db = client.traccar
    start = start if start else datetime(1970, 1, 1)
    if end is None:
        return db.devices.find({"deviceid": deviceid, "datetime": {"$gte": start}})
    else:
        return db.devices.find({"deviceid": deviceid, "datetime": {"$gte": start, "$lte": end}})


def get_devices() -> List[int]:
    """
    Get the deviceids from the Mongo database.
    """
    db = client.traccar
    return db.devices.distinct("deviceid")
