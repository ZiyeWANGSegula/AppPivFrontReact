import { Helmet } from 'react-helmet-async';
import sumBy from 'lodash/sumBy';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { userService } from "../../../_services/user.service";
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
  Grid,
  useTheme,
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
import { UserTableToolbar, UserTableRow } from '../../../sections/dashboard/user/list';
import { fDate } from '../../../utils/formatTime';
import { AppCurrentDownload } from '../../../sections/general/app';
import i18next from 'i18next';
import { Stack } from '@mui/system';
import { AnalyticsCount } from '../../../sections/general/analytics';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all'];

const ROLE_OPTIONS = [
  'ALL',
  'ADMIN',
  'CUSTOMER',
  'MANAGER',
  'USER'
];

const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'cat', label: 'Category', align: 'left' },
  { id: 'firstName', label: 'First name', align: 'left' },
  { id: 'lastName', label: 'Last name', align: 'left' },
  { id: 'username', label: 'Username', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'left' },
  { id: '' },
];

const excelTableHead = ['Id', 'Category', 'First name', 'Last name', 'Username', 'Email', 'Created At', 'Updated At', ' ']
const columnConfig = TABLE_HEAD.reduce((config, column) => {
  config[column.id] = true; // initially show all columns
  return config;
}, {});

const excelFileName = 'User Data'

let cat = "ADMIN";

switch(cat) {
  case "ADMIN":
    console.log("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_11.jpg");
    break;
  case "CUSTOMER":
    console.log("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_18.jpg");
    break;
  case "MANAGER":
    console.log("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_23.jpg");
    break;
  case "USER":
    console.log("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_24.jpg");
    break;
  default:
    console.log("Invalid cat value");
}

// ----------------------------------------------------------------------

export default function UserListPage() {
  const {presetsOption } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [seriesKpi, setSeriesKPI] = useState([]);
  const [seriesKpiTotal, setSeriesKPITotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  const handleSwitchAvatarUrl = (cat)=> {
    console.log('cat :' + cat)
    switch(cat) {
      case "ADMIN":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_11.jpg");
        break;
      case "CUSTOMER":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_18.jpg");
        break;
      case "MANAGER":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_23.jpg");
        break;
      case "USER":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_24.jpg");
        break;
      default:
        return("");
    }
    
  }
 

  useEffect(() => {
    userService.getAllUsers().then(
        res => {
            console.log('res cat');
            console.log(res.data)
            console.log(res.data.cat)
            handleSwitchAvatarUrl(res.data.cat)
            const _resData = res.data.map(
              ({ id, cat,firstName, lastName, username,email,createdAt,updatedAt,avatarUrl }) => ({ id, cat:i18next.t(cat.toLowerCase()),firstName, lastName, username,email,createdAt:fDate(createdAt),updatedAt:fDate(updatedAt),avatarUrl:handleSwitchAvatarUrl(cat)}));
            setTableData(_resData);
            const excelData = _resData.map(obj => {
              const { [Object.keys(obj).pop()]: prop, ...rest } = obj;
              return rest;
            });
            setExportData(excelData)
        }
    ).catch(err => {
        console.log(err);
    })
    //set values for KPIs
    userService.getUsersKPI().then(
      res => {
        let seriesTab = [];
        setSeriesKPITotal(res.data.total);
        res.data.cats.forEach(element => {
          seriesTab.push({label: i18next.t(element.cat.toLowerCase()), value: element.count})
        });
        setSeriesKPI(seriesTab);
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

  const [filterRole, setFilterRole] = useState('ALL');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterFirstDate, setFilterFirstDate] = useState("");

  const [filterLastDate, setFilterLastDate] = useState("");

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterSearch,
    filterRole,
    filterFirstDate,
    filterLastDate,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterSearch !== '' || filterFirstDate !== "" || filterLastDate !== "" || filterRole !== 'ALL' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterSearch) ||
    (!dataFiltered.length && !!filterRole) ||
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

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
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
    userService.deleteUser(id)
        .then(res => {
            // Mise à jour du state pour affichage
            setTableData((current) => current.filter(user => user.id !== id))
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

  const hanldeShowColumnFilter = () =>{
    setIsShowColumnFilter(!isShowColumnFilter)
  }

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id.toString())));
  };

  const handleResetFilter = () => {
    setFilterSearch('');
    setFilterRole('ALL');
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
          heading="Users List"
          links={[
            { name: 'Settings'},
            { name: 'Users List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New User
            </Button>
          }
        />

        
        {/*<Grid item maxWidth={'25%'} >
          <AppCurrentDownload
            title="Category Repartition"
            chart={{
              colors: [
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.error.main,
                theme.palette.warning.main,
              ],
              series: seriesKpi,
            }}
          />
        </Grid>
        <br/>*/}

        <Stack
          direction="row"
        >
          <Card sx={{ mb: 5, py: 2, mr: 2, minWidth:'20%' }}>
            <AnalyticsCount
              title="Total"
              total={seriesKpiTotal}
              percent={100}
              unity={(seriesKpiTotal>1)?'Users':'User'}
              icon="ic:round-people-alt"
              color={theme.palette.kpi[0]} 
            />
          </Card>
          <Card sx={{ mb: 5, minWidth:'78%' }}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                {seriesKpi.map((serie, index) => {
                  //define avatar
                  let srcAvatar = '';
                  if(serie.label == 'Administrator'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_11.jpg";
                  } else if(serie.label == 'Customer'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_18.jpg";
                  } else if(serie.label == 'Manager'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_23.jpg";
                  } else if(serie.label == 'User'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_24.jpg";
                  }

                  let colors=theme.palette.kpi;
                  return (<AnalyticsCount
                    title={serie.label}
                    total={(serie.value!='')?serie.value:'0'}
                    percent={(serie.value/seriesKpiTotal)*100}
                    unity={(serie.value!='' && serie.value!='1')?'Users':'User'}
                    avatar={srcAvatar}
                    color={colors[index+1]}
                  />)
                })}
        
              </Stack>
          </Card>
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

          <UserTableToolbar
            isFiltered={isFiltered}
            filterSearch={filterSearch}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
            filterFirstDate={filterFirstDate}
            filterLastDate={filterLastDate}
            onfilterSearch={handleFilterSearch}
            onFilterRole={handleFilterRole}
            onFilterFirstDate={handleFilterFirstDate}
            onFilterLastDate={handleFilterLastDate}
            onResetFilter={handleResetFilter}
          />
          <ExportToExcel apiData={exportData} fileName={excelFileName} tableHead={excelTableHead}></ExportToExcel>
          <IconButton onClick={hanldeShowColumnFilter}><Iconify icon="material-symbols:filter-list" ></Iconify></IconButton>
          {isShowColumnFilter&&<div>
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
                  headLabel={TABLE_HEAD.filter((column)=>columnVisibility[column.id])}
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => {handleEditRow(row.id); console.log("row: " + row.id)}}
                        selectedColumns={columnVisibility}
                        avatarUrl={avatarUrl}
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

function applyFilter({ inputData, comparator, filterSearch, filterRole, filterFirstDate,
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
      (user) => {
        let email = (user.email)?user.email:'';
        return user.id.toString().indexOf(filterSearch) !== -1 ||
        user.cat.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        user.firstName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        email.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(user.createdAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(user.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
      }
    );
  }

  if (filterRole !== 'ALL') {
    inputData = inputData.filter((user) => user.cat === filterRole);
  }

  if(filterFirstDate) {
    inputData = inputData.filter(
      (user) => new Date(user.createdAt) >= new Date(filterFirstDate)
    );
  }

  if(filterLastDate) {
    inputData = inputData.filter(
      (user) => new Date(user.createdAt) <= new Date((new Date(filterLastDate)).valueOf() + 1000*3600*24)
    );
  }

  return inputData;
}
