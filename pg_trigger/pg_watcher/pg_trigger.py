import select
from socket import create_connection
from typing import Any, Optional, List, Tuple
import psycopg2
import traceback
from common.postgres import (
    PgConnectionConfig,
    PgTriggerConfig,
    test_connection,
    engine_sqlalchemy,
    connect_psycopg2)


class PgTrigger:
    conn: Any
    trigger: PgTriggerConfig

    def __init__(
        self,
        conn: Optional[Any] = None,
        pg_config: Optional[PgConnectionConfig] = None,
    ):
        # Configuration File has priority than conn or dry_run values
        self.conn = test_connection(conn) if conn else connect_psycopg2(**pg_config)
        print("Postgres Connected")

        self.trigger = pg_config.get("trigger")
        if self.trigger is None:
            raise Exception("No trigger Configuration")

        name = self.trigger.get("name")
        table = self.trigger.get("table")
        channel = self.trigger.get("channel", "channel")
        timeout = self.trigger.get("timeout", 5)

        if None in [name, table, channel, timeout]:
            raise Exception("Wrong Trigger Configuration", pg_config["trigger"])

        print(f"Postgres Trigger '{name}' for table '{table}' is Ready")

    @staticmethod
    def from_config():
        pass

    @staticmethod
    def status(conn) -> List[Tuple[str, str]]:
        try:
            curs = conn.cursor()
            curs.execute("SELECT * FROM information_schema.triggers")
            results = curs.fetchall()
            trigger_index = 2
            table_index = 6
            triggers = list(map(lambda row: (row[trigger_index], row[table_index]), results))
            return triggers
        except Exception:
            print("[STATUS] Cannot Connect DB")
            traceback.print_exc()
            raise

    def create(self) -> bool:
        sql_create_fn = f"""
        CREATE OR REPLACE FUNCTION notify_event() RETURNS TRIGGER AS $$
          DECLARE
            record RECORD;
            payload JSON;
            BEGIN
                IF (TG_OP = 'DELETE') THEN
                record = OLD;
                ELSE
                record = NEW;
                END IF;
                payload = json_build_object('table', TG_TABLE_NAME,
                                            'action', TG_OP,
                                            'data', row_to_json(record));
                PERFORM pg_notify('{self.trigger['channel']}', payload::text);
                RETURN NULL;
            END;
        $$ LANGUAGE plpgsql;
        """
        sql_trigger = (
            f"CREATE TRIGGER {self.trigger['name']} AFTER INSERT ON {self.trigger['table']} FOR EACH ROW EXECUTE"
            " PROCEDURE notify_event();"
        )
        try:
            curs = self.conn.cursor()
            curs.execute(sql_create_fn)
            print(f"[CREATE] FUNCTION on CHANNEL '{self.trigger['channel']}'")
            curs.execute(sql_trigger)
            print(f"[CREATE] TRIGGER {self.trigger['name']} on {self.trigger['table']}")
            self.conn.commit()
        except Exception as err:
            if isinstance(err, psycopg2.errors.DuplicateObject):
                print(f"[CREATE] Already existing Trigger: {self.trigger['name']}")
            else:
                print("[CREATE] Failed")
                traceback.print_exc()
                raise

    def drop(self) -> None:
        sql_drop = """DROP TRIGGER IF EXISTS {} ON {};""".format(self.trigger["name"], self.trigger["table"])
        curs = self.conn.cursor()
        curs.execute(sql_drop)
        print(f"DROP TRIGGER {self.trigger['name']} on {self.trigger['table']}")
        self.conn.commit()

    def __iter__(self):
        current_triggers = [
            (tup[0] == self.trigger["name"] and tup[1] == self.trigger["table"]) for tup in PgTrigger.status(self.conn)
        ]
        if True not in current_triggers:
            self.create()

        curs = self.conn.cursor()
        curs.execute(f"LISTEN {self.trigger['channel']}")
        print(f"LISTEN {self.trigger['channel']}")
        return self

    def __next__(self) -> str:
        while True:
            if not (select.select([self.conn], [], [], self.trigger["timeout"]) == ([], [], [])):
                self.conn.poll()
                while self.conn.notifies:
                    notify = self.conn.notifies.pop(0)
                    return notify.payload
