import csv
from common.config import read_config
from pg_watcher.pg_trigger import PgTrigger
from positions.positions import detect_new_stop
from common.daemon_thread import prompt_in_terminal, run_thread
import json
from common.mongo import client
from datetime import datetime
import time

from positions.positions import filter_and_detect_stops


def run_trigger(trigger: PgTrigger):
  count = 0
  print("[TRIGGER] Reading status")

  running_triggers = PgTrigger.status(trigger.conn)
  print(running_triggers)

  if len(running_triggers) > 0:
    trigger.drop()
  print("[TRIGGER] Create Trigger")
  trigger.create()
  
  print("[TRIGGER] Waiting payloads...")
  for payload in trigger:
    data = json.loads(payload)["data"]
    count += 1
    if(count %10 == 0):
      print("data count: " + str(count))
    yield data
  

def main():
  print("start app.py")
  
  # read config
  configs= read_config()
  
  pg_trigger = PgTrigger(pg_config=configs["postgres"])
  print(pg_trigger.conn)

  heartbeat_timeout = 5
  run_thread(prompt_in_terminal, heartbeat_timeout)
  
  for new_position in run_trigger(pg_trigger):
    detect_new_stop(new_position)
  
  print("end")
  
if __name__ == "__main__":
  count = 0
  main()
