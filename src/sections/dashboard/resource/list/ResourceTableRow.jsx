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
import { fDate } from '../../../../utils/formatTime';
import i18next from 'i18next';
import EntityDocumentDialog from '../../../general/documents/testWorkflowDocumentTabPanel/EntityDocumentDialog';

// ----------------------------------------------------------------------

ResourceTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function ResourceTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onDownloadResource, onOpenLink, selectedColumns }) {
  const { id, lib, ref, ProjDocuments, place, building, createdAt, updatedAt } = row;
  console.log('row.place')
  console.log(place)
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
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
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
            {lib}
          </TableCell>
        }
        {selectedColumns.ref &&
          <TableCell>
            {ref}
          </TableCell>
        }
        {selectedColumns.place &&
          <TableCell>
            {place}
          </TableCell>
        }
        {selectedColumns.building &&
          <TableCell>
            {building}
          </TableCell>
        }
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
            {createdAt}
          </TableCell>
        }
        {selectedColumns.updatedAt &&
          <TableCell>
            {updatedAt}
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
