from dataclasses import dataclass, field, astuple
from typing import Any, Optional
import json
import pandas as pd
from skmob import TrajDataFrame
from skmob.utils import constants
from geopy import Point, distance
import dateutil.parser
from datetime import timedelta


@dataclass
class TcPosition:
    protocol: str = field(repr=False)
    id: int
    deviceid: int
    servertime: str = field(repr=False)
    devicetime: str
    fixtime: str
    valid: bool
    latitude: float
    longitude: float
    altitude: float
    speed: int
    course: int
    accuracy: int
    attributes: Any
    address: Optional[str]
    network: Any = field(repr=False) 

    def __post_init__(self):
        if isinstance(self.attributes, str):
            self.attributes = json.loads(self.attributes)


class TcPositionDataFrame(TrajDataFrame):
    @classmethod
    def make_tdf(cls, df: pd.DataFrame):
        tdf = cls(df)
        return tdf

    @classmethod
    def init_df(cls, position: TcPosition, speed=0, acceleration=0, jerk=0, motion=None):
        data = [
            [position.latitude, position.longitude, position.devicetime, position.deviceid, speed, acceleration, jerk]
        ]
        if motion is not None:
            data = [
                [
                    position.latitude,
                    position.longitude,
                    position.devicetime,
                    position.deviceid,
                    motion.speed,
                    motion.acceleration,
                    motion.jerk,
                ]
            ]

        columns = [
            constants.LATITUDE,
            constants.LONGITUDE,
            constants.DATETIME,
            constants.UID,
            "speed",
            "acceleration",
            "jerk",
        ]
        df = pd.DataFrame(data, columns=columns)
        return cls.make_tdf(df)

    @classmethod
    def from_list_orient_dict(cls, data: Any):
        df = pd.DataFrame(data=data)
        return cls.make_tdf(df)

    def append_position(self, a_position: TcPosition, filtering=False) -> TrajDataFrame:
        motion = get_speed_and_accel_with_incoming_point(self.iloc[-1], a_position)
        a_tdf = TcPositionDataFrame.init_df(a_position, motion=motion)
        dist, _, _, jerk, sec = astuple(motion)
        # print("점 정보")
        # print(self.iloc[-1])
        # print(a_position)
        # print("accuracy", a_position.accuracy)
        # print("계산된 정보")
        # print("거리", dist, "시간", sec)
        # print("속력", motion.speed_kmh, "km/h. 가속력", motion.acceleration_kmhs, "km/h/s. 가가속도", jerk, "m/s^3")
        # input()
        # TODO: accuracy 기준 확인: 지하일 경우 1000 이상이 줄곧 나오지만 나쁜 점이 아닐 때도 있다. accuracy 가 나쁠 때 motion 기준을 별개로 정해야 한다
        if filtering:
            if not motion.is_in_normal():
                print("--- 필터 이유", motion)
                return self
        self = self.append(a_tdf, ignore_index=True)
        return TcPositionDataFrame(self)


# NOTICE: m/s 단위로 해야 일반적인 공식을 적용하기 쉽다. 대신 숫자가 적어지기 때문에 나중에 numpy 형으로 래핑해야할 수 있음
@dataclass
class Motion:
    """
    두 지점 간의 움직임 값 모음
    """

    dist: float = 0  # in m
    speed: float = 0  # in m/s
    acceleration: float = 0  # in m/s^2
    jerk: float = 0  # in m/s^3
    sec: float = 0  # second

    @classmethod
    def between_points(cls, p0: Point, p1: Point, duration: timedelta, p0_motion=None):
        if p0_motion is not None:
            sec = duration.total_seconds()
            dist = distance.distance(p0, p1).kilometers * 1000
            if sec != 0:
                speed = dist / sec
                d_speed = speed - p0_motion.speed
                acceleration = d_speed / sec
                d_acceleration = acceleration - p0_motion.acceleration
                jerk = d_acceleration / sec
                return cls(dist, speed, acceleration, jerk, sec)
        return cls()

    @property
    def dist_km(self):
        return self.dist * 1000

    @property
    def speed_kmh(self):
        return self.speed * 3.6

    @property
    def acceleration_kmhs(self):
        return self.acceleration * 3.6

    def is_in_normal(self, max_speed_kmh=300.0, max_acceleration_ms2=9.8, max_jerk_ms3=0.07):
        if self.speed_kmh >= max_speed_kmh or self.acceleration >= max_acceleration_ms2 or self.jerk >= max_jerk_ms3:
            return False
        return True


def get_speed_and_accel_with_incoming_point(last_row, a_position: TcPosition):
    last_motion = Motion(0, 0, last_row.acceleration, last_row.jerk, 0)
    time_delta = dateutil.parser.parse(a_position.devicetime) - last_row.datetime
    motion = Motion.between_points(
        Point(last_row.lat, last_row.lng), Point(a_position.latitude, a_position.longitude), time_delta, last_motion
    )
    return motion
