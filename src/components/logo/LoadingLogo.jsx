import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const LoadingLogo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  /*const loadingLogo = (
    <Box
      component="img"
      src="/logo/logo.png"
      sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    />
  );*/

  const loadingLogo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 147.000000 140.000000">
        <g transform="translate(0.000000,140.000000) scale(0.100000,-0.100000)" fill={PRIMARY_MAIN} stroke="none">
          <path d="M64 1315 c-14 -35 3 -44 88 -47 l83 -3 3 -252 2 -253 35 0 35 0 2
          253 3 252 80 3 c87 3 100 9 90 41 -6 20 -12 21 -211 21 -173 0 -206 -2 -210
          -15z"/>
          <path d="M441 986 c-8 -9 -11 -92 -9 -282 l3 -269 35 0 35 0 5 242 5 242 74
          -192 c119 -306 115 -299 152 -295 30 3 32 6 132 253 l102 249 5 -249 5 -250
          30 0 30 0 0 280 0 280 -45 3 c-26 2 -52 -3 -61 -10 -9 -7 -56 -109 -105 -226
          -48 -116 -91 -209 -95 -205 -4 5 -44 100 -89 213 -46 113 -90 211 -98 218 -21
          16 -97 15 -111 -2z"/>
          <path d="M1167 613 c-4 -3 -7 -118 -7 -255 l0 -249 -67 1 c-106 2 -103 3 -103
          -30 l0 -30 210 0 210 0 0 30 c0 33 1 32 -82 30 -106 -3 -98 -25 -98 261 l0
          249 -28 0 c-16 0 -32 -3 -35 -7z"/>
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return loadingLogo;
  }

  return (
    <Link component={RouterLink} to="/" sx={{ display: 'contents' }}>
      {loadingLogo}
    </Link>
  );
});

LoadingLogo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default LoadingLogo;
