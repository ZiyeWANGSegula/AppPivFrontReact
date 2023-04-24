import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { testService } from '../../../../_services/test.service';
import { referenceService } from '../../../../_services/reference.service';
const maxTextUrlLength = 40;
const EntityTextURLUploader = ({ isEdit, open, onClose, onUploadSuccess, onSetUploadInfo, onUpload }) => {
    const [textURL, setTextURL] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleUpload = () => {
        //setUploading(true);
        const docUrlName = textURL.length > maxTextUrlLength
        ? textURL.slice(0, maxTextUrlLength - 3) + '...'
        : textURL;
        const documentsToAdd =  JSON.stringify([{docKey:"",docOriginalname:docUrlName,docFilename:"",docSize:0,docMimetype:"application/url",docUrl:textURL}]) 
        if(isEdit){
          onSetUploadInfo(documentsToAdd)
        }else{
          onSetUploadInfo(documentsToAdd)
        }


 
      };
      return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
          <DialogTitle>Upload Text URL</DialogTitle>
          <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
            <TextField
              fullWidth
              label="Text URL"
              value={textURL}
              onChange={(e) => setTextURL(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {uploading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpload} disabled={!textURL}>Upload</Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      );
      
};

export default EntityTextURLUploader;