import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import {
    Stack,
    Avatar,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
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
import { userService } from '../../../../../_services/user.service';

// ----------------------------------------------------------------------

const maxShownCommentLength = 30
TestWorkflowCommentTabPanelListTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,

};

export default function TestWorkflowCommentTabPanelListTableRow({ row, selected, isEdit, onEditRow, onSaveRow, onSelectRow, onDeleteRow, users, selectedColumns }) {
    const { rowVersionBy, comment, updatedAt } = row;
    console.log('rowVersionBy')
    console.log(rowVersionBy)
    const shownComment = comment.length > maxShownCommentLength
        ? comment.slice(0, maxShownCommentLength - 3) + '...'
        : comment;
    const [commenter, setCommenter] = useState('commenter');
    // useEffect(() =>{
    //     userService.getUser(rowVersionBy).then(res=>{
    //         setCommenter(res.data)
    //     })
    // },[rowVersionBy])
    console.log(commenter)
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
                {selectedColumns.rowVersionBy &&
                    <TableCell>
                        {rowVersionBy}
                    </TableCell>
                }
                {selectedColumns.id &&
                    <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>

                            <Typography variant="subtitle2" noWrap>
                                {shownComment}
                                <IconButton onClick={() => handleClickOpen(comment)}>
                                    <InfoIcon fontSize="small" />
                                </IconButton>
                            </Typography>
                        </Stack>
                    </TableCell>
                }
                {selectedColumns.updatedAt &&
                    <TableCell>
                        {updatedAt}
                    </TableCell>
                }


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
            <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Comment</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogContent}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
