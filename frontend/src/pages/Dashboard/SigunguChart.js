import { useEffect, useLayoutEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";

// third-party
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { useSelector } from "react-redux";

// chart options
const barChartOptions = {
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "45%",
      borderRadius: 4,
    },
  },
  // dataLabels: {
  //   enabled: false,
  // },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const SigunguChart = () => {
  const userInfo = useSelector((state) => state.user);
  const accessToken = userInfo.accessToken;
  const subjectInfo = useSelector((state) => state.subject);

  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  const [options, setOptions] = useState(barChartOptions);

  const [series, setSeries] = useState({ data: [1, 2, 3] });

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      tooltip: {
        theme: "light",
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary, info, secondary]);

  useLayoutEffect(() => {
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

        setOptions((prev) => ({
          ...prev,
          // series: {
          //   data: Object.values(sortable),
          // },
          labels: Object.keys(sortable),
          xaxis: {
            categories: Object.keys(sortable),
          },
        }));
        console.log(Object.values(sortable));
        setSeries([{ data: Object.values(sortable) }]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default SigunguChart;
