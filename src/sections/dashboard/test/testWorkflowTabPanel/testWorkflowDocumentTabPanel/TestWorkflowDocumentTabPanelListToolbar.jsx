import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button, Card } from '@mui/material';
// components
import Iconify from '../../../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

TestWorkflowDocumentTabPanelListToolbar.propTypes = {
    isFiltered: PropTypes.bool,
    filterSearch: PropTypes.string,
    onfilterSearch: PropTypes.func,
    onResetFilter: PropTypes.func,
};

export default function TestWorkflowDocumentTabPanelListToolbar({
    isFiltered,
    filterSearch,
    onfilterSearch,
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
