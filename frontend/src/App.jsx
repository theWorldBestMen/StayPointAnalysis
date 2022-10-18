import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import { useAppDispatch } from "./store";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducer";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";

import userSlice from "./slices/user";
import refresh from "./utils/refresh";
import { getUserInfo } from "./utils/getUserInfo";
import { getCookie, setCookie } from "./utils/cookie";
import styled from "styled-components";

import Auth from "./pages/Auth";
import Mypage from "./pages/Mypage";
import DashBoard from "./pages/Dashboard";
import MapView from "./pages/Dashboard/MapView";
import ChartView from "./pages/Dashboard/ChartView";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user);
  const authenticated = !!userInfo.email;

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  // useEffect(() => {
  //   const autoLogin = async () => {
  //     try {
  //       const refreshToken = getCookie("refreshToken");
  //       const response = await refresh(refreshToken);
  //       if (!response) return;

  //       const { access_token } = response.data;
  //       const userResponse = await getUserInfo(access_token);
  //       if (!userResponse) return;

  //       const { email, name, role } = userResponse.data.data;
  //       dispatch(
  //         userSlice.actions.setUser({
  //           name,
  //           email,
  //           role,
  //           accessToken: access_token,
  //         })
  //       );
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   autoLogin();
  // }, [dispatch, navigate]);

  return (
    <RenderAfterNavermapsLoaded ncpClientId={process.env.REACT_APP_NCPClientId}>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            // <AuthRoute authenticated={authenticated}>
            <DashBoard />
            // </AuthRoute>
          }
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>페이지 없음</p>
            </main>
          }
        />
      </Routes>
    </RenderAfterNavermapsLoaded>
  );
}

export default App;
