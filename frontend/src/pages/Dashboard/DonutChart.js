import { useEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";

// third-party
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { useSelector } from "react-redux";

// chart options
const areaChartOptions = {
  chart: {
    type: "donut",
  },
  legend: {
    position: "bottom",
  },
};

// ==============================|| DONUT CHART ||============================== //

const DonutChart = () => {
  const userInfo = useSelector((state) => state.user);
  const accessToken = userInfo.accessToken;
  const subjectInfo = useSelector((state) => state.subject);

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    loadStayPointsCountBySigungu(subjectInfo.email);
    return () => {
      setOptions(null);
      setSeries([]);
    };
  }, [subjectInfo, userInfo]);

  const loadStayPointsCountBySigungu = async (email) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/stay_point/${email}/sigungu`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const { data } = response.data;
        const sortable = Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), []);
        console.log(sortable);
        setOptions((prev) => ({
          ...prev,
          labels: Object.keys(sortable),
        }));
        setSeries(Object.values(sortable));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="chart">
      <ReactApexChart
        style={{ margin: "20px 0" }}
        options={options}
        series={series}
        type="donut"
      />
    </div>
  );
};

export default DonutChart;
