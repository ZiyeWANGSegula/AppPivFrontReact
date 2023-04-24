import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
// components
import { fNumber } from '../../../utils/formatNumber';
import Chart, { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 100;

const LEGEND_HEIGHT = 45;

const StyledChart = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(1),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
  },
}));

// ----------------------------------------------------------------------

AppCurrentDownload.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function AppCurrentDownload({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: { colors: [theme.palette.background.paper] },
    legend: {floating: true, fontSize: "10px", position:'right'},
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        offsetX:-50,
        offsetY:2,
        donut: {
          size: '75%',
          labels: {
            value: {
              formatter: (value) => fNumber(value),
              offsetY: -1,
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} titleTypographyProps={{variant:'subtitle2'}}/>

      <StyledChart dir="ltr">
        <Chart type="donut" series={chartSeries} options={chartOptions} height={80} />
      </StyledChart>
    </Card>
  );
}
