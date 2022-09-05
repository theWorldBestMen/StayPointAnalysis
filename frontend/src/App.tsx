import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import { useAppDispatch } from "./store";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducer";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AuthRoute from "./AuthRoute";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import userSlice from "./slices/user";
import refresh from "./utils/refresh";
import { getUserInfo } from "./utils/getUserInfo";
import { getCookie, setCookie } from "./utils/cookie";
import styled from "styled-components";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user);
  const authenticated = useSelector((state: RootState) => !!state.user.email);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const refreshToken = getCookie("refreshToken");
        console.log(`refreshToken: ${refreshToken}`);
        const response: AxiosResponse<any, any> | undefined = await refresh(
          refreshToken
        );
        if (!response) return;
        const { access_token } = response.data;
        console.log(`accessToken: ${access_token}`);
        dispatch(
          userSlice.actions.setAccessToken({
            accessToken: access_token,
          })
        );

        const userResponse: AxiosResponse<any, any> | undefined =
          await getUserInfo(access_token);
        if (!userResponse) return;
        dispatch(
          userSlice.actions.setEmail({
            email: userResponse.data.data.email,
          })
        );
        dispatch(
          userSlice.actions.setName({
            name: userResponse.data.data.name,
          })
        );
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
      }
    };

    autoLogin();
  }, []);

  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <AuthRoute authenticated={authenticated}>
              <Dashboard />
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
    </AppContainer>
  );
}

export default App;
