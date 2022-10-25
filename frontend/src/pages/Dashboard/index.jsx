import { Grid, Typography } from "@mui/material";

import MainCard from "../../components/MainCard";
import MonthlyBarChart from "./MonthlyBarChart";
import ReportAreaChart from "./ReportAreaChart";

function Dashboard() {
  return (
    <div style={{ padding: "0 20px" }}>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} md={6} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6">Income Overview</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <MonthlyBarChart />
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Analytics Report</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <ReportAreaChart />
          </MainCard>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
