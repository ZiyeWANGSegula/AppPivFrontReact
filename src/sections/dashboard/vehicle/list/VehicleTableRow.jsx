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
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { fData } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
import EntityDocumentDialog from '../../../general/documents/testWorkflowDocumentTabPanel/EntityDocumentDialog';

// ----------------------------------------------------------------------

VehicleTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function VehicleTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, selectedColumns }) {
  const { id, lib, ProjDocuments, program, stage, silhouette, engine, finishing, createdAt, updatedAt } = row;
  console.log("row:" + row);
  console.log('selectedColumns')
  console.log(selectedColumns)


  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const [openDocumentDialog, setOpenDocumentDialog] = useState(false)

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

  const handleOpenDocumentList = () => {
    setOpenDocumentDialog(true);
  };

  const handleCloseDocumentList = () => {
    setOpenDocumentDialog(false);
  };


  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox sx={{ color: 'primary.main' }} checked={selected} onClick={onSelectRow} />
        </TableCell>
        {selectedColumns.id &&
          <TableCell>
            {id}
          </TableCell>
        }

        {selectedColumns.lib &&
          <TableCell>
            <Stack spacing={2}>
              <Typography noWrap>{lib}</Typography>
            </Stack>
          </TableCell>
        }
        {selectedColumns.program &&
          <TableCell>
            {program}
          </TableCell>
        }
        {selectedColumns.silhouette &&
          <TableCell>
            {silhouette}
          </TableCell>
        }
        {selectedColumns.stage &&
          <TableCell>
            {stage}
          </TableCell>
        }
        {selectedColumns.engine &&
          <TableCell>
            {engine}
          </TableCell>}

        {selectedColumns.finishing &&
          <TableCell>
            {finishing}
          </TableCell>}
        {selectedColumns.ProjDocuments &&
          <TableCell>
            {ProjDocuments.length != 0 && <Button
              onClick={() => {
                handleOpenDocumentList()
              }}
            >
              <Iconify icon="material-symbols:attach-file" />
            </Button>}
          </TableCell>
        }
        {selectedColumns.createdAt &&
          <TableCell>
            {fDate(createdAt)}
          </TableCell>
        }
        {selectedColumns.updatedAt &&
          <TableCell>
            {fDate(updatedAt)}
          </TableCell>
        }
        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" color='primary.main' />
          </IconButton>
        </TableCell>
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
      <EntityDocumentDialog open={openDocumentDialog} handleClose={handleCloseDocumentList} documents={ProjDocuments}></EntityDocumentDialog>

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
