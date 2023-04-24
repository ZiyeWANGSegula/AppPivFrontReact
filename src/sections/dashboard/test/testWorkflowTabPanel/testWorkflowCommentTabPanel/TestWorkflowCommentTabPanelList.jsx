import { useState, useEffect } from 'react';

// @mui
import {
    Card,
    Table,
    Button,
    Tooltip,
    TableBody,
    TextField,
    Container,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Paper,
    IconButton,
    TableContainer,
    TextareaAutosize,
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
// sections
import TestWorkflowCommentTabPanelListTableRow from './TestWorkflowCommentTabPanelListTableRow';
import TestWorkflowCommentTabPanelListToolbar from './TestWorkflowCommentTabPanelListToolbar';
import { fDate } from '../../../../../utils/formatTime';
import Axios from '../../../../../_services/caller.service';
import { testCommentService } from '../../../../../_services/testComment.service';
import { userService } from '../../../../../_services/user.service';
import TestWorkflowCommentDialog from './TestWorkflowCommentDialog';
// ----------------------------------------------------------------------


const TABLE_HEAD = [
    { id: 'rowVersionBy', label: 'Commenter', align: 'left' },
    { id: 'comment', label: 'Comment', align: 'left' },
    { id: 'updatedAt', label: 'Date', align: 'left' },
    { id: '' },
];

const excelTableHead = ['Commenter', 'Comment', 'Date', '']
const columnConfig = TABLE_HEAD.reduce((config, column) => {
    config[column.id] = true; // initially show all columns
    return config;
}, {});

const excelFileName = 'Workflow comment Data'

// ----------------------------------------------------------------------

// --------------------------------------------

export default function TestWorkflowCommentTabPanelList({ stepName, stepData, model, entity, setTotal }) {
    const [tableData, setTableData] = useState([]);
    const [openAddNewComment, setOpenAddNewComment] = useState(false);
    const [currentComment, setCurrentComment] = useState('');
    const [users, setUsers] = useState([])
    const [editCommentData, setEditCommentData] = useState()
    const [openEditComment, setOpenEditComment] = useState(false)

    const [columnVisibility, setColumnVisibility] = useState(columnConfig);
    const [isShowColumnFilter, setIsShowColumnFilter] = useState(false)
    console.log('entity: ' + entity)

    async function getUserData(comment) {
        const response = await userService.getUser(comment.rowVersionBy);
        const { rowVersionBy, ...rest } = comment;
        return { rowVersionBy: response.data.fullName, ...rest };
      }
      async function processUserList(commentList) {
        const _newData = [];
        for (const comment of commentList) {
          const newDataItem = await getUserData(comment);
          _newData.push(newDataItem);
        }
        console.log(_newData);
        setTableData(_newData)
      }
    useEffect(() => {
        const getCommentParams = {
            testId: stepData.testId,
            testStatusId: stepData.id,
            testStatus: `${stepName}`,
            testStatusField: `${stepName}_${entity}`,
        };
        console.log('getCommentParams');
        console.log(getCommentParams);
        testCommentService.getTestComment(getCommentParams).then(
            (res) => {
                console.log("comments data")
                console.log(res.data)
                const _resData = res.data.map(({ rowVersionBy, comment, updatedAt }) => ({ rowVersionBy, comment, updatedAt: fDate(updatedAt) }));
                processUserList(_resData)
                setTotal(res.data.length)

            })
    }, [openAddNewComment, openEditComment])


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
        let commentsToDelArray = []
        commentsToDelArray.push(id)

        testCommentService.deleteTestComment(id)
            .then(res => {
                console.log('workflow updated')
                const deleteRow = tableData.filter((row) => row.id !== id);
                setSelected([]);
                setTableData(deleteRow);
                setTotal(deleteRow.length)

                if (page > 0) {
                    if (dataInPage.length < 2) {
                        setPage(page - 1);
                    }
                }

            })
            .catch(err => { console.log(err); })

    };

    const handleSelectedDeleteRow = async (id) => {
        try {
            const res = await testCommentService
                .deleteTestComment(id);
            console.log("workflow updated");
            return id;
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteRows = (selectedRows) => {
        console.log("selectedRows");
        console.log(selectedRows);

        // Use Promise.all to wait for all delete requests to complete
        Promise.all(selectedRows.map((row) => handleSelectedDeleteRow(row))).then((deletedRowIds) => {
            const remainingRows = tableData.filter((row) => !deletedRowIds.includes(row.id));
            setSelected([]);
            setTableData(remainingRows);
            setTotal(remainingRows.length);

            if (page > 0) {
                if (dataInPage.length < 2) {
                    setPage(page - 1);
                }
            }
        });
    };

    const hanldeShowColumnFilter = () => {
        setIsShowColumnFilter(!isShowColumnFilter)
    }


    const handleEditRow = (id, comment) => {
        setCurrentComment(comment)
        const _data = {
            id: id,
            testId: stepData.testId,
            testStatus: stepName,
            testStatusId: stepData.id,
            testStatusField: `${stepName}_${entity}`,
            comment: comment
        }
        setEditCommentData(_data)
        setOpenEditComment(true)

    };

    const handleResetFilter = () => {
        setFilterSearch('');
    };

    const handleAddNewComment = () => {
        setOpenAddNewComment(true);
    };

    const handleNewCommentDialogClose = () => {
        setOpenAddNewComment(false);
    }

    const handleEditDialogClose = () => {
        setOpenEditComment(false);
    }

    const handleCommentChange = (e) => {
        setCurrentComment(e.target.value);
    };

    const handleCommentEdit = (params, updatedComment) => {
        params.comment = updatedComment;
        testCommentService.updateTestComment(params).then(res => {
            handleEditDialogClose()
        }).catch(err => { console.error(err); })
    }

    const handleCommentSave = () => {
        const AddCommentParams = {
            testId: stepData.testId,
            testStatusId: stepData.id,
            testStatus: `${stepName}`,
            testStatusField: `${stepName}_${entity}`,
            comment: currentComment
        };
        console.log('AddCommentParams');
        console.log(AddCommentParams);
        testCommentService.addTestComment(AddCommentParams).then(
            (res) => {
                console.log("comments data")
                console.log(res.data)
                handleNewCommentDialogClose()
            })
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
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleAddNewComment}
                >
                    Add new Comment
                </Button>

                <Card>
                    <TestWorkflowCommentTabPanelListToolbar
                        isFiltered={isFiltered}
                        filterSearch={filterSearch}
                        onfilterSearch={handleFilterSearch}
                        onResetFilter={handleResetFilter}
                    />
                    <ExportToExcel apiData={tableData} fileName={excelFileName} tableHead={excelTableHead}></ExportToExcel>
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
                                            <TestWorkflowCommentTabPanelListTableRow
                                                key={row.id}
                                                row={row}
                                                selected={selected.includes(row.id)}
                                                onSelectRow={() => onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onEditRow={() => { handleEditRow(row.id, row.comment); console.log("row: " + row.id) }}
                                                users={users}
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
            <TestWorkflowCommentDialog
                open={openEditComment}
                handleClose={handleEditDialogClose}
                comment={currentComment}
                updateComment={handleCommentEdit}
                editParams={editCommentData}
            />


            <Dialog open={openAddNewComment} onClose={handleNewCommentDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>Add New Comment</DialogTitle>
                <DialogContent>
                    <TextareaAutosize
                        autoFocus
                        margin="dense"
                        minRows={6}
                        style={{ width: '100%', padding: '5px' }}
                        label="Comment"
                        onChange={handleCommentChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNewCommentDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCommentSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
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
            (comment) =>
                // comment.commenter.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                comment.comment.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                fDate(comment.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
        );
    }
    return inputData;
}
