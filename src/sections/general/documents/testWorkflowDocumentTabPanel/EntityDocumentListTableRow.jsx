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
import Iconify from '../../../../components/iconify';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { fDate } from '../../../../utils/formatTime';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import Axios from '../../../../_services/caller.service';
import { fData } from '../../../../utils/formatNumber';
import { testService } from '../../../../_services/test.service';
import { DownloadButton } from '../../../../components/file-thumbnail';
import FileSaver from 'file-saver';
import axios from 'axios';
// ----------------------------------------------------------------------

EntityDocumentListTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};

function FileIcon({ fileType }) {
    switch (fileType) {
        case 'pdf':
            return <PictureAsPdfOutlinedIcon />;
        case 'doc':
            return <DescriptionOutlinedIcon />;
        // Add more cases for other file types
        default:
            return <InsertDriveFileOutlinedIcon />;
    }
}

FileIcon.propTypes = {
    fileType: PropTypes.string.isRequired,
};

const GetIconByExtension = (filename) => {
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

export default function EntityDocumentListTableRow({ isEdit, row, selected, onEditRow, onSelectRow, onDeleteRow, onDownloadDocument }) {
    const { docOriginalname, docSize, docUrl, updatedAt } = row;
    console.log("row:");
    console.log(row);

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

    const handleOpenUrl = (docUrl) => {
        if (!docUrl.startsWith('http://') && !docUrl.startsWith('https://')) {
            docUrl = 'https://' + docUrl;
        }
        window.open(docUrl, "_blank");
    }

    const handleDownloadDocument = async () => {
        try {
            if (docSize) {
                console.log('docUrl', docUrl)
                const res = await Axios.get(docUrl, { responseType: 'blob' });
                console.log(res)
                console.log(res.data)
                FileSaver.saveAs(res.data, docOriginalname);
            } else {
                console.log("docurl : " + docUrl)
                handleOpenUrl(docUrl);
            }
        } catch (err) {
            console.error('can not download file', err);
        }
    }

    const handleDeleteDocument = async () => {
        const data = {
            id: stepData.testId,
            step: stepName,
            stepId: stepData.id,
            documentsToAdd: JSON.stringify(uploaderResponse)
        }
        console.log('handlecloseupfile')
        console.log(data)

        testService.updateTest(data)
            .then(res => {
                console.log('workflow updated')

            })
            .catch(err => { console.log(err); })
        console.log('Upload successful! Executing the async function in the parent component.');
    }



    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    <Box display="flex" alignItems="center">
                        {/* <GetIconByExtension filename={docOriginalname} /> */}
                        {docOriginalname}
                    </Box>
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>

                        <Typography variant="subtitle2" noWrap>
                            {fData(docSize)}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell>
                    {fDate(updatedAt)}
                </TableCell>

                <TableCell>
                    {isEdit ? <IconButton onClick={() => {
                        handleOpenConfirm();
                        handleClosePopover();
                    }}
                        sx={{ color: 'error.main' }} >
                        <Iconify icon="eva:trash-2-outline" />

                    </IconButton> :
                        <IconButton onClick={handleDownloadDocument}>
                            {docSize ? <Iconify icon="eva:download-fill" /> : <Iconify icon="material-symbols:link" />
                            }
                        </IconButton>
                    }
                </TableCell>


            </TableRow>

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
