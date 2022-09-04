import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCookie, setCookie } from "../../utils/cookie";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store/index";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("userInfo: ", userInfo);
  }, []);

  const onLogout = () => {
    dispatch(
      userSlice.actions.setUser({
        name: "",
        email: "",
        accessToken: "",
      })
    );
    setCookie("refreshToken", null);
    navigate("/");
  };

  return (
    <>
      <div>로그인 화면</div>
      <button onClick={onLogout}>로그아웃</button>
    </>
  );
}

export default Dashboard;
