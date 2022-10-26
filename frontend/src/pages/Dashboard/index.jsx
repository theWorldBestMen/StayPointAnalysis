import React, { useState, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";

import axios from "axios";

import { Grid, Typography } from "@mui/material";

import MainCard from "../../components/MainCard";
import MonthlyBarChart from "./MonthlyBarChart";
import ReportAreaChart from "./ReportAreaChart";
import DonutChart from "./DonutChart";

function Dashboard() {
  const userInfo = useSelector((state) => state.user);
  const accessToken = userInfo.accessToken;
  const subjectInfo = useSelector((state) => state.subject);

  const [stayPointList, setStayPointList] = useState([]);

  useEffect(() => {
    loadStayPoints(subjectInfo.email);
    return () => setStayPointList([]);
  }, [subjectInfo, userInfo]);

  const loadStayPoints = async (email) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/stay_point/${email}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setStayPointList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "10px 20px" }}>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={6} md={4} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6">시군구 별 개수</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 1 }} content={false}>
            <DonutChart />
          </MainCard>
        </Grid>

        <Grid item xs={6} md={4} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6">시군구 별 개수</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 1 }} content={false}>
            <MonthlyBarChart />
          </MainCard>
        </Grid>

        <Grid item xs={6} md={4} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6">날짜별 추출 개수</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 1 }} content={false}>
            <ReportAreaChart />
          </MainCard>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
