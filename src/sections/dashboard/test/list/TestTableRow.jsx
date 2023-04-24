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
import i18next from 'i18next';

// ----------------------------------------------------------------------

TestTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function TestTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, selectedColumns }) {
  const { id, lib, status, referentId, referentFullName, referentCustomerId, referentCustomerFullName, createdAt, updatedAt } = row;
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

        {selectedColumns.status &&
          <TableCell>
            {status}
          </TableCell>
        }

        {selectedColumns.referentFullName &&
          <TableCell>
            {referentFullName}
          </TableCell>
        }

        {selectedColumns.referentCustomerFullName &&
          <TableCell>
            {referentCustomerFullName}
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
          Workflow
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
