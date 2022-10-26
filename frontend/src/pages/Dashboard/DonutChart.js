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
    loadStayPointsCountByCluster(subjectInfo.email);
    return () => {
      setOptions(null);
      setSeries([]);
    };
  }, [subjectInfo, userInfo]);

  const loadStayPointsCountByCluster = async (email) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/stay_point/${email}/cluster`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.data);
        const { data } = response.data;
        let data_series = [];
        let data_labels = [];
        data.map((item) => {
          const { center_lat, center_lng, point_count } = item[1];
          data_labels = [
            ...data_labels,
            `${center_lng.toString().substring(0, 8)}, ${center_lat
              .toString()
              .substring(0, 8)}`,
          ];
          data_series = [...data_series, point_count];
        });
        // const sortable = Object.entries(data)
        //   .sort(([, a], [, b]) => b - a)
        //   .reduce((r, [k, v]) => ({ ...r, [k]: v }), []);
        // console.log(sortable);
        setOptions((prev) => ({
          ...prev,
          labels: data_labels,
        }));
        setSeries(data_series);
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
