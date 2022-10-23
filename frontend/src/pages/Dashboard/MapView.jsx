import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getCookie, setCookie } from "../../utils/cookie";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { NaverMap, Circle, Marker } from "react-naver-maps";

import Sidebar from "../../components/Sidebar";

//test
import csvjson from "../../assets/csvjson.json";

import CYR_cluster from "../../assets/30-CYR_cluster.json";

function getDistanceFromLatLngInMeter(lat1, lng1, lat2, lng2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c * 1000; // Distance in m
  return d;
}

function clustering() {
  let clusterArr = {};
  Object.entries(CYR_cluster).map((value) => {
    const item = value[1];
    const clusterNum = value[1].cluster;
    if (clusterArr.hasOwnProperty(clusterNum)) {
      clusterArr[clusterNum] = [...clusterArr[clusterNum], item];
    } else {
      clusterArr[clusterNum] = [item];
    }
  });
  // console.log(clusterArr);

  let clusteredItem = [];
  Object.entries(clusterArr).map((value) => {
    let centerLat = 0;
    let centerLng = 0;

    value[1].map((item) => {
      const { lat, lng } = item;
      centerLat += lat;
      centerLng += lng;
    });
    centerLat /= value[1].length;
    centerLng /= value[1].length;

    let maxDist = 0;

    value[1].map((item) => {
      const { lat, lng } = item;

      const distance = getDistanceFromLatLngInMeter(
        centerLat,
        centerLng,
        lat,
        lng
      );
      maxDist = Math.max(maxDist, distance);
    });
    clusteredItem = [
      ...clusteredItem,
      {
        lat: centerLat,
        lng: centerLng,
        radius: maxDist,
        id: value[0],
        clusteredList: clusterArr[value[0]],
      },
    ];
  });

  return clusteredItem;
}

export function MapView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);

  const [paths, setPaths] = useState([]);
  const [center, setCenter] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [selectedCircleId, setSelectedCircleId] = useState(null);

  const [selectedPoint, setSelectedPoint] = useState(null);

  const naverMap = useRef();
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const clusteredItem = clustering();
    console.log(clusteredItem);
    setClusters(clusteredItem);
  }, []);

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

  const handleClickPoint = (item) => {
    console.log(item);
    setSelectedPoint(item);
  };

  const onSetDefault = () => {
    setSelectedPoint(null);
  };

  const onSetGeofence = async () => {
    alert("set geofence");
  };

  return (
    <div
      style={{
        margin: "10px 0",
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
                marginRight: "10px",
              }}
              defaultCenter={{ lat: center.lat, lng: center.lng }}
              defaultZoom={11}
              ref={naverMap}
            >
              {clusters.map((item) => {
                const { id, lat, lng, radius } = item;
                return (
                  <>
                    <Circle
                      key={id}
                      center={{ x: lng, y: lat }}
                      radius={radius + 10}
                      fillOpacity={id === selectedCircleId ? 0.8 : 0.3}
                      fillColor={id === selectedCircleId ? "navy" : "red"}
                      strokeColor={id === selectedCircleId ? "navy" : "red"}
                      clickable={true}
                      onClick={() => handleClickPoint([item])}
                    />
                  </>
                );
              })}
              {Object.entries(CYR_cluster).map((item) => {
                const { lat, lng } = item[1];
                return (
                  <Marker
                    position={{ x: lng, y: lat }}
                    clickable={true}
                    onClick={() => handleClickPoint([item[1]])}
                  />
                );
              })}
            </NaverMap>
            <Sidebar
              data={selectedPoint || csvjson}
              onSetGeofence={onSetGeofence}
            />
          </div>
          <button onClick={onLogout}>로그아웃</button>
          <button onClick={onSetDefault}>초기화</button>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

export default MapView;
