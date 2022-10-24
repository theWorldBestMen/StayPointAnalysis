import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCookie, setCookie } from "../../utils/cookie";
import { useAppDispatch } from "../../store/index";
import { useNavigate } from "react-router-dom";
import userSlice from "../../slices/user";
import { RootState } from "../../store/reducer";
import axios from "axios";

import ListGroup from "react-bootstrap/ListGroup";

export function Mypage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("userInfo", userInfo);
  }, []);

  const onLogout = () => {
    dispatch(userSlice.actions.setUser({}));
    setCookie("refreshToken", "");
    navigate("/");
  };

  return (
    <div style={{ margin: 15 }}>
      <ListGroup variant="flush">
        <ListGroup.Item>이름: {userInfo.name}</ListGroup.Item>
        <ListGroup.Item>이메일: {userInfo.email}</ListGroup.Item>
        <ListGroup.Item>역할: {userInfo.role}</ListGroup.Item>
      </ListGroup>
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
}

export default Mypage;
