import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  useTheme,
  Grid,
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
import { ReferenceTableToolbar, ReferenceTableRow } from '../../../sections/dashboard/reference/list';
import { referenceService } from '../../../_services/reference.service';
import { fDate } from '../../../utils/formatTime';
import { AnalyticsCount, StackedBar } from '../../../sections/general/analytics';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all'];

//list of perimeters
const PERIMETERS = ['All', 'EMAT (ADTH)', 'EMAT (ARO)', 'EMAT (ENGM)', 'EMAT (TMO)', 'FAES (-)', 'FAES (FAES)', 'FAES (SFAD)', 'NVH', 'PAC (APVO)', 'RHME (RHN)', 'SAF', 'VDV (BCEV)', 'VDV (FDV)'];


const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'lib', label: 'Test Designation', align: 'left' },
  { id: 'ref', label: 'Reference', align: 'left' },
  { id: 'perimeter', label: 'Perimeter', align: 'left' },
  { id: 'referentFullName', label: 'Segula Referent', align: 'left' },
  //{ id: 'referentCustomerFullName', label: 'Customer', align: 'left' },
  { id: 'duration', label: 'Segula Duration (days)', align: 'left' },
  { id: 'durationCustomer', label: 'Customer duration (days)', align: 'left' },
  { id: 'resourceLib', label: 'Facility Reference', align: 'left' },
  { id: 'resourceBackupLib', label: 'Facility Backup 1', align: 'left' },
  { id: 'resourceBackupSecLib', label: 'Facility Backup 2', align: 'left' },
  { id: 'ProjDocuments', label: 'Document(s)', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'left' },
  { id: '' },
];

const excelTableHead = ['Id', 'Test Designation', 'Reference', 'Perimeter', 'Segula Referent', 'Segula Duration (days)', 'Customer duration (days)', 'Facility Reference', 'Facility Backup 1','Facility Backup 2', 'Created At', 'Updated At', ' ']
const columnConfig = TABLE_HEAD.reduce((config, column) => {
  config[column.id] = true; // initially show all columns
  return config;
}, {});

const excelFileName = 'Test Repository Data'
// ----------------------------------------------------------------------

export default function ReferenceListPage() {
  const [tableData, setTableData] = useState([]);
  const [seriesKpi, setSeriesKPI] = useState([]);
  const [seriesKpiTotal, setSeriesKPITotal] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false)

  useEffect(() => {
    referenceService.getAllReferences(0, 0, 0, 1).then(
      res => {
        console.log(res.data);
        const _resData = res.data.map(
          ({ id, lib,ref, perimeter, referentFullName,duration,durationCustomer,resourceLib,resourceBackupLib,resourceBackupSecLib,createdAt,updatedAt,ProjDocuments }) => ({ id, lib,ref,perimeter, referentFullName,duration,durationCustomer,resourceLib,resourceBackupLib,resourceBackupSecLib,createdAt:fDate(createdAt),updatedAt:fDate(updatedAt),ProjDocuments }));
        setTableData(_resData);
      }
    ).catch(err => {
      console.log(err);
    })
    //set values for KPIs
    referenceService.getReferencesKPI().then(
      res => {
        let seriesTab = [];
        setSeriesKPITotal(res.data.total);
        res.data.perimeters.forEach(element => {
          seriesTab.push({ label: element.perimeter, value: element.count })
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

  const [filterDuration, setFilterDuration] = useState('');

  const [filterFirstDate, setFilterFirstDate] = useState("");

  const [filterLastDate, setFilterLastDate] = useState("");

  const [filterPerimeter, setFilterPerimeter] = useState('All');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterSearch,
    filterDuration,
    filterFirstDate,
    filterLastDate,
    filterPerimeter,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterSearch !== '' || filterDuration !== '' || filterFirstDate !== "" || filterLastDate !== "" || filterPerimeter !== 'All' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterSearch) ||
    (!dataFiltered.length && !!filterDuration) ||
    (!dataFiltered.length && !!filterFirstDate) ||
    (!dataFiltered.length && !!filterLastDate) ||
    (!dataFiltered.length && !!filterPerimeter) ||
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

  const handleFilterDuration = (event) => {
    setPage(0);
    setFilterDuration(event.target.value);
  };

  const handleFilterFirstDate = (event) => {
    setPage(0);
    setFilterFirstDate(event.target.value);
  };

  const handleFilterLastDate = (event) => {
    setPage(0);
    setFilterLastDate(event.target.value);
  };

  const handleFilterPerimeter = (event) => {
    setPage(0);
    setFilterPerimeter(event.target.value);
  };

  const handleDeleteRow = (id) => {
    referenceService.deleteReference(id)
      .then(res => {
        // Mise à jour du state pour affichage
        setTableData((current) => current.filter(reference => reference.id !== id))
        setSelected([]);
      })
      .catch(err => console.log(err))
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const hanldeShowColumnFilter = () => {
    setIsShowColumnFilter(!isShowColumnFilter)
  }



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
    navigate(PATH_DASHBOARD.reference.edit(paramCase(id.toString())));
  };

  const handleDownloadReference = (docUrl, docOriginalname) => {
    referenceService.downloadReference(docUrl, docOriginalname)
  }

  const handleOpenUrl = (docUrl) => {
    window.open(docUrl, "_blank");
  }

  const handleResetFilter = () => {
    setFilterSearch('');
    setFilterDuration('');
    setFilterFirstDate("");
    setFilterLastDate("");
    setFilterPerimeter('All');
    setFilterStatus('all');
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
          heading="Test repositories List"
          links={[
            { name: 'Management' },
            { name: 'Test repositories List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.reference.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Test repository
            </Button>
          }
        />

        <Stack
          direction="row"
        >
          <Card sx={{ mb: 5, py: 2, mr: 2, minWidth: '20%', maxHeight: '90px' }}>
            <AnalyticsCount
              title="Total"
              total={seriesKpiTotal}
              percent={100}
              unity={(seriesKpiTotal > 1) ? 'Test repositories' : 'Test repository'}
              icon="mdi:git-repository"
              color={theme.palette.primary.main}
            />
          </Card>
          <Grid sx={{ mb: 5, minWidth: '79%' }}>
            <StackedBar
              title="Report templates and Procedures Status Distribution"
              chart={{
                labels: ['Reports Templates','Procedures'],
                colors: theme.palette.kpi,
                series: [
                  {
                    data: [
                      { name: 'Existing', data: [20, 34] },
                      { name: 'Pending', data: [10, 34] },
                      { name: 'Exempt', data: [10, 14] }
                    ],
                  },
                ],
              }}
            />
          </Grid>
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
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <ReferenceTableToolbar
            isFiltered={isFiltered}
            filterSearch={filterSearch}
            filterDuration={filterDuration}
            filterFirstDate={filterFirstDate}
            filterLastDate={filterLastDate}
            optionsPerimeter={PERIMETERS}
            filterPerimeter={filterPerimeter}
            onfilterSearch={handleFilterSearch}
            onFilterDuration={handleFilterDuration}
            onFilterFirstDate={handleFilterFirstDate}
            onFilterLastDate={handleFilterLastDate}
            onFilterPerimeter={handleFilterPerimeter}
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
                      <ReferenceTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => { handleEditRow(row.id); console.log("row: " + row.id) }}
                        onDownloadReference={() => handleDownloadReference(row.docUrl, row.docOriginalname)}
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

function applyFilter({ inputData, comparator, filterSearch, filterDuration, filterFirstDate,
  filterLastDate, filterPerimeter }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterSearch) {
    inputData = inputData.filter(
      (reference) => {
        let resourceBackupLib = (reference.resourceBackupLib) ? reference.resourceBackupLib : '';
        let resourceBackupSecLib = (reference.resourceBackupSecLib) ? reference.resourceBackupSecLib : '';
        return reference.id.toString().indexOf(filterSearch) !== -1 ||
          reference.lib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          reference.ref.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          reference.duration.toString().indexOf(filterSearch) !== -1 ||
          reference.durationCustomer.toString().indexOf(filterSearch) !== -1 ||
          reference.referentFullName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          reference.referentCustomerFullName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          reference.resourceLib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          resourceBackupLib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          resourceBackupSecLib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          reference.perimeter.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          fDate(reference.createdAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          fDate(reference.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
      }
    );
  }

  if (filterPerimeter !== 'All') {
    inputData = inputData.filter((reference) => reference.perimeter === filterPerimeter);
  }

  if (filterDuration) {
    inputData = inputData.filter((reference) => reference.duration.toString().indexOf(filterDuration) !== -1);
  }

  if (filterFirstDate) {
    inputData = inputData.filter(
      (reference) => new Date(reference.createdAt) >= new Date(filterFirstDate)
    );
  }

  if (filterLastDate) {
    inputData = inputData.filter(
      (reference) => new Date(reference.createdAt) <= new Date((new Date(filterLastDate)).valueOf() + 1000 * 3600 * 24)
    );
  }

  return inputData;
}
