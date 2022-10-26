from dateutil.parser import isoparse
from common.mongo import add_stay_location
from positions.store import (
    NO_POISTION_ID,
    get_first_position_after,
    get_first_position_id,
    get_positions_df,
    get_uniqueId_from_deviceid,
    set_first_position_id,
)
from positions.traccar_models import TcPosition
from skmob import TrajDataFrame
from skmob.preprocessing import filtering, detection, clustering
from skmob.measures.individual import distance_straight_line
from geopy import Point
from geopy.distance import geodesic

stop_threshold_minute = 20
stop_threshold_km = 0.2
stop_waiting_threshold_seconds = 600
count = 0

def filter_and_detect_stops(df: TrajDataFrame) -> TrajDataFrame:
  """
  Filter and detect stops in the dataframe.
  """
  try:
      tdf = TrajDataFrame(df, latitude="latitude", longitude="longitude", datetime="fixtime", user_id="deviceid")
      print(tdf.shape)
      ftdf = filtering.filter(tdf, max_speed_kmh=300.0, include_loops=True)
      stdf = detection.stay_locations(
          ftdf, leaving_time=True, minutes_for_a_stop=stop_threshold_minute, spatial_radius_km=stop_threshold_km
      )
     
      len_tdf = len(tdf)
      if len_tdf > 19 and len_tdf % 20 == 0:
        distance_straight_line_result = distance_straight_line(tdf, False)
        print(distance_straight_line_result)
        print("start checking staypoint for recent 20 points")
        tem_tdf = tdf[len_tdf - 20:len_tdf]
        print(tem_tdf.head)
        # tem_stdf = detection.stay_locations(tem_tdf, leaving_time=True, minutes_for_a_stop=0.000000001, spatial_radius_km=0.000000000005)
        # print(tem_stdf)
        tem_ctdf = clustering.cluster(tem_tdf, cluster_radius_km=0.005, min_samples=1)
        print(tem_ctdf)
        
        # cluster index의 값을 기준으로 나눠야함
        # pd.counter
        
        if len(tem_ctdf) == 1:
          # notice to server
          print("staying one point now")
        elif len(tem_ctdf) > 1:
          print("moving now")
      return stdf
  except Exception as err:
      print("\n에러 발생", err)
      raise


def distance_from_stay_location(stdf, lat, lng):
  last_stop = stdf.iloc[0]
  return geodesic(Point(last_stop.lat, last_stop.lng), Point(lat, lng)).km


def detect_new_stop(data) -> bool:
  """
  Return ture if the data is a full stop.
  Return false if the data is a partial stop or no stop.
  """
  print("new position")
  new_position = TcPosition(**data)
  deviceid = new_position.deviceid
#   uniqueId = get_uniqueId_from_deviceid(deviceid)
  f_pid = get_first_position_id(deviceid)
  print(f_pid)
  if f_pid == NO_POISTION_ID:
      set_first_position_id(deviceid, new_position.id)
      return False
  df = get_positions_df(deviceid, f_pid, new_position.id)
  if df.empty:
      return False
  stdf = filter_and_detect_stops(df)
  if stdf.shape[0] == 1:  # Expected case: full stop
      distance = distance_from_stay_location(stdf, new_position.latitude, new_position.longitude)
      interval = (isoparse(new_position.fixtime) - stdf.iloc[0].leaving_datetime.to_pydatetime()).total_seconds()
      if distance > stop_threshold_km and interval > stop_threshold_minute * 60 + stop_waiting_threshold_seconds:
          add_stay_location(stdf.iloc[0], deviceid, "normal")
          last_stay = stdf.iloc[-1]
          last_datetime = last_stay.leaving_datetime.to_pydatetime()
          new_start_position_id = get_first_position_after(deviceid, last_datetime)
          set_first_position_id(deviceid, new_start_position_id)
          assert new_start_position_id != NO_POISTION_ID, f"Check: {deviceid} {last_datetime} {new_position}"
          return True
      elif interval < 0:
          if df.iloc[-1].id > new_position.id:
              print("\nData injection is too fast", f_pid, new_position.id)
              print(df.tail(5).to_markdown())
          else:
              # Missed point... ignore it
              pass
  elif stdf.shape[0] > 1:  # Jumped stop
    print(df.tail().to_markdown())
    print(stdf.head().to_markdown())
    print(new_position)
    for index, row in stdf.iloc[:-1].iterrows():
      add_stay_location(row, deviceid, "Multiple Stops")
   # Leave last_stay as candidate
    last_stay = stdf.iloc[-1]
    last_datetime = last_stay.leaving_datetime.to_pydatetime()
    new_start_position_id = get_first_position_after(deviceid, last_datetime)
    set_first_position_id(deviceid, new_start_position_id)
    print(stdf.head().to_markdown())

    print("새 포인트", new_start_position_id)
  return False
 