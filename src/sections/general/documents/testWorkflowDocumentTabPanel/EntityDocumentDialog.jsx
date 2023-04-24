import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, TextareaAutosize } from '@mui/material';
import EntityDocumentList from './EntityDocumentList';
const EntityDocumentDialog = ({ open, handleClose, documents }) => {

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="comment-dialog" maxWidth="md" fullWidth>
            <DialogTitle id="Document List">Documents list</DialogTitle>
            <DialogContent>
                <EntityDocumentList
                    isEdit={false}
                    documents={documents}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EntityDocumentDialog;