import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
import Chart, { useChart } from '../../../components/chart';
import { fData } from '../../../utils/formatNumber';
// utils
// components

// ----------------------------------------------------------------------

StackedBar.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function StackedBar({ title, subheader, chart, small, tickAmount,...other }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    chart: {
      stacked: true,
    },
    legend: {
      offsetY: 20,
    },
    colors,
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: labels,
      max: null,
      tickAmount: (tickAmount)?tickAmount:10,
    },
    tooltip: {
      y: {
        formatter: (value) => value,
      },
    },
    plotOptions: {
      bar: {
        barHeight: '40%',
        borderRadius: 2,
        horizontal: true,
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      {small && (<CardHeader
        title={title} titleTypographyProps={{variant:'subtitle2'}}
      />)}
      {!small && (<CardHeader
        title={title}
      />)}

      {series.map((item) => (
        <Box sx={{ mx: 1 }} dir="ltr">
          <Chart type="bar" series={item.data} options={chartOptions} height={150} />
        </Box>
      ))}
    </Card>
  );
}
