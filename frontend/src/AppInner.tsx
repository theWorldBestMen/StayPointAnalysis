import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import Auth from "./pages/Auth";

function AppInner() {
  // const [test, setTest] = useState("test");

  // useEffect(() => {
  //   async function apiTest() {
  //     try {
  //       const response: { data: { message: string } } = await axios.get("/api");
  //       console.log(response);
  //       setTest(response.data.message);
  //     } catch (error) {
  //       const errorResponse = (error as AxiosError).response;
  //       if (errorResponse) {
  //         console.error("errorResponse", errorResponse);
  //       }
  //     }
  //   }

  //   apiTest();
  // }, []);

  return <Auth />;
}

export default AppInner;