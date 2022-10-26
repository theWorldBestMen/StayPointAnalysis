import React, { useEffect } from "react";
import axios from "axios";

import { useAppDispatch } from "./store";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducer";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";

import userSlice from "./slices/user";
import { getCookie, setCookie } from "./utils/cookie";

import MainLayout from "./layouts/Main";
import Home from "./pages/Home";
import DashBoard from "./pages/Dashboard";
import Auth from "./pages/Auth";

function App() {
  const dispatch = useAppDispatch();
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
          element={
            <AuthRoute authenticated={authenticated}>
              <MainLayout />
            </AuthRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
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
