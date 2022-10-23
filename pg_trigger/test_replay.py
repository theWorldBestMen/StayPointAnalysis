from typing import Union
from dateutil.parser import isoparse
import time
import pandas as pd
from pandas._libs.tslibs.timestamps import Timestamp
from common.config import read_config
from datetime import datetime
from common.postgres import engine_sqlalchemy
from common.postgres import connect_psycopg2
import psycopg2
from common.postgres import PgConnectionConfig, test_connection

configs = read_config()
pg_conn = connect_psycopg2(**configs["postgres"])
# pg_conn = engine_sqlalchemy(**configs["postgres"])

def replay_trajectory_in_pg(df, period=1):
    for index, row in df.iterrows():
        print("add data")
        
        with pg_conn.cursor() as cur:
            query = """
            insert into tc_positions
              (protocol, id, deviceid, servertime, devicetime, fixtime, valid,
               latitude, longitude, altitude, speed, course, accuracy, attributes, address, network)
            values
              ('replay', %s, '0011', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cur.execute(
                query,
                (   
                    row["id"],
                    # row["deviceid"],
                    datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    row["devicetime"],
                    row["fixtime"],
                    True,
                    row["latitude"],
                    row["longitude"],
                    row["altitude"],
                    row["speed"],
                    row["course"],
                    row["accuracy"],
                    row["attributes"],
                    row['address'],
                    row['network'],
                ),
            )
        time.sleep(period)

def create_replay_df_from_csv(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path, low_memory=False)
    df["fixtime"] = df["fixtime"].apply(lambda x: isoparse(x))
    return df
  
def main():
    # Load replay data
    csv_path = "./location_data/30-CYR.csv"
    df = create_replay_df_from_csv(csv_path)

    # Remove Positions outside Korea penninsula
    korean_east = 131.5222
    korean_west = 124.3636
    korean_north = 38.3640
    korean_south = 33.0643
    df = df[(df["latitude"] < korean_north) & (df["latitude"] > korean_south)]
    df = df[(df["longitude"] < korean_east) & (df["longitude"] > korean_west)]

    # Replay
    replay_trajectory_in_pg(df, 0)

if __name__ == "__main__":
    main()
    pg_conn.close()
