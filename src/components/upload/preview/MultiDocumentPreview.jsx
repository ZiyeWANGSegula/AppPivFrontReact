import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DocIcon from '@mui/icons-material/Description';
import XlsIcon from '@mui/icons-material/GridOn';
import PptIcon from '@mui/icons-material/Slideshow';
import UnknownIcon from '@mui/icons-material/HelpOutline';

const getIconByExtension = (filename) => {
  const fileExtension = filename.split('.').pop().toLowerCase();

  switch (fileExtension) {
    case 'pdf':
      return <PdfIcon />;
    case 'doc':
    case 'docx':
      return <DocIcon />;
    case 'xls':
    case 'xlsx':
      return <XlsIcon />;
    case 'ppt':
    case 'pptx':
      return <PptIcon />;
    default:
      return <UnknownIcon />;
  }
};


const MultiDocumentPreview = (props) => {
  const { files } = props;

  return (
    <List>
      {files.map((file) => (
        <ListItem key={file.docKey}>
          <ListItemIcon>
            {getIconByExtension(file.docFilename)}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1">
                {file.docOriginalname} ({file.docSize} bytes)
              </Typography>
            }
            secondary={
              <a
                href={file.docUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default MultiDocumentPreview;