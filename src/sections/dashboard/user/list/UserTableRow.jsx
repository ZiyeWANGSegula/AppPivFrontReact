import PropTypes from 'prop-types';
import { useState } from 'react';
import { fDate, fDateTime } from '../../../../utils/formatTime';
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
import i18next from 'i18next';
import { CustomAvatar } from '../../../../components/custom-avatar';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow,selectedColumns}) {
  const { id, firstName, email, lastName, username, cat, createdAt, updatedAt, avatarUrl } = row;
  //const avatarUrl = `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_5.jpg`

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

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
        {selectedColumns.cat &&
          <TableCell>
            <Box
              columnGap={1}
              display="grid"
              gridTemplateColumns={{
                xs: '30% 70%',
                sm: '30% 70%',
              }}
              gridTemplateRows={{
                xs: 'auto auto',
                sm: 'auto auto',
              }}
            >

              <CustomAvatar src={avatarUrl} />

              <Typography alignSelf={'center'} justifySelf={'left'}>
                {cat}
              </Typography>
            </Box>
          </TableCell>
        }
        {selectedColumns.firstName &&
          <TableCell>

            <Typography>
              {firstName}
            </Typography>

          </TableCell>
        }
        {selectedColumns.lastName &&
          <TableCell>

            <Typography>
              {lastName}
            </Typography>

          </TableCell>
        }
        {selectedColumns.username &&
          <TableCell>{username}</TableCell>
        }
        {selectedColumns.email &&
          <TableCell>{email}</TableCell>
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
