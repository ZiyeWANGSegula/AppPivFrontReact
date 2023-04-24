import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
// components
import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
import MenuPopover from '../../../../../components/menu-popover';
import ConfirmDialog from '../../../../../components/confirm-dialog';

import { fDate } from '../../../../../utils/formatTime';


// ----------------------------------------------------------------------

TestWorkflowExemptTabPanelListTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};

export default function TestWorkflowExemptTabPanelListTableRow({ row, selected, isEdit, onEditRow, onSaveRow, onSelectRow, onDeleteRow }) {
    const { exempter, exempt, date } = row;
    const [dialogContent, setDialogContent] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    console.log("row:" + row);


    const [openConfirm, setOpenConfirm] = useState(false);

    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleOpenPopover = (event) => {
        console.log("open pover row:" + row);
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        console.log("open pover row:" + row);
        setOpenPopover(null);
    };

    const handleClickOpen = (content) => {
        setDialogContent(content);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    {exempter}
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>

                        <Typography variant="subtitle2" noWrap>
                            {exempt.substring(0, 50)}...
                            <IconButton>
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell>
                    {fDate(date)}
                </TableCell>

                {isEdit ?
                    <TableCell align="right">
                        <Button
                            variant="contained"
                            color='inherit'
                            onClick={() => onSaveRow()}
                        >
                            Save
                        </Button>
                    </TableCell> :
                    <TableCell align="right">
                        <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </TableCell>
                }
            </TableRow>



            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="right-top"
                sx={{ width: 140 }}
            >

                <MenuItem
                    onClick={() => {
                        onEditRow();
                        handleClosePopover();
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleOpenConfirm();
                        handleClosePopover();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="eva:trash-2-outline" />
                    Delete
                </MenuItem>


            </MenuPopover>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
