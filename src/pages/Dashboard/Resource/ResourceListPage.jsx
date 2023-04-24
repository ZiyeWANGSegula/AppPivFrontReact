import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { resourceService } from "../../../_services/resource.service";
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
import { ResourceTableToolbar, ResourceTableRow } from '../../../sections/dashboard/resource/list';
import { fDate } from '../../../utils/formatTime';
import i18next from 'i18next';
import { AnalyticsCount, Bar } from '../../../sections/general/analytics';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all'];

const PLACE_OPTIONS = [
  'ALL',
  'TRP',
  'LFV',
  'BLP',
  'OTHER'
];

const REAL_PLACE_OPTIONS = [
  'TRP',
  'LFV',
  'BLP',
  'OTHER'
];

const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'lib', label: 'Label', align: 'left' },
  { id: 'ref', label: 'Facility Reference', align: 'left' },
  { id: 'place', label: 'Place', align: 'left' },
  { id: 'building', label: 'Building Number', align: 'left' },
  { id: 'ProjDocuments', label: 'Document(s)', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'left' },
  { id: '' },
];

const excelTableHead = ['Id', 'Label', 'Facility Reference', 'Place', 'Building', 'Created At', 'Updated At',' ']
const columnConfig = TABLE_HEAD.reduce((config, column) => {
  config[column.id] = true; // initially show all columns
  return config;
}, {});

const excelFileName = 'Facility Data'

// ----------------------------------------------------------------------

export default function ResourceListPage() {
  const [tableData, setTableData] = useState([]);
  const [resources, setResources] = useState([]);
  const { presetsOption } = useSettingsContext();
  const [seriesKpiTotal, setSeriesKPITotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false)

  useEffect(() => {
    resourceService.getAllResources().then(
      res => {
        console.log(res.data);
        const _resData = res.data.map(({ id, lib,ref, place,building,createdAt,updatedAt,ProjDocuments }) => ({ id, lib,ref, place:i18next.t(place.toLowerCase()),building,createdAt:fDate(createdAt),updatedAt:fDate(updatedAt),ProjDocuments }));
        setTableData(_resData);
      }
    ).catch(err => {
      console.log(err);
    })
    //set values for KPIs
    resourceService.getResourcesKPI().then(
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

  const [filterPlace, setFilterPlace] = useState('ALL');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterFirstDate, setFilterFirstDate] = useState("");

  const [filterLastDate, setFilterLastDate] = useState("");

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterSearch,
    filterPlace,
    filterFirstDate,
    filterLastDate,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterSearch !== '' || filterFirstDate !== "" || filterLastDate !== "" || filterPlace !== 'ALL' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterSearch) ||
    (!dataFiltered.length && !!filterPlace) ||
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

  const handleFilterPlace = (event) => {
    setPage(0);
    setFilterPlace(event.target.value);
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
    resourceService.deleteResource(id)
      .then(res => {
        // Mise à jour du state pour affichage
        setTableData((current) => current.filter(resource => resource.id !== id))
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
    navigate(PATH_DASHBOARD.resource.edit(paramCase(id.toString())));
  };

  const handleDownloadResource = (docUrl, docOriginalname) => {
    resourceService.downloadResource(docUrl, docOriginalname)
  }

  const handleOpenUrl = (docUrl) => {
    window.open(docUrl, "_blank");
  }

  const handleResetFilter = () => {
    setFilterSearch('');
    setFilterPlace('ALL');
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
          heading="Facilities List"
          links={[
            { name: 'Management' },
            { name: 'Facilities List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.resource.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Facility
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
                unity={(seriesKpiTotal > 1) ? 'Facilities' : 'Facility'}
                icon="ic:sharp-car-repair"
                color={theme.palette.primary.main}
              />
          </Card>

          <Bar
            sx={{ mb: 5, minWidth: '78%' }}
            title="Places Distribution"
            chart={{
              colors: theme.palette.kpi,
              categories: REAL_PLACE_OPTIONS.map((option) => { return i18next.t(option.toLowerCase())}),
              serie: [
                {
                  data: [
                    { name: '', data: [41, 35, 151, 49] },
                  ],
                },
              ],
            }}
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
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <ResourceTableToolbar
            isFiltered={isFiltered}
            filterSearch={filterSearch}
            filterPlace={filterPlace}
            optionsPlace={PLACE_OPTIONS}
            filterFirstDate={filterFirstDate}
            filterLastDate={filterLastDate}
            onfilterSearch={handleFilterSearch}
            onFilterPlace={handleFilterPlace}
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
                      <ResourceTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => { handleEditRow(row.id); console.log("row: " + row.id) }}
                        onDownloadResource={() => handleDownloadResource(row.docUrl, row.docOriginalname)}
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

function applyFilter({ inputData, comparator, filterSearch, filterPlace, filterFirstDate,
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
      (resource) => {
        let ref = (resource.ref) ? resource.ref : '';
        let building = (resource.building) ? resource.building : '';
        return resource.id.toString().indexOf(filterSearch) !== -1 ||
          resource.lib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          ref.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          resource.place.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          building.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          fDate(resource.createdAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
          fDate(resource.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
      });
  }

  if (filterPlace !== 'ALL') {
    inputData = inputData.filter((resource) => resource.place === filterPlace);
  }

  if (filterFirstDate) {
    inputData = inputData.filter(
      (resource) => new Date(resource.createdAt) >= new Date(filterFirstDate)
    );
  }

  if (filterLastDate) {
    inputData = inputData.filter(
      (resource) => new Date(resource.createdAt) <= new Date((new Date(filterLastDate)).valueOf() + 1000 * 3600 * 24)
    );
  }

  return inputData;
}
