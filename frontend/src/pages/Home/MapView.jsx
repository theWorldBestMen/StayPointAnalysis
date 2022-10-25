import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getCookie, setCookie } from "../../utils/cookie";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { NaverMap, Circle, Marker } from "react-naver-maps";

import Cluster from "./Cluster";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Sidebar from "../../components/Sidebar";

//test
import csvjson from "../../assets/csvjson.json";
import CYR_cluster from "../../assets/30-CYR_cluster.json";
import styled from "styled-components";
import StayPoints from "./StayPoints";
import axios from "axios";

const OptionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  background-color: #e1e2e1;
  color: black;
  fontsize: 16px;
`;

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
  const accessToken = userInfo.accessToken;

  const subjectInfo = useSelector((state) => state.subject);

  const [center, setCenter] = useState({ lat: 37.541, lng: 126.986 });
  const [stayPointList, setStayPointList] = useState([]);
  const [locationInfo, setLocationInfo] = useState(null);

  const [selectedPoint, setSelectedPoint] = useState(null);

  const naverMap = useRef();
  const [clusters, setClusters] = useState([]);

  useLayoutEffect(() => {
    loadStayPoints(subjectInfo.email);
  }, [subjectInfo]);

  // useEffect(() => {
  //   const clusteredItem = clustering();
  //   console.log(clusteredItem);
  //   setClusters(clusteredItem);
  // }, []);

  const getCenter = (data) => {
    let centerLat = 0;
    let centerLng = 0;
    data.map((item) => {
      const { lat, lng } = item;
      centerLat += lat;
      centerLng += lng;
    });
    centerLat /= data.length;
    centerLng /= data.length;

    const newCenter = { lat: centerLat, lng: centerLng };

    return newCenter;
  };

  const loadStayPoints = async (email) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/stay_point/${email}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setStayPointList(response.data.data);
        if (response.data.data.length > 0) {
          const newCenter = getCenter(response.data.data);
          setCenter(newCenter);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickPoint = (item) => {
    setSelectedPoint([item]);
  };

  const onSetDefault = () => {
    setSelectedPoint(null);
  };

  const onSetGeofence = async () => {
    alert("set geofence");
  };

  return (
    <div>
      <OptionHeader>
        {stayPointList.length > 0 ? (
          <div style={{ fontSize: "15px" }}>
            수집 기간:{" "}
            {
              new Date(stayPointList[stayPointList.length - 1].datetime)
                .toISOString()
                .split("T")[0]
            }{" "}
            ~ {new Date(stayPointList[0].datetime).toISOString().split("T")[0]}
          </div>
        ) : (
          <div />
        )}

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: "15px", marginRight: "2px" }}>반경 설정</div>
          <InputGroup size="sm" style={{ width: "150px", marginRight: "2px" }}>
            <Form.Control placeholder="반경 입력" type="number" />
            <Button variant="outline-dark">확인</Button>
          </InputGroup>
          <Button size="sm" variant="outline-dark" onClick={onSetDefault}>
            초기화
          </Button>
        </div>
      </OptionHeader>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "90vh",
        }}
      >
        <NaverMap
          style={{
            width: "100%",
          }}
          defaultCenter={{ lat: center.lat, lng: center.lng }}
          defaultZoom={11}
          ref={naverMap}
        >
          <StayPoints
            data={stayPointList}
            handleClickPoint={handleClickPoint}
          />
          {/* <Cluster
            clusters={clusters}
            handleClickPoint={handleClickPoint}
            selectedCircleId={selectedCircleId}
          /> */}
        </NaverMap>
        <Sidebar
          data={selectedPoint ? selectedPoint : stayPointList}
          onSetGeofence={onSetGeofence}
          handleClickPoint={handleClickPoint}
        />
      </div>
    </div>
  );
}

export default MapView;
