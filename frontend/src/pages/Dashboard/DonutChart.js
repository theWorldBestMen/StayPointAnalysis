import { useEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";

// third-party
import ReactApexChart from "react-apexcharts";

// chart options
const areaChartOptions = {
  chart: {
    type: "donut",
  },
  legend: {
    position: "bottom",
  },
  // responsive: [
  //   {
  //     // breakpoint: 480,
  //     options: {
  //       // chart: {
  //       //   width: 300,
  //       // },
  //       legend: {
  //         position: "bottom",
  //       },
  //     },
  //   },
  // ],
};

// ==============================|| DONUT CHART ||============================== //

const DonutChart = () => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  // useEffect(() => {
  //     setOptions((prevState) => ({
  //         ...prevState,
  //         colors: [theme.palette.warning.main],
  //         xaxis: {
  //             labels: {
  //                 style: {
  //                     colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary]
  //                 }
  //             }
  //         },
  //         grid: {
  //             borderColor: line
  //         },
  //         tooltip: {
  //             theme: 'light'
  //         },
  //         legend: {
  //             labels: {
  //                 colors: 'grey.500'
  //             }
  //         }
  //     }));
  // }, [primary, secondary, line, theme]);
  // series: [44, 55, 13, 43, 22],

  const [series] = useState([44, 55, 41, 17, 15]);

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
