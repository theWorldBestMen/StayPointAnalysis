import React, { useState, useEffect } from "react";

import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/index";
import userSlice from "../../slices/user";
import { setCookie } from "../../utils/cookie";

import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Dropdown from "react-bootstrap/Dropdown";

import green_light from "../../assets/image/green_light.png";
import gray_light from "../../assets/image/gray_light.png";
import axios from "axios";

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
  width: 20px;
  height: 20px;
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

  const [subjectInfoList, setSubjectInfoList] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (userInfo.role === "researcher") {
      loadSubjectsData();
    }
  }, []);

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
    setSubjectInfo(subject);
  };

  const onLogout = () => {
    dispatch(userSlice.actions.setUser({}));
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
        <div>장치 식별자: {userInfo.deviceId}</div>
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
            {subjectInfo ? (
              <div
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                }}
              >
                {subjectInfo.status === "online" ? (
                  <ButtonImage src={green_light} />
                ) : (
                  <ButtonImage src={gray_light} />
                )}
                {subjectInfo.name}
              </div>
            ) : (
              123
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ minWidth: "220px" }}>
            {subjectInfoList.map((subjectInfo) => {
              const { name, email, device_info } = subjectInfo;
              console.log(device_info);
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
          </Dropdown.Menu>
        </Dropdown>
        <Button
          style={{ backgroundColor: "transparent", borderColor: "transparent" }}
          onClick={() => navigate("/home")}
        >
          홈
        </Button>
        <Button
          style={{ backgroundColor: "transparent", borderColor: "transparent" }}
          onClick={() => navigate("/dashboard")}
        >
          대시보드
        </Button>
      </div>

      <div>
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <Button style={{ marginRight: "5px" }} variant="light" size="sm">
            내 정보
          </Button>
        </OverlayTrigger>
        <Button variant="light" size="sm" onClick={onLogout}>
          로그아웃
        </Button>
      </div>
    </HeaderContainer>
  );
}

export default Header;
