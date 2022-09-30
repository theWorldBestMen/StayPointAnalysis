import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getCookie, setCookie } from "../../utils/cookie";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { NaverMap, Circle, Polyline } from "react-naver-maps";
import { getUserInfo } from "../../utils/getUserInfo";

//test
import csvjson from "../../assets/csvjson.json";

export function MapView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);

  const [paths, setPaths] = useState([]);
  const [center, setCenter] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [selectedCircleId, setSelectedCircleId] = useState(null);

  const [isPolylineOpen, setPolylineOpen] = useState(true);

  const naverMap = useRef();

  useEffect(() => {
    let centerLat = 0;
    let centerLng = 0;
    csvjson.map((item) => {
      const { lat, lng } = item;
      centerLat += lat;
      centerLng += lng;
      setPaths((paths) => [...paths, { lat, lng }]);
    });
    centerLat /= csvjson.length;
    centerLng /= csvjson.length;
    setCenter({ lat: centerLat, lng: centerLng });
  }, []);

  useEffect(() => {
    console.log("locationInfo", locationInfo);
  }, [locationInfo]);

  const onLogout = () => {
    dispatch(
      userSlice.actions.setUser({
        name: "",
        email: "",
        accessToken: "",
      })
    );
    setCookie("refreshToken", "");
    navigate("/");
  };

  const onPressCircle = (id) => {
    if (selectedCircleId && selectedCircleId === id) {
      setSelectedCircleId(null);
      setLocationInfo(null);
    } else {
      const location = csvjson.filter((item) => item.id === id);
      setSelectedCircleId(id);
      setLocationInfo(location[0]);
    }
  };

  const onSetDefault = () => {
    setSelectedCircleId(null);
    setLocationInfo(null);
  };

  const togglePolyline = () => {
    setPolylineOpen((prevState) => !prevState);
  };

  function Sidebar() {
    return (
      <div
        style={{
          width: "350px",
          height: "600px",
          border: "1px solid black",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
          {locationInfo ? (
            <div style={{ fontSize: "12px" }}>
              <div>{`id: ${locationInfo.id} `}</div>
              <div>{`date: ${locationInfo.datetime.split(" ")[0]} `}</div>
              <div>{`time: ${locationInfo.datetime.split(" ")[1]} `}</div>
              <div>{`lat: ${locationInfo.lat} `}</div>
              <div>{`lng: ${locationInfo.lng} `}</div>
            </div>
          ) : (
            csvjson.map((item, idx) => (
              <div key={idx} style={{ fontSize: "12px", marginBottom: "10px" }}>
                <div>{`id: ${item.id} `}</div>
                <div>{`date: ${item.datetime.split(" ")[0]} `}</div>
                <div>{`time: ${item.datetime.split(" ")[1]} `}</div>
                <div>{`lat: ${item.lat} `}</div>
                <div>{`lng: ${item.lng} `}</div>
                {idx !== csvjson.length - 1 && (
                  <div
                    style={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: "black",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {center ? (
        <div>
          <div>
            수집 기간: {csvjson[0].datetime.split(" ")[0]} ~{" "}
            {csvjson[csvjson.length - 1].datetime.split(" ")[0]}
          </div>
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <NaverMap
              style={{
                width: "100%",
                height: "600px",
              }}
              defaultCenter={{ lat: center.lat, lng: center.lng }}
              defaultZoom={11}
              ref={naverMap}
            >
              {csvjson.map((item) => {
                const { id, lat, lng } = item;
                return (
                  <Circle
                    key={id}
                    center={{ x: lng, y: lat }}
                    radius={80}
                    fillOpacity={id === selectedCircleId ? 0.8 : 0.3}
                    fillColor={id === selectedCircleId ? "navy" : "red"}
                    strokeColor={id === selectedCircleId ? "navy" : "red"}
                    clickable={true}
                    onClick={() => onPressCircle(id)}
                  />
                );
              })}
              {isPolylineOpen && <Polyline path={paths} />}
            </NaverMap>
            <Sidebar />
          </div>
          <button onClick={onLogout}>로그아웃</button>
          <button onClick={onSetDefault}>초기화</button>
          <button onClick={togglePolyline}>
            {isPolylineOpen ? "경로 숨기기" : "경로 보이기"}
          </button>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

export default MapView;
