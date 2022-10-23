from typing import Any, Optional, TypedDict
from sqlalchemy import create_engine
import psycopg2


class PgTriggerConfig(TypedDict):
    name: str
    table: str
    channel: str
    timeout: int

class PgConnectionConfig(TypedDict):
    username: str
    password: str
    host: str
    port: int
    dbname: str 
    trigger: Optional[PgTriggerConfig]

def connect_psycopg2(username: str = "postgres",
    password: str = None,
    host: str = "postgres",
    port: int = 5432,
    dbname: str = "postgres",
    **kwargs,):
    pg_url = f"postgres://{username}:{password}@{host}:{port}/{dbname}"
    print("Psycopg2 Connection with", pg_url)
    conn = psycopg2.connect(pg_url)
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)

    return test_connection(conn)

def engine_sqlalchemy(
    username: str = "postgres",
    password: str = None,
    host: str = "postgres",
    port: int = 5432,
    dbname: str = "postgres",
    **kwargs,
):
    pg_url = f"postgresql://{username}:{password}@{host}:{port}/{dbname}"
    print("SQLAlchemy postgresql Connection with", pg_url)
    engine = create_engine(pg_url)
    test_connection(engine.connect().connection)
    return engine

def test_connection(conn:Any):
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1")
        print("Connected!")
    except psycopg2.OperationalError:
        raise Exception("Pstgres Connection Failed")
    except Exception as err:
        raise Exception("Unknown Error", err)
    return conn
