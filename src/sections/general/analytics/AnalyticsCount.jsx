import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Stack, Typography, Box, CircularProgress } from '@mui/material';
// utils
// components
import Iconify from '../../../components/iconify';
import { fCurrency, fShortenNumber } from '../../../utils/formatNumber';
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

AnalyticsCount.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  color: PropTypes.string,
  price: PropTypes.number,
  total: PropTypes.number,
  percent: PropTypes.number,
};

export default function AnalyticsCount({ title, total, icon, avatar, color, percent, price, unity }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="left"
      sx={{ width: 1, minWidth: 200, maxHeight: 90 }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative', marginLeft: '10%' }}>
        {icon && (<Iconify icon={icon} width={24} sx={{ color, position: 'absolute' }} />)}
        {avatar && (<CustomAvatar src={avatar} sx={{ position: 'absolute' }} />)}

        <CircularProgress
          variant="determinate"
          value={percent}
          size={56}
          thickness={4}
          sx={{ color, opacity: 0.48 }}
        />

        <CircularProgress
          variant="determinate"
          value={100}
          size={56}
          thickness={4}
          sx={{
            top: 0,
            left: 0,
            opacity: 0.48,
            position: 'absolute',
            color: (theme) => alpha(theme.palette.grey[500], 0.16),
          }}
        />
      </Stack>

      <Stack spacing={0.5} sx={{ ml: 2 }}>
        <Typography variant="h6">{title}</Typography>

        <Typography variant="subtitle2">
          {fShortenNumber(total)}{' '}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            {unity}
          </Box>
        </Typography>

        <Typography variant="subtitle2" sx={{ color }}>
          {fCurrency(price)}
        </Typography>
      </Stack>
    </Stack>
  );
}
