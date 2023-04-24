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
import Iconify from '../../../../../components/iconify';
import Scrollbar from '../../../../../components/scrollbar';
import ConfirmDialog from '../../../../../components/confirm-dialog';
import { useSettingsContext } from '../../../../../components/settings';
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
import TestWorkflowExemptTabPanelListTableRow from './TestWorkflowExemptTabPanelListTableRow';
import TestWorkflowExemptTabPanelListToolbar from './TestWorkflowExemptTabPanelListToolbar';
import { fDate } from '../../../../../utils/formatTime';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
    { id: 'exempter', label: 'Exempter', align: 'left' },
    { id: 'exempt', label: 'Exempt', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: '' },
];

// ----------------------------------------------------------------------
const mockExempts = [
    {
        id: 1,
        exempter: "John Doe",
        exempt: "This is a sample exempt. There is important information to consider.",
        date: "2023-04-01",
    },
    {
        id: 1,
        exempter: "Jean Dupont",
        exempt: "Ceci est un exemple de commentaire pour un exempt. Il y a des informations importantes à considérer.",
        date: "2023-04-01",
    },
    {
        id: 2,
        exempter: "Marie Durand",
        exempt: "Un autre exemple de commentaire pour un exempt. Il faut prendre en compte certaines choses.",
        date: "2023-04-02",
    },
];

// --------------------------------------------

export default function TestWorkflowExemptTabPanelList() {
    const [tableData, setTableData] = useState([]);
    const [openAddNewExempt, setOpenAddNewExempt] = useState(false);

    useEffect(() => {
        setTableData(mockExempts);

    }, [])

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
        const deleteRow = tableData.filter((row) => row.id !== id);
        setSelected([]);
        setTableData(deleteRow);

        if (page > 0) {
            if (dataInPage.length < 2) {
                setPage(page - 1);
            }
        }
    };

    const handleDeleteRows = (selectedRows) => {
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
    };

    const handleEditRow = (id) => {
        console.log('handleEditRow', id);
    };





    const handleResetFilter = () => {
        setFilterSearch('');
    };

    const handleAddNewExempt = () => {
        setOpenAddNewExempt(true);
        alert('Add new incident')
    };

    const handleCloseAddNewExempt = () => {
        setOpenAddNewExempt(false);
    }

    return (
        <>

            <Container maxWidth={themeStretch ? false : 'lg'}>

                <Card>
                    <TestWorkflowExemptTabPanelListToolbar
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

                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
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
                                            <TestWorkflowExemptTabPanelListTableRow
                                                key={row.id}
                                                row={row}
                                                selected={selected.includes(row.id)}
                                                onSelectRow={() => onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onEditRow={() => { handleEditRow(row.id); console.log("row: " + row.id) }}
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
            (exempt) =>
                exempt.exempter.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                exempt.exempt.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                fDate(exempt.date).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
        );
    }
    return inputData;
}
