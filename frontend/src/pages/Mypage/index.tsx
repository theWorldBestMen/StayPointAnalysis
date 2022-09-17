import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import userSlice from "../../slices/user";
import { RootState } from "../../store/reducer";

export function Mypage() {
  const userInfo = useSelector((state: RootState) => state.user);
  console.log(userInfo);
  return (
    <div>
      {Object.entries(userInfo).map((user) => {
        if (user[0] !== "accessToken") {
          return `${user[0]} : ${user[1]}, `;
        }
      })}
    </div>
  );
}

export default Mypage;
