import userSlice from "../slices/user";
import { useAppDispatch } from "../store";
import { getCookie } from "./cookie";
import getUserInfo from "./getUserInfo";
import refresh from "./refresh";

const AutoLogin = async () => {
  const dispatch = useAppDispatch();

  try {
    const refreshToken = getCookie("refreshToken");
    const response = await refresh(refreshToken);
    if (!response) return;

    const { access_token } = response.data;
    const userResponse = await getUserInfo(access_token);
    if (!userResponse) return;

    const { email, name, role } = userResponse.data.data;
    dispatch(
      userSlice.actions.setUser({
        name,
        email,
        role,
        accessToken: access_token,
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export default AutoLogin;
