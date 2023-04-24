import PropTypes from 'prop-types';
// @mui
import { Box, Switch, TablePagination, FormControlLabel, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...other
}) {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination 
        nextIconButtonProps={{ style: { color: theme.palette.primary.main } }}
        backIconButtonProps={{ style: { color: theme.palette.primary.main } }}
        rowsPerPageOptions={rowsPerPageOptions} 
        component="div" 
        {...other} 
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            left: 18,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      )}
    </Box>
  );
}
