import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCookie, setCookie } from "../../utils/cookie";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store/index";
import { useNavigate } from "react-router-dom";
import { RenderAfterNavermapsLoaded, NaverMap } from "react-naver-maps";
import { getUserInfo } from "../../utils/getUserInfo";

export function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(userInfo);
  }, []);

  const onLogout = () => {
    dispatch(
      userSlice.actions.setUser({
        name: "",
        email: "",
        accessToken: "",
      })
    );
    setCookie("refreshToken", "");
    navigate("/");
  };

  return (
    <>
      <RenderAfterNavermapsLoaded
        ncpClientId={process.env.REACT_APP_NCPClientId}
      >
        <NaverMap
          style={{
            width: "100%",
            height: "500px",
          }}
          defaultCenter={{ lat: 37.3595704, lng: 127.105399 }}
          defaultZoom={13}
        />
      </RenderAfterNavermapsLoaded>
      <button onClick={onLogout}>로그아웃</button>
    </>
  );
}

export default Dashboard;
