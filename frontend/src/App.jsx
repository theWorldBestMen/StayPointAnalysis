import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import { useAppDispatch } from "./store";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducer";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";

import userSlice from "./slices/user";
import { getCookie, setCookie } from "./utils/cookie";
import styled from "styled-components";

import Auth from "./pages/Auth";
import DashBoard from "./pages/Dashboard";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user);
  const authenticated = !!userInfo.email;

  useEffect(() => {
    // accessToken 만료 시 refreshToken으로 accessToken을 재발급 하는 code
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const {
          config,
          response: { status },
        } = error;
        if (status === 401) {
          const originalRequest = config;
          const refreshToken = getCookie("refreshToken");

          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/user/refresh`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          console.log(response);
          const { access_token, refresh_token } = response.data;

          setCookie("refreshToken", refresh_token);
          dispatch(userSlice.actions.setAccessToken(access_token));
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <RenderAfterNavermapsLoaded ncpClientId={process.env.REACT_APP_NCPClientId}>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <AuthRoute authenticated={authenticated}>
              <DashBoard />
            </AuthRoute>
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
