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
    Checkbox,
    FormControlLabel
} from '@mui/material';

// components
import Iconify from '../../../../../components/iconify';
import Scrollbar from '../../../../../components/scrollbar';
import ConfirmDialog from '../../../../../components/confirm-dialog';
import { useSettingsContext } from '../../../../../components/settings';
import { ExportToExcel } from '../../../../../utils/ExportToExcel';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../../../../components/table';
import PropTypes from 'prop-types';
// sections
import TestWorkflowDocumentTabPanelListTableRow from './TestWorkflowDocumentTabPanelListTableRow';
import TestWorkflowDocumentTabPanelListToolbar from './TestWorkflowDocumentTabPanelListToolbar';
import { fDate } from '../../../../../utils/formatTime';
import { FileUpload } from '@mui/icons-material';
import { FileNewFolderDialog } from '../../../file';
import { testService } from '../../../../../_services/test.service';
import { useSnackbar } from '../../../../../components/snackbar';
import Axios from '../../../../../_services/caller.service';
import { documentService } from '../../../../../_services/document.service';
import TextURLUploader from '../../../file/portal/TextURLUploader';
import { fData } from '../../../../../utils/formatNumber';

// file upload

// ----------------------------------------------------------------------


const TABLE_HEAD = [
    { id: 'docOriginalname', label: 'Doc Name', align: 'left' },
    { id: 'docSize', label: 'Doc Size', align: 'left' },
    { id: 'updatedAt', label: 'Date', align: 'left' },
    { id: 'download', label: 'Open File', align: 'left' },
    { id: '' },
];
const excelTableHead = ['doc name', 'doc size', 'doc URL', 'Updated at']
const columnConfig = TABLE_HEAD.reduce((config, column) => {
    config[column.id] = true; // initially show all columns
    return config;
}, {});

const excelFileName = 'Workflow document Data'

// ----------------------------------------------------------------------

// --------------------------------------------
TestWorkflowDocumentTabPanelList.propTypes = {
    stepName: PropTypes.string,
    stepData: PropTypes.object,
    model: PropTypes.string,
    entity: PropTypes.string,
};

export default function TestWorkflowDocumentTabPanelList({ stepName, stepData, model, entity, setTotal }) {
    const [tableData, setTableData] = useState([]);
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const [openUploadURL, setOpenUploadURL] = useState(false);
    const [entityDocument, setEntityDocument] = useState([]);
    const [excelData, setExcelData] = useState([])
    const enqueueSnackbar = useSnackbar()
    const people = [
        { name: "John Smith", age: 30, email: "john.smith@example.com" },
        { name: "Jane Doe", age: 25, email: "jane.doe@example.com" },
        { name: "Bob Johnson", age: 45, email: "bob.johnson@example.com" }
      ];
       
      const newPeople = people.map(({ name, age }) => ({ name, age })); // Create a new array with only the name and age properties
       

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

    const [columnVisibility, setColumnVisibility] = useState(columnConfig);

    const [isShowColumnFilter, setIsShowColumnFilter] = useState(false)

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
        const params = {
            id: stepData.testId,
            model: model,
            field: stepName,
        };
        console.log('panel list params');
        console.log(params);
        Axios.get('/api/documents/', { params }).then(
            (res) => {
                console.log(res.data)
                //const _resData= res.data.map(data=>Object.assign({}, data, { docSize:fData(docSize),updatedAt:fDate(updatedAt) }))
                const _resData2 = res.data.map(({ docOriginalname, docSize,docUrl,updatedAt }) => ({ docOriginalname, docSize:fData(docSize),docUrl,updatedAt:fDate(updatedAt) }));

                setEntityDocument(res.data)

                setTableData(_resData2)
                setTotal(res.data.length)
                const _excelData = res.data.map(({ docOriginalname, docSize,docUrl,updatedAt }) => ({ docOriginalname, docSize,docUrl,updatedAt:fDate(updatedAt) }));
                setExcelData(_resData2)
                
            })


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
        let documentsToDelArray = []
        documentsToDelArray.push(id)

        const data = {
            id: stepData.testId,
            step: stepName,
            stepId: stepData.id,
            documentsToDel: documentsToDelArray
        }
        console.log('deletedocument')
        console.log(data)

        testService.updateTest(data)
            .then(res => {
                console.log('workflow updated')
                const deleteRow = tableData.filter((row) => row.id !== id);
                setSelected([]);
                setTableData(deleteRow);

                if (page > 0) {
                    if (dataInPage.length < 2) {
                        setPage(page - 1);
                    }
                }

            })
            .catch(err => { console.log(err); })
        console.log('Upload successful! Executing the async function in the parent component.');
    };

    const handleDeleteRows = (selectedRows) => {
        console.log('selectedRows')
        console.log(selectedRows)
        let documentsToDelArray = []
        selectedRows.map(row => {
            documentsToDelArray.push(row)
        })
        const data = {
            id: stepData.testId,
            step: stepName,
            stepId: stepData.id,
            documentsToDel: documentsToDelArray
        }
        console.log('deletedocument')
        console.log(data)

        testService.updateTest(data)
            .then(res => {
                console.log('workflow updated')
                const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
                setSelected([]);
                setTableData(deleteRows);

                if (page > 0) {
                    if (selectedRows.length === dataInPage.length) {
                        setPage(page - 1);
                    } else if (selectedRows.length === dataFiltered.length) {
                        setPage(0);
                    } else if (selectedRows.length > dataInPage.length) {
                        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
                        setPage(newPage);
                    }
                }

                if (page > 0) {
                    if (dataInPage.length < 2) {
                        setPage(page - 1);
                    }
                }

            })
            .catch(err => { console.log(err); })
        console.log('Upload successful! Executing the async function in the parent component.');
    };

    const hanldeShowColumnFilter = () => {
        setIsShowColumnFilter(!isShowColumnFilter)
    }

    const handleEditRow = (id) => {

        console.log('handleEditRow', id);
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
    const handleUploadSuccess = () => {
        const data = {
            //step:`${stepName.toUpperCase()}`,
            // id : testId,
            // step:`REQUIREMENTS`,
            // stepId:stepData.id,
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
    };

    const handleCloseUploadFile = () => {
        setOpenUploadFile(false);

    }

    const handleCloseUploadURL = () => {
        setOpenUploadURL(false);

    }


    const handleSetUploaderInfo = (data, callback) => {
        setUploaderResponse(data);
        console.log(data);
        const docData = {
            id: stepData.testId,
            step: stepName,
            stepId: stepData.id,
            documentsToAdd: data
        }
        console.log('handlecloseupfile')
        console.log(docData)

        testService.updateTest(docData)
            .then(res => {
                console.log('workflow updated')

            })
            .catch(err => { console.log(err); })

        if (callback) {
            console.log('callback')
        }
    };


    const handleColumnVisibilityChange = (event) => {
        const { name, checked } = event.target;
        setColumnVisibility((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    return (
        <>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Button sx={{ marginLeft: 2, marginBottom: 2 }}
                    variant="contained"
                    startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                    onClick={handleOpenUploadFile}
                >
                    Upload New Document
                </Button>

                <Button sx={{ marginLeft: 2, marginBottom: 2 }}
                    variant="contained"
                    startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                    onClick={handleOpenUploadURL}
                >
                    New url
                </Button>

                <Card>
                    <TestWorkflowDocumentTabPanelListToolbar
                        isFiltered={isFiltered}
                        filterSearch={filterSearch}
                        onfilterSearch={handleFilterSearch}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }} component={Paper}>
                        <TableSelectedAction
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
                        />
                        <ExportToExcel apiData={excelData} fileName={excelFileName} tableHead={excelTableHead}></ExportToExcel>
                        <IconButton onClick={hanldeShowColumnFilter}><Iconify icon="material-symbols:filter-list" ></Iconify></IconButton>
                        {isShowColumnFilter && <div>
                            {TABLE_HEAD.map((column) => (
                                <FormControlLabel control={<Checkbox
                                    name={column.id}
                                    checked={columnVisibility[column.id]}
                                    onChange={handleColumnVisibilityChange}
                                />} label={column.label} />

                            ))}
                        </div>}

                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD.filter((column) => columnVisibility[column.id])}
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
                                            <TestWorkflowDocumentTabPanelListTableRow
                                                key={row.id}
                                                row={row}
                                                selected={selected.includes(row.id)}
                                                onSelectRow={() => onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onEditRow={() => { handleEditRow(row.id); console.log("row: " + row.id) }}
                                                onDownloadDocument={() => handleDownloadDocument()}
                                                selectedColumns={columnVisibility}

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
            <FileNewFolderDialog open={openUploadFile} onCreate={console.log('new onCreate')} onUploadSuccess={handleUploadSuccess} onClose={handleCloseUploadFile} entity={entity} setUploaderInfo={handleSetUploaderInfo} />
            <TextURLUploader open={openUploadURL} onClose={handleCloseUploadURL} stepData={stepData} stepName={stepName} onUploadSuccess={handleCloseUploadURL}></TextURLUploader>
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
