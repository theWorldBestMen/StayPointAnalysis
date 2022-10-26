import React, { useState, useEffect } from "react";

import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/index";
import userSlice from "../../slices/user";
import { setCookie } from "../../utils/cookie";

// import Button from "react-bootstrap/Button";
import Button from "@mui/material/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Dropdown from "react-bootstrap/Dropdown";

import green_light from "../../assets/image/green_light.png";
import gray_light from "../../assets/image/gray_light.png";
import axios from "axios";
import subjectSlice from "../../slices/subject";

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  background-color: #114d86;
  justify-content: space-between;
  color: #fff;
  align-items: center;
  padding: 0 12px;
`;

const ButtonImage = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 5px;
`;

function timeConversion(millisec: number) {
  var seconds = Math.floor(millisec / 1000);

  var minutes = Math.floor(millisec / (1000 * 60));

  var hours = Math.floor(millisec / (1000 * 60 * 60));

  var days = Math.floor(millisec / (1000 * 60 * 60 * 24));

  if (Number(hours) >= 24) {
    return days + "일";
  } else if (Number(minutes) >= 60) {
    return hours + "시간";
  } else if (Number(seconds) >= 60) {
    return minutes + "분";
  } else {
    return seconds + "초";
  }
}

function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user);
  const accessToken = userInfo.accessToken;
  const subjectInfo = useSelector((state: RootState) => state.subject);

  const myInfo = {
    name: userInfo.name,
    email: userInfo.email,
    device_info: userInfo.device_info,
  };

  const [subjectInfoList, setSubjectInfoList] = useState([]);

  useEffect(() => {
    loadMyData();
    if (userInfo.role === "researcher") {
      loadSubjectsData();
    }
    dispatch(subjectSlice.actions.setSubject(myInfo));
  }, []);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const loadMyData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/device`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        const { device_info } = response.data.data;
        dispatch(userSlice.actions.setDeviceInfo(device_info));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadSubjectsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/researcher/subjects`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setSubjectInfoList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSetSubject = (subject) => {
    dispatch(subjectSlice.actions.setSubject(subject));
  };

  const onLogout = () => {
    dispatch(
      userSlice.actions.setUser({
        name: "",
        email: "",
        role: "",
        researcher: "",
        subjects: [],
        device_info: {},
        accessToken: "",
      })
    );
    setCookie("refreshToken", "");
    navigate("/");
  };

  const popover = (
    <Popover>
      <Popover.Header as="h3"></Popover.Header>
      <Popover.Body>
        <div>이름: {userInfo.name}</div>
        <div>이메일: {userInfo.email}</div>
        <div>
          역할: {userInfo.role === "researcher" ? "연구자" : "실험 참가자"}
        </div>
        {userInfo.role === "subject" && (
          <div>연구자: {userInfo.researcher}</div>
        )}
        {userInfo.role === "researcher" && (
          <div>관리 실험자 수: {userInfo.subjects.length}</div>
        )}
        <div>장치 식별자: {userInfo.device_info.uniqueId}</div>
      </Popover.Body>
    </Popover>
  );

  return (
    <HeaderContainer>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Dropdown>
          <Dropdown.Toggle
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              minWidth: "220px",
              height: "35px",
            }}
            variant="light"
            id="dropdown-basic"
          >
            <div
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
              }}
            >
              {subjectInfo.name}
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ minWidth: "220px" }}>
            {subjectInfoList.length > 0 &&
              subjectInfoList.map((subjectInfo) => {
                const { name, email, device_info } = subjectInfo;
                return (
                  <Dropdown.Item
                    style={{ display: "flex", justifyContent: "space-between" }}
                    id={email.toString()}
                    onClick={() => onSetSubject(subjectInfo)}
                  >
                    <div>
                      {device_info.status === "online" ? (
                        <ButtonImage src={green_light} />
                      ) : (
                        <ButtonImage src={gray_light} />
                      )}
                      {name}
                    </div>

                    {device_info.status !== "online" &&
                      !!device_info.lastUpdate && (
                        <div style={{ color: "gray", fontSize: "15px" }}>
                          {timeConversion(
                            new Date().getTime() -
                              new Date(device_info.lastUpdate).getTime()
                          )}{" "}
                          전
                        </div>
                      )}
                  </Dropdown.Item>
                );
              })}

            {subjectInfoList.length > 0 && <Dropdown.Divider />}

            <Dropdown.Item
              style={{ display: "flex", justifyContent: "space-between" }}
              id={myInfo.email.toString()}
              onClick={() => onSetSubject(myInfo)}
            >
              <div>
                {myInfo.device_info.status === "online" ? (
                  <ButtonImage src={green_light} />
                ) : (
                  <ButtonImage src={gray_light} />
                )}
                {myInfo.name}
              </div>

              {myInfo.device_info.status !== "online" &&
                !!myInfo.device_info.lastUpdate && (
                  <div style={{ color: "gray", fontSize: "15px" }}>
                    {timeConversion(
                      new Date().getTime() -
                        new Date(myInfo.device_info.lastUpdate).getTime()
                    )}{" "}
                    전
                  </div>
                )}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button
          style={{
            backgroundColor: "transparent",
            borderColor: "transparent",
            color: "white",
          }}
          onClick={() => navigate("/home")}
        >
          홈
        </Button>
        <Button
          style={{
            backgroundColor: "transparent",
            borderColor: "transparent",
            color: "white",
          }}
          onClick={() => navigate("/dashboard")}
        >
          대시보드
        </Button>
      </div>

      <div>
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <Button
            style={{
              marginRight: "5px",
              backgroundColor: "white",
              color: "black",
            }}
            variant="contained"
            size="small"
          >
            내 정보
          </Button>
        </OverlayTrigger>
        <Button
          style={{
            marginRight: "5px",
            backgroundColor: "white",
            color: "black",
          }}
          variant="contained"
          size="small"
          onClick={onLogout}
        >
          로그아웃
        </Button>
      </div>
    </HeaderContainer>
  );
}

export default Header;
