import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { vehicleService } from "../../../_services/vehicle.service";
// import { ExcelFile, ExcelSheet, ExcelColumn } from 'react-excel-export';
import { ExportToExcel } from '../../../utils/ExportToExcel';
import filterColumnDialog from '../../../utils/filterColumnDialog';
import * as XLSX from "xlsx";
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
  useTheme,
  Stack,
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
import { VehicleTableToolbar, VehicleTableRow } from '../../../sections/dashboard/vehicle/list';
import { fDate } from '../../../utils/formatTime';
import { AnalyticsCount } from '../../../sections/general/analytics';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all'];
const getData = () => [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'Bob', age: 40 },
];

const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'lib', label: 'Countermark', align: 'left' },
  { id: 'program', label: 'Program', align: 'left' },
  { id: 'silhouette', label: 'Silhouette', align: 'left' },
  { id: 'stage', label: 'Stage', align: 'left' },
  { id: 'engine', label: 'Engine', align: 'left' },
  { id: 'finishing', label: 'Finishing', align: 'left' },
  { id: 'ProjDocuments', label: 'Document(s)', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'left' },
  { id: '' },
];

const excelTableHead = ['Id', 'Countermark', 'Program', 'Stage', 'Silhouette', 'Engine', 'Finishing', 'Created At', 'Updated At', '']
const columnConfig = TABLE_HEAD.reduce((config, column) => {
  config[column.id] = true; // initially show all columns
  return config;
}, {});

const excelFileName = 'Vehicle Data'
// ----------------------------------------------------------------------

export default function VehicleListPage() {
  const [tableData, setTableData] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const { presetsOption } = useSettingsContext();
  const [seriesKpiTotal, setSeriesKPITotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false)
  const [excelData, setExcelData] = useState([])

  useEffect(() => {
    vehicleService.getAllVehicles().then(
      res => {
        console.log(res);
        const _resData = res.data.map(({ id, lib, program, silhouette, stage, engine, finishing, createdAt, updatedAt, ProjDocuments }) => ({ id, lib, program, silhouette, stage, engine, finishing, createdAt: fDate(createdAt), updatedAt: fDate(updatedAt), ProjDocuments }));

        setTableData(_resData);
      }
    ).catch(err => {
      console.log(err);
    })
    //set values for KPIs
    vehicleService.getVehiclesKPI().then(
      res => {
        setSeriesKPITotal(res.data.total);
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

  const isFiltered = filterSearch !== '' || filterFirstDate !== "" || filterLastDate !== "" || filterStatus !== 'all';

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
    vehicleService.deleteVehicle(id)
      .then(res => {
        // Mise à jour du state pour affichage
        setTableData((current) => current.filter(vehicle => vehicle.id !== id))
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
    navigate(PATH_DASHBOARD.vehicle.edit(paramCase(id.toString())));
  };

  const handleDownloadVehicle = (docUrl, docOriginalname) => {
    vehicleService.downloadVehicle(docUrl, docOriginalname)
  }

  const handleOpenUrl = (docUrl) => {
    window.open(docUrl, "_blank");
  }

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
          heading="Vehicles List"
          links={[
            { name: 'Management', },
            { name: 'Vehicles List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.vehicle.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Vehicle
            </Button>

          }
        />

        <Card sx={{ mb: 5, maxWidth: '20%' }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <AnalyticsCount
              title="Total"
              total={seriesKpiTotal}
              percent={100}
              unity={(seriesKpiTotal > 1) ? 'Vehicles' : 'Vehicle'}
              icon="ic:baseline-directions-car-filled"
              color={theme.palette.primary.main}
            />
          </Stack>
        </Card>


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
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <VehicleTableToolbar
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
                      <VehicleTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => { handleEditRow(row.id); console.log("row: " + row.id) }}
                        onDownloadVehicle={() => handleDownloadVehicle(row.docUrl, row.docOriginalname)}
                        onOpenLink={() => handleOpenUrl(row.docUrl)}
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
  filterLastDate }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterSearch) {
    inputData = inputData.filter(
      (vehicle) => {
        let finishing = (vehicle.finishing) ? vehicle.finishing : '';
        return vehicle.id.toString().indexOf(filterSearch) !== -1 ||
          vehicle.lib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          vehicle.program.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          vehicle.stage.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          vehicle.silhouette.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          vehicle.engine.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          finishing.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          fDate(vehicle.createdAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          fDate(vehicle.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
      }
    );
  }

  if (filterFirstDate) {
    inputData = inputData.filter(
      (vehicle) => new Date(vehicle.createdAt) >= new Date(filterFirstDate)
    );
  }

  if (filterLastDate) {
    inputData = inputData.filter(
      (vehicle) => new Date(vehicle.createdAt) <= new Date((new Date(filterLastDate)).valueOf() + 1000 * 3600 * 24)
    );
  }

  return inputData;
}
