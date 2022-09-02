import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import Auth from "./pages/Auth";
import { useAppDispatch } from "./store";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducer";
import { Link, Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRoute";
function AppInner() {
  const dispatch = useAppDispatch();
  const authenticated = useSelector((state: RootState) => !!state.user.email);

  useEffect(() => {
    console.log("authenticated:", authenticated);
  }, [authenticated]);

  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <AuthRoute authenticated={authenticated}>
            <div>login page</div>
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
  );
}

export default AppInner;
