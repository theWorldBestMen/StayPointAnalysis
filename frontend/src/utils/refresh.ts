import axios from "axios";

export const refresh = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      return;
    }
    console.log("Refreshing token: " + refreshToken);
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/refresh`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    return;
  }
};

export default refresh;
