import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { testService } from "../../../_services/test.service";
import { ExportToExcel } from '../../../utils/ExportToExcel';

// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Stack,
  useTheme,
  Grid,
  Checkbox,
  FormControlLabel
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { TestTableToolbar, TestTableRow } from '../../../sections/dashboard/test/list';
import { fDate } from '../../../utils/formatTime';
import i18next from 'i18next';
import { AnalyticsCount, Bar, StackedBar } from '../../../sections/general/analytics';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'REQUIREMENTS', 'FEASIBILITY', 'PLANNING_FREEZE', 'RECEPTION', 'TEST_COURSE', 'REPORTS', 'ENDED'];
const REAL_STATUS_OPTIONS = ['REQUIREMENTS', 'FEASIBILITY', 'PLANNING_FREEZE', 'RECEPTION', 'TEST_COURSE', 'REPORTS', 'ENDED'];

const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'lib', label: 'Test name', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'referentFullName', label: 'Referent', align: 'left' },
  { id: 'referentCustomerFullName', label: 'Customer', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'left' },
  { id: '' },
];
const excelTableHead = ['Id', 'Test name', 'Status', 'Referent', 'Customer', 'Created At', 'Updated At', ' ']
const columnConfig = TABLE_HEAD.reduce((config, column) => {
  config[column.id] = true; // initially show all columns
  return config;
}, {});

const excelFileName = 'Test Data'
// ----------------------------------------------------------------------

export default function TestListPage() {
  const { presetsOption } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [Tests, setTests] = useState([]);
  const [seriesKpi, setSeriesKPI] = useState([]);
  const [seriesKpiTotal, setSeriesKPITotal] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false)

  useEffect(() => {
    testService.getAllTests(1).then(
      res => {
        console.log(res);
        const _resData = res.data.map(({ id, lib,status, referentFullName,referentCustomerFullName,createdAt,updatedAt }) => ({ id, lib,status:i18next.t(status.toLowerCase()), referentFullName,referentCustomerFullName,createdAt:fDate(createdAt),updatedAt:fDate(updatedAt) }));
        setTableData(_resData);
      }
    ).catch(err => {
      console.log(err);
    })
    //set values for KPIs
    testService.getTestsKPI().then(
      res => {
        let seriesTab = [];
        setSeriesKPITotal(res.data.total);
        res.data.status.forEach(element => {
          seriesTab.push({ label: i18next.t(element.status.toLowerCase()), value: element.count })
        });
        setSeriesKPI(seriesTab);
        console.log(seriesKpi);
      }
    ).catch(err => {
      console.log(err);
    })

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


  const theme = useTheme();
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();



  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterSearch, setFilterSearch] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterFirstDate, setFilterFirstDate] = useState("");

  const [filterLastDate, setFilterLastDate] = useState("");

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterSearch,
    filterFirstDate,
    filterLastDate,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterSearch !== '' || filterFirstDate !== "" || filterLastDate !== "";

  const isNotFound =
    (!dataFiltered.length && !!filterSearch) ||
    (!dataFiltered.length && !!filterFirstDate) ||
    (!dataFiltered.length && !!filterLastDate) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterSearch = (event) => {
    setPage(0);
    setFilterSearch(event.target.value);
  };

  const handleFilterFirstDate = (event) => {
    setPage(0);
    setFilterFirstDate(event.target.value);
  };

  const handleFilterLastDate = (event) => {
    setPage(0);
    setFilterLastDate(event.target.value);
  };

  const handleDeleteRow = (id) => {
    testService.deleteTest(id)
      .then(res => {
        // Mise à jour du state pour affichage
        setTableData((current) => current.filter(Test => Test.id !== id))
        setSelected([]);
      })
      .catch(err => console.log(err))
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

  const hanldeShowColumnFilter = () => {
    setIsShowColumnFilter(!isShowColumnFilter)
  }

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.test.testWorkflow(paramCase(id.toString())));
  };

  const handleResetFilter = () => {
    setFilterSearch('');
    setFilterStatus('all');
    setFilterFirstDate("");
    setFilterLastDate("");
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

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Tests List"
          links={[
            { name: 'General' },
            { name: 'Tests List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.test.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Test
            </Button>
          }
        />

        <Stack
          direction="row"
        > 
          <Stack
            direction="column"
            sx={{ maxWidth:'25%'}}
          >
            <Card sx={{ mb: 2, py: 2, mr: 2}}>
              <AnalyticsCount
                title="Total"
                total={seriesKpiTotal}
                percent={100}
                unity={(seriesKpiTotal > 1) ? 'Tests' : 'Test'}
                icon="ic:round-fact-check"
                color={theme.palette.primary.main}
              />
            </Card>
            <StackedBar
              sx={{mr: 2, minHeight: '232px'}}
              title="Segula & Stellantis Approbation"
              chart={{
                labels: ['Segula','Customer'],
                colors: theme.palette.kpi,
                series: [
                  {
                    data: [
                      { name: 'OK', data: [26, 34] },
                      { name: 'NOK', data: [24, 16] },
                    ],
                  },
                ],
              }}
              small={true}
              tickAmount={5}
            />
          </Stack>
          <Bar
            sx={{ mb: 5, minWidth: '78%' }}
            title="Tests Status Distribution"
            chart={{
              colors: theme.palette.kpi,
              categories: seriesKpi.map((option) => { return i18next.t(option.label.replace(' ', '_').toLowerCase())}),
              serie: [
                {
                  data: [
                    { name: '', data: seriesKpi.map((option) => (option.value))},
                  ],
                },
              ],
            }}
            height={270}
          />
        </Stack>

        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab} label={i18next.t(tab.toLowerCase())} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <TestTableToolbar
            isFiltered={isFiltered}
            filterSearch={filterSearch}
            filterFirstDate={filterFirstDate}
            filterLastDate={filterLastDate}
            onfilterSearch={handleFilterSearch}
            onFilterFirstDate={handleFilterFirstDate}
            onFilterLastDate={handleFilterLastDate}
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

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                      <TestTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => { handleEditRow(row.id); console.log("row: " + row.id) }}
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterSearch, filterFirstDate,
  filterLastDate, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterStatus !== 'all') {
    inputData = inputData.filter((test) => test.status === filterStatus);
  }

  if (filterSearch) {
    inputData = inputData.filter(
      (test) =>
        test.id.toString().indexOf(filterSearch) !== -1 ||
        test.lib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        test.referentFullName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        test.referentCustomerFullName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        test.status.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(test.createdAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(test.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
    );
  }

  if (filterFirstDate) {
    inputData = inputData.filter(
      (test) => new Date(test.createdAt) >= new Date(filterFirstDate)
    );
  }

  if (filterLastDate) {
    inputData = inputData.filter(
      (test) => new Date(test.createdAt) <= new Date((new Date(filterLastDate)).valueOf() + 1000 * 3600 * 24)
    );
  }

  return inputData;
}
