import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import Chart, { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

Bar.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function Bar({ title, chart, height, ...other }) {
  const { categories, colors, serie, options } = chart;

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    legend: {
      show: false
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}`,
      },
    },
    plotOptions: {
      bar: {
          distributed: true, // this line is mandatory
      },
  },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
      />

      {serie.map((item) => (
        <Box sx={{ mx: 3 }} dir="ltr">
          <Chart type="bar" series={item.data} options={chartOptions} height={height || 150} />
        </Box>
      ))}
    </Card>
  );
}
