import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

VehicleTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterSearch: PropTypes.string,
  onfilterSearch: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function VehicleTableToolbar({
  isFiltered,
  filterSearch,
  filterFirstDate,
  filterLastDate,
  onfilterSearch,
  onFilterFirstDate,
  onFilterLastDate,
  onResetFilter,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >

      {/*<Stack
        spacing={0.5}
        alignItems="center"
        direction={{
          xs: 'column',
          sm: 'row',
        }}
      >
        <TextField
          label="Start date"
          fullWidth
          type="date"
          value={filterFirstDate}
          onChange={onFilterFirstDate}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: filterLastDate}}
        />
        <TextField
          label="End date"
          fullWidth
          type="date"
          value={filterLastDate}
          onChange={onFilterLastDate}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: filterFirstDate}}
        />
      </Stack>*/}

      <TextField
        fullWidth
        value={filterSearch}
        onChange={onfilterSearch}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}
