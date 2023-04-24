import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel
} from '@mui/material';
 const TABLE_HEAD = [
  { id: 'column1', label: 'Column 1' },
  { id: 'column2', label: 'Column 2' },
  { id: 'column3', label: 'Column 3' }
];
 const filterColumnDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
   const handleOpen = () => {
    setIsOpen(true);
  };
   const handleClose = () => {
    setIsOpen(false);
  };
   const handleColumnVisibilityChange = (event) => {
    setColumnVisibility({
      ...columnVisibility,
      [event.target.name]: event.target.checked
    });
  };
   return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Dialog
      </Button>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="md">
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          {TABLE_HEAD.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  name={column.id}
                  checked={columnVisibility[column.id] || false}
                  onChange={handleColumnVisibilityChange}
                />
              }
              label={column.label}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
 export default filterColumnDialog;