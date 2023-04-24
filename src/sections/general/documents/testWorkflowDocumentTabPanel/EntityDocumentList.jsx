import { useState, useEffect } from 'react';

// @mui
import {
    Card,
    Table,
    Button,
    Tooltip,
    TableBody,
    Container,
    Paper,
    IconButton,
    TableContainer,
} from '@mui/material';

// components
//import Iconify from '../../../../../../components/iconify';
import Iconify from '../../../../components/iconify/Iconify';
import Scrollbar from '../../../../components/scrollbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { useSettingsContext } from '../../../../components/settings';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../../../components/table';
import PropTypes from 'prop-types';
// sections
import EntityDocumentListTableRow from './EntityDocumentListTableRow';
import EntityDocumentListToolbar from './EntityDocumentListToolbar';
import { fDate } from '../../../../utils/formatTime';
import { useSnackbar } from '../../../../components/snackbar';
import { documentService } from '../../../../_services/document.service';
// file upload

// ----------------------------------------------------------------------


const TABLE_HEAD_ONLY_SHOW = [
    { id: 'docName', label: 'Doc Name', align: 'left' },
    { id: 'docSize', label: 'Doc Size', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'download', label: 'Open File', align: 'left' },
    { id: '' },
];

const TABLE_HEAD_EDIT = [
    { id: 'docName', label: 'Doc Name', align: 'left' },
    { id: 'docSize', label: 'Doc Size', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'download', label: 'Delete', align: 'left' },
    { id: '' },
];


// ----------------------------------------------------------------------

// --------------------------------------------
EntityDocumentList.propTypes = {
    isEdit: PropTypes.bool,
    documents: PropTypes.arrayOf(PropTypes.object)

};

export default function EntityDocumentList({ isEdit, documents, onDeleteDocument }) {
    const [tableData, setTableData] = useState([]);
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const [openUploadURL, setOpenUploadURL] = useState(false);
    const [entityDocument, setEntityDocument] = useState([]);
    const enqueueSnackbar = useSnackbar()
    console.log('documentsInEntityDocumentsList')
    console.log(documents)

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable();



    const { themeStretch } = useSettingsContext();

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterSearch, setFilterSearch] = useState('');

    const [uploaderResponse, setUploaderResponse] = useState(null);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterSearch,
    });

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const denseHeight = dense ? 52 : 72;

    const isFiltered = filterSearch !== ''

    const isNotFound = (!dataFiltered.length && !!filterSearch)

    useEffect(() => {
        setTableData(documents)
    }, [uploaderResponse, openUploadURL])


    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleFilterSearch = (event) => {
        setPage(0);
        setFilterSearch(event.target.value);
    };

    const handleDeleteRow = (id) => {

        onDeleteDocument(id)

        console.log('Upload successful! Executing the async function in the parent component.');
    };

    const handleDeleteRows = (selectedRows) => {
        console.log('selectedRows')
        console.log(selectedRows)
        let documentsToDelArray = []
        selectedRows.map(row => {
            documentsToDelArray.push(row)
        })
        console.log('Upload successful! Executing the async function in the parent component.');
    };


    const handleDownloadDocument = (docUrl, docOriginalname) => {
        documentService.downloadDocument(docUrl, docOriginalname);
    }


    const handleResetFilter = () => {
        setFilterSearch('');
    };

    const handleOpenUploadFile = () => {
        setOpenUploadFile(true);
        console.log('openUploadFile' + openUploadFile);
    };


    const handleOpenUploadURL = () => {
        setOpenUploadURL(true);
        console.log('openUploadFile' + openUploadFile);
    };

    const handleCloseUploadFile = () => {
        setOpenUploadFile(false);

    }

    const handleCloseUploadURL = () => {
        setOpenUploadURL(false);

    }


    const handleSetUploaderInfo = (data, callback) => {
        console.log('setUploaderInfo')

    };

    return (
        <>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Card>
                    <EntityDocumentListToolbar
                        isFiltered={isFiltered}
                        filterSearch={filterSearch}
                        onfilterSearch={handleFilterSearch}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }} component={Paper}>
                        {isEdit && <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    tableData.map((row) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={handleOpenConfirm}>
                                        <Iconify icon="eva:trash-2-outline" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />}

                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={isEdit?TABLE_HEAD_EDIT:TABLE_HEAD_ONLY_SHOW}
                                    rowCount={tableData.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            tableData.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <EntityDocumentListTableRow
                                                key={row.id}
                                                row={row}
                                                selected={selected.includes(row.id)}
                                                onSelectRow={() => onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onDownloadDocument={() => handleDownloadDocument()}
                                                isEdit={isEdit}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                                    />

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        //
                        dense={dense}
                        onChangeDense={onChangeDense}
                    />
                </Card>
            </Container>
            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows(selected);
                            handleCloseConfirm();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterSearch }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterSearch) {
        inputData = inputData.filter(
            (document) =>
                document.docOriginalname.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                fDate(document.date).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
        );
    }
    return inputData;
}
