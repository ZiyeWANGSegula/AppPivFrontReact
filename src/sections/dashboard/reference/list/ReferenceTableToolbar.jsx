import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

ReferenceTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterSearch: PropTypes.string,
  filterDuration: PropTypes.number,
  onfilterSearch: PropTypes.func,
  onFilterDuration: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function ReferenceTableToolbar({
  isFiltered,
  filterSearch,
  filterDuration,
  filterFirstDate,
  filterLastDate,
  optionsPerimeter,
  filterPerimeter,
  onfilterSearch,
  onFilterDuration,
  onFilterFirstDate,
  onFilterLastDate,
  onFilterPerimeter,
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
        select
        label="Perimeter"
        value={filterPerimeter}
        onChange={onFilterPerimeter}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textAlign:'left'
        }}
      >
        {optionsPerimeter.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

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
