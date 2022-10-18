import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import userSlice from "../../slices/user";
import { RootState } from "../../store/reducer";

export function Mypage() {
  const userInfo = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(userInfo);
    // onUser();
  }, []);

  const onUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return <div>mypage</div>;
}

export default Mypage;
