import PropTypes from 'prop-types';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// components
import { fNumber } from '../../../utils/formatNumber';
import Chart, { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AnalyticsConversionRates.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function AnalyticsConversionRates({ title, subheader, chart, ...other }) {
  const { colors, series, options } = chart;

  const chartOptions = useChart({
    chart: {
      stacked: true,
    },
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28%',
        borderRadius: 2,
      },
    },
    yaxis: {
      categories: series.map((i) => i.label),
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {series.map((item) => (
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <Chart type="bar" series={item.data} options={chartOptions} height={364} />
        </Box>
      ))}
    </Card>
  );
}
