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
// components
import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
import MenuPopover from '../../../../../components/menu-popover';
import ConfirmDialog from '../../../../../components/confirm-dialog';
import { fDate } from '../../../../../utils/formatTime';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

// ----------------------------------------------------------------------

TestWorkflowIncidentTabPanelListTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};


export default function TestWorkflowIncidentTabPanelListTableRow({ row, selected, isEdit, onEditRow, onSelectRow, onSaveRow, onDeleteRow }) {
    const { date, assignment, duration, comment } = row;
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

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    {fDate(date)}
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>

                        <Typography variant="subtitle2" noWrap>
                            {assignment}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell>
                    {duration}
                </TableCell>

                <TableCell>
                    {comment}
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
