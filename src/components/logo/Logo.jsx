import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  /*const logo = (
    <Box
      component="img"
      src="/logo/logo.png"
      sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    />
  );*/

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: "100%",
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="100%" height="100%" viewBox="0 0 991.000000 213.000000"
        preserveAspectRatio="xMidYMid meet">

        <g transform="translate(0.000000,213.000000) scale(0.100000,-0.100000)" fill={PRIMARY_MAIN} stroke="none">
          <path d="M5299 1862 c-39 -20 -62 -41 -84 -77 l-30 -48 -3 -651 c-2 -575 -1
          -656 13 -693 24 -61 52 -93 109 -119 l51 -24 670 0 c652 0 671 1 715 21 60 27
          79 45 106 104 l24 50 0 645 0 645 -24 50 c-27 59 -46 77 -106 104 -44 20 -63
          21 -716 21 l-672 0 -53 -28z m1459 -36 c23 -16 50 -46 62 -70 19 -41 20 -59
          20 -686 0 -636 0 -644 -21 -688 -13 -26 -38 -54 -62 -70 l-41 -27 -691 0 -691
          0 -41 27 c-24 16 -49 44 -62 70 -21 44 -21 53 -21 679 0 390 4 648 10 670 12
          43 73 106 114 118 18 6 328 9 707 8 l676 -2 41 -29z"/>
          <path d="M5347 1673 c-4 -3 -7 -17 -7 -29 0 -22 4 -23 88 -26 l87 -3 3 -252 2
          -253 35 0 35 0 2 253 3 252 80 3 c87 3 100 9 90 41 -6 20 -12 21 -209 21 -111
          0 -206 -3 -209 -7z"/>
          <path d="M5721 1336 c-8 -9 -11 -92 -9 -282 l3 -269 35 0 35 0 5 242 5 242 74
          -192 c119 -306 115 -299 152 -295 31 3 32 6 132 253 l102 249 3 -253 2 -252
          33 3 32 3 0 280 0 280 -45 3 c-26 2 -52 -3 -61 -10 -9 -7 -56 -109 -105 -225
          -48 -117 -90 -213 -93 -213 -3 1 -44 98 -91 216 -48 122 -92 219 -102 225 -25
          14 -94 11 -107 -5z"/>
          <path d="M6447 963 c-4 -3 -7 -118 -7 -255 l0 -248 -85 0 -85 0 0 -30 0 -30
          210 0 210 0 0 30 0 29 -87 3 -88 3 -3 253 -2 252 -29 0 c-15 0 -31 -3 -34 -7z"/>
        </g>
        <g transform="translate(0.000000,213.000000) scale(0.100000,-0.100000)" fill='#000000' stroke="none">
          <path d="M2387 1523 c-4 -3 -7 -204 -7 -445 l0 -439 53 3 52 3 5 157 5 157
          124 -159 123 -160 54 0 c43 0 54 3 54 16 0 9 -51 82 -113 162 -62 81 -117 153
          -121 160 -6 10 26 49 104 127 62 63 110 120 108 127 -3 8 -25 14 -55 16 l-50
          3 -114 -126 -114 -125 -5 262 c-3 145 -7 264 -8 266 -5 5 -89 1 -95 -5z"/>
          <path d="M137 1463 c-14 -14 -7 -81 9 -87 9 -3 65 -6 125 -6 l109 0 2 -362 3
          -363 53 -3 52 -3 0 365 0 366 118 0 c125 0 142 6 142 46 0 56 13 54 -309 54
          -164 0 -301 -3 -304 -7z"/>
          <path d="M3296 1452 c-15 -17 -16 -57 -14 -413 l3 -394 52 -3 53 -3 2 363 3
          362 140 -359 140 -360 50 0 50 0 145 358 145 359 5 -359 5 -358 53 -3 52 -3 0
          405 c0 462 8 426 -90 426 -43 0 -56 -5 -79 -27 -17 -19 -68 -130 -150 -330
          -68 -167 -127 -303 -131 -303 -4 0 -10 9 -13 19 -2 11 -58 153 -123 317 -113
          282 -120 297 -151 310 -48 21 -126 18 -147 -4z"/>
          <path d="M7194 1456 c-3 -8 -4 -29 -2 -48 l3 -33 122 -3 123 -3 2 -362 3 -362
          50 0 50 0 3 363 2 362 120 0 c119 0 121 0 130 25 6 16 6 34 0 50 l-10 25 -295
          0 c-245 0 -297 -2 -301 -14z"/>
          <path d="M8978 1399 c-15 -8 -18 -24 -18 -79 l0 -70 -45 0 c-39 0 -45 -3 -51
          -24 -11 -47 3 -66 51 -66 l43 0 4 -202 c6 -244 14 -275 85 -309 37 -18 56 -21
          106 -16 69 6 90 24 85 72 -2 24 -7 29 -23 26 -11 -2 -40 -4 -65 -5 -42 -1 -46
          1 -62 34 -15 29 -18 64 -18 218 l0 182 80 0 c76 0 80 1 86 24 3 14 3 34 -1 45
          -6 19 -14 21 -86 21 l-79 0 0 74 0 74 -31 6 c-39 8 -40 8 -61 -5z"/>
          <path d="M973 1250 c-12 -5 -40 -27 -62 -49 l-40 -40 -3 42 -3 42 -45 0 -45 0
          0 -300 0 -300 50 0 50 0 3 203 2 203 55 56 c57 59 63 61 157 41 9 -2 14 11 16
          45 3 43 1 48 -23 57 -32 12 -82 12 -112 0z"/>
          <path d="M1310 1246 c-90 -25 -120 -50 -120 -97 0 -31 28 -34 78 -8 55 27 158
          37 201 19 38 -15 63 -68 59 -123 l-3 -42 -106 -6 c-127 -7 -187 -31 -224 -88
          -67 -102 -25 -223 91 -261 60 -20 149 -7 201 29 24 17 45 31 47 31 2 0 6 -13
          10 -30 5 -27 9 -30 45 -30 38 0 40 2 47 37 4 20 4 126 1 237 -6 221 -13 254
          -67 299 -55 47 -162 60 -260 33z m220 -390 c0 -62 -1 -66 -37 -96 -76 -62
          -168 -65 -203 -7 -27 43 -25 80 5 115 30 36 76 50 168 51 l67 1 0 -64z"/>
          <path d="M1980 1251 c-120 -37 -181 -129 -188 -287 -7 -145 29 -237 115 -297
          76 -54 230 -46 307 14 20 16 26 30 26 59 0 21 -4 41 -9 44 -5 4 -33 -8 -62
          -26 -45 -28 -61 -33 -117 -33 -61 0 -66 2 -97 37 -43 47 -58 102 -53 203 4 95
          27 149 77 182 56 38 126 29 204 -24 32 -22 40 -24 48 -12 16 26 10 69 -15 94
          -43 43 -167 67 -236 46z"/>
          <path d="M7940 1245 c-64 -20 -114 -66 -147 -133 -26 -53 -28 -65 -27 -177 0
          -138 11 -172 74 -235 65 -65 203 -89 325 -56 80 21 95 32 95 70 0 18 -3 35 -6
          39 -3 3 -31 -4 -62 -15 -78 -27 -184 -29 -237 -3 -47 24 -85 89 -85 147 l0 38
          194 0 c225 0 220 -2 218 91 -2 66 -29 138 -65 177 -57 61 -184 87 -277 57z
          m157 -84 c46 -21 69 -56 79 -120 l7 -41 -157 0 -156 0 0 26 c0 39 29 92 64
          119 52 39 101 44 163 16z"/>
          <path d="M8509 1233 c-71 -37 -105 -98 -94 -171 9 -64 57 -108 165 -152 89
          -37 120 -66 120 -112 0 -43 -37 -74 -97 -83 -42 -5 -62 -2 -115 20 -85 35 -83
          35 -86 -7 -5 -63 59 -98 181 -98 136 0 217 68 217 182 0 76 -38 126 -120 158
          -90 35 -151 72 -161 97 -32 85 67 137 182 94 66 -26 66 -26 74 -2 12 39 -11
          69 -66 85 -79 24 -137 20 -200 -11z"/>
          <path d="M9468 1246 c-85 -31 -118 -77 -118 -163 0 -80 37 -120 160 -172 100
          -43 122 -64 118 -115 -4 -55 -39 -79 -116 -80 -45 -1 -70 5 -111 27 -29 15
          -57 24 -62 21 -11 -6 -12 -64 -1 -80 4 -6 23 -20 42 -30 50 -27 210 -27 260 0
          114 62 134 207 39 278 -19 14 -65 38 -104 54 -92 38 -125 67 -125 108 0 69 83
          103 170 71 74 -27 85 -25 85 14 0 29 -6 38 -32 53 -42 25 -156 33 -205 14z"/>
          <path d="M4315 1241 c-4 -8 188 -541 213 -588 7 -13 -1 -46 -29 -117 -22 -55
          -39 -106 -39 -113 0 -17 94 -18 107 0 5 6 17 32 26 57 220 608 267 745 263
          757 -4 10 -19 13 -52 11 l-46 -3 -82 -237 c-44 -131 -83 -234 -87 -230 -3 4
          -41 106 -83 227 -43 121 -83 226 -88 233 -12 14 -94 17 -103 3z"/>
        </g>
      </svg>
      {/*<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 147.000000 140.000000">
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
      </svg>*/}
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} to="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;