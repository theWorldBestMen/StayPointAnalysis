import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getCookie, setCookie } from "../../utils/cookie";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { NaverMap, Circle, Polyline } from "react-naver-maps";
import { getUserInfo } from "../../utils/getUserInfo";

import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

//test
import csvjson from "../../assets/csvjson.json";

export function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);

  const [paths, setPaths] = useState([]);
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(11);
  const [locationInfo, setLocationInfo] = useState(null);
  const [selectedCircleId, setSelectedCircleId] = useState(null);

  const [isOpen, setIsOpen] = useState(true);
  const [isPolylineOpen, setPolylineOpen] = useState(true);

  const { naver } = window;

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
      setIsOpen(true);
    }
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => {
      if (prevState === true) {
        setSelectedCircleId(null);
        setLocationInfo(null);
      }
      return !prevState;
    });
  };

  const togglePolyline = () => {
    setPolylineOpen((prevState) => !prevState);
  };

  function Sidebar() {
    return (
      <div
        style={{
          width: "350px",
          height: "500px",
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
              <>
                <div
                  key={idx}
                  style={{ fontSize: "12px", marginBottom: "10px" }}
                >
                  <div>{`id: ${item.id} `}</div>
                  <div>{`date: ${item.datetime.split(" ")[0]} `}</div>
                  <div>{`time: ${item.datetime.split(" ")[1]} `}</div>
                  <div>{`lat: ${item.lat} `}</div>
                  <div>{`lng: ${item.lng} `}</div>
                </div>
                {idx !== csvjson.length - 1 && (
                  <div
                    style={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: "black",
                      marginBottom: "10px",
                    }}
                  />
                )}
              </>
            ))
          )}
        </div>
      </div>
    );
  }

  if (center) {
    return (
      <div style={{ width: "100%" }}>
        <div>
          수집 기간: {csvjson[0].datetime} ~{" "}
          {csvjson[csvjson.length - 1].datetime}
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <NaverMap
            style={{
              width: "100%",
              height: "500px",
            }}
            defaultCenter={{ lat: center.lat, lng: center.lng }}
            defaultZoom={zoom}
            ref={naverMap}
          >
            {csvjson.map((item) => {
              const { id, lat, lng } = item;
              return (
                <Circle
                  key={id}
                  center={{ x: lng, y: lat }}
                  // radius={id === selectedCircleId ? 800 / zoom : 1000 / zoom}
                  radius={80}
                  // fillOpacity={id === selectedCircleId ? 1 : 0.5}
                  fillOpacity={0.3}
                  fillColor={id === selectedCircleId ? "blue" : "red"}
                  strokeColor={id === selectedCircleId ? "blue" : "red"}
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
        <button onClick={toggleDrawer}>
          {isOpen ? "토글 닫기" : "토글 열기"}
        </button>
        <button onClick={togglePolyline}>
          {isPolylineOpen ? "경로 숨기기" : "경로 보이기"}
        </button>
      </div>
    );
  } else {
    return <div>loading...</div>;
  }
}

export default Dashboard;
