import redis
from common.config import read_config
from common.postgres import engine_sqlalchemy
import pandas as pd

# Connection postgres
configs = read_config()
engine = engine_sqlalchemy(**configs["postgres"])

# Reset Storage when starting
redis_con = redis.Redis(host='127.0.0.1',port=6379)
redis_con.flushall()


NO_POISTION_ID = -1

def set_first_position_id(deviceid: int, positionid: int) -> None:
    """
    Set the first position id of a device.
    """
    redis_con.set(f"first_position:{deviceid}", positionid)
    # first_deviceid = deviceid
    # first_positionid = positionid    


def get_first_position_id(deviceid: int) -> int:
    """
    Get the first position id of a device from the Redis database.
    """
    f_pid = redis_con.get(f"first_position:{deviceid}")
    # f_pid = first_deviceid
    # return int(f_pid) if f_pid is not -10 else NO_POISTION_ID
    return int(f_pid) if f_pid is not None else NO_POISTION_ID


def get_positions_df(deviceid: int, start: int, end: int) -> pd.DataFrame:
    """
    Get the dataframe for the positions of a device from the Postgres database.
    Note: Timestamp in specoatadnetc_positions has not timezone. It is treated as utc.
    """
    df = pd.read_sql(
        f"SELECT * FROM tc_positions WHERE deviceid = {deviceid} AND id >= {start} AND id <= {end} ORDER BY fixtime",
        engine,
    )
    return df


def get_positions_df_by_uniqueId(uniqueId: str, start: int) -> pd.DataFrame:
    """
    Get the dataframe for the positions of a device from the Postgres database.
    """
    deviceid = get_deviceid_from_uniqueId(uniqueId)
    df = get_positions_df(deviceid, start)
    return df


def get_deviceid_from_uniqueId(uniqueId: str) -> int:
    """
    Get the deviceid from the uniqueId.
    """
    df = pd.read_sql(f"SELECT id FROM tc_devices WHERE uniqueid = '{uniqueId}'", engine)
    return int(df.iloc[0]["id"])


def get_uniqueId_from_deviceid(deviceid: int) -> str:
    """
    Get the uniqueId from the deviceid.
    """
    df = pd.read_sql(f"SELECT uniqueid FROM tc_devices WHERE id = {deviceid}", engine)
    return df.iloc[0]["uniqueid"]


def get_first_position_after(deviceid: int, datetime: str) -> int:
    """
    Get the first position after the datetime.
    """
    df = pd.read_sql(
        f"SELECT id FROM tc_positions WHERE deviceid = {deviceid} AND fixtime > '{datetime}' ORDER BY fixtime LIMIT 1",
        engine,
    )
    if df.shape[0] == 0:
        return NO_POISTION_ID
    return int(df.iloc[0]["id"])
