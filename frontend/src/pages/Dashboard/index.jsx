import React, { useState, useEffect, useLayoutEffect } from "react";
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
  const [locationInfo, setLocationInfo] = useState({});
  const [selectedCircleId, setSelectedCircleId] = useState(null);

  const [isOpen, setIsOpen] = useState(true);
  const [isPolylineOpen, setPolylineOpen] = useState(true);

  const { naver } = window;

  useEffect(() => {
    if (naver) {
      let centerLat = 0;
      let centerLng = 0;
      csvjson.map((item) => {
        const { lat, lng } = item;
        centerLat += lat;
        centerLng += lng;
        setPaths((paths) => [...paths, new naver.maps.LatLng(lat, lng)]);
      });
      centerLat /= csvjson.length;
      centerLng /= csvjson.length;
      setCenter({ lat: centerLat, lng: centerLng });
    }
  }, [naver]);

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
    const location = csvjson.filter((item) => item.id === id);
    setSelectedCircleId(id);
    setLocationInfo(location);
    setIsOpen(true);
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => {
      if (prevState === true) {
        setSelectedCircleId(null);
        setLocationInfo({});
      }
      return !prevState;
    });
  };

  const togglePolyline = () => {
    setPolylineOpen((prevState) => !prevState);
  };

  function Sidebar() {
    if (locationInfo) {
      const info = JSON.stringify(locationInfo[0], null, 4);
      return <div style={{ display: "flex", width: "300px" }}>{info}</div>;
    } else {
      console.log(csvjson);
      // return (
      //   <div style={{ display: "flex", width: "300px" }}>
      //     {csvjson.map((item) => {
      //       console.log(item);
      //       return <div>{item.datetime}</div>;
      //     })}
      //   </div>
      // );
    }
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
            defaultZoom={11}
          >
            {csvjson.map((item) => {
              const { id, lat, lng } = item;
              return (
                <Circle
                  key={id}
                  center={{ x: lng, y: lat }}
                  radius={id === selectedCircleId ? 130 : 100}
                  fillOpacity={id === selectedCircleId ? 1 : 0.5}
                  fillColor={id === selectedCircleId ? "blue" : "#FF0000"}
                  strokeColor={"red"}
                  clickable={true} // click event를 다루기 위해서는 true로 설정되어야함.
                  onClick={() => onPressCircle(id)}
                />
              );
            })}
            {isPolylineOpen && <Polyline path={paths} />}
          </NaverMap>
          {isOpen && <Sidebar />}
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
