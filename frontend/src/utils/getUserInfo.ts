import axios from "axios";

export const getUserInfo = async (accessToken: string) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return;
  }
};

export default getUserInfo;
