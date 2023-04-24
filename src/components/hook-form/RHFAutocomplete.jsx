import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
};


/*
Component that can take options with the format : 
- const options = ["Option1","Option2"]
- const options = [{label:"Option1",value:1},{label:"Option2",value:2}]

In the case of an options composed of object, the autocomplete returns the value of the selected object to the form onSubmit.
To indicate which format you are entering, use the shouldGetId prop
*/
export default function RHFAutocomplete({ name, label, options, shouldGetId, getOptionLabel, isOptionEqualToValue, helperText, ...other }) {
  const { control } = useFormContext();

  const getValueFromOptions = (value) => {
    return options.find((option) => option.value === value) ?? null;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          id="combo-box-demo"
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          onChange={
            (shouldGetId)
            ?(event, value) => {
              if(value) { 
                return onChange(value.value);
              } else { 
                return onChange(null);
              }
            }
            :(event, value) => {
              return onChange(value);
            }
          }
          value={(shouldGetId)?getValueFromOptions(value):value}
          renderInput={(params) => 
            <TextField 
              {...params} 
              label={label}
              fullWidth
              error={error}
              helperText={error ? error?.message : helperText}
              {...other}
            />
          }
        />
      )}
    />
  );
}
