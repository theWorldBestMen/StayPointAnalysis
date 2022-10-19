import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import userSlice from "../../slices/user";
import { RootState } from "../../store/reducer";

export function Mypage() {
  const userInfo = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(userInfo);
  }, []);

  return <div>mypage</div>;
}

export default Mypage;
