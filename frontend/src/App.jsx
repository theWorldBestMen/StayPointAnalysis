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
    console.log(userInfo);
  }, [userInfo]);

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
