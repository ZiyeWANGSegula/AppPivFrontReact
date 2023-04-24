import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, InputAdornment } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from '../../../components/hook-form';
// axios services
import { referenceService } from '../../../_services/reference.service';
import { userService } from '../../../_services/user.service';
import { resourceService } from '../../../_services/resource.service';
import { FileUpload } from '../file';
import Iconify from '../../../components/iconify/Iconify';
import TextURLUploader from '../file/portal/TextURLUploader';
import FileNewFolderDialog from '../file/portal/FileNewFolderDialog';
import i18next from 'i18next';
import EntityDocumentList from '../../general/documents/testWorkflowDocumentTabPanel/EntityDocumentList';
import EntityTextURLUploader from '../file/portal/EntityTextURLUploader';

// ----------------------------------------------------------------------

ReferenceNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentReference: PropTypes.object,
};

export default function ReferenceNewEditForm({ isEdit = false, currentReference, onDeleteDocument }) {
  //list of perimeters
  const perimeters = ['EMAT (ADTH)', 'EMAT (ARO)', 'EMAT (ENGM)', 'EMAT (TMO)', 'FAES (-)', 'FAES (FAES)', 'FAES (SFAD)', 'NVH', 'PAC (APVO)', 'RHME (RHN)', 'SAF', 'VDV (BCEV)', 'VDV (FDV)'];

  const [referentUsers, setReferentUsers] = useState([]);
  const [referentCustomerUsers, setReferentCustomerUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [resources1, setResources1] = useState([]);
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [uploaderResponse, setUploaderResponse] = useState(null);
  const [deletedUploadFile, setDeletedUploadFile] = useState(false);
  const [libApiError, setLibApiError] = useState(null);
  const [openUploadURL, setOpenUploadURL] = useState(null)
  const [documentsToAdd, setDocumentsToAdd] = useState([]);
  const [documentsToShow, setDocumentsToShow] = useState([]);

  console.log('currentReference')
  console.log(currentReference)
  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
    console.log('openUploadFile' + openUploadFile);
  };

  const handleOpenUploadURL = () => {
    setOpenUploadURL(true);
    console.log('setOpenUploadURL' + openUploadURL);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  }

  const handleDeletedUploadFile = (isDeleted) => {
    console.log("Deleting");
    setDeletedUploadFile(isDeleted);
  }

  const handleCloseUploadURL = () => {
    setOpenUploadURL(false);

  }

  const handleSetUploaderInfo = (data, callback) => {
    const uploaderInfo = {
      documentsToAdd: data
    }
    setDocumentsToAdd(uploaderInfo)
    if (isEdit) {
      console.log("currentReference.id " + currentReference.id)
      uploaderInfo.id = currentReference.id
      referenceService.updateReference(uploaderInfo).then(() => {

        enqueueSnackbar('Documents updated');
        handleCloseUploadURL()
        navigate(PATH_DASHBOARD.reference.list)

      }

      ).catch(err => console.error(err))
    } else {
      handleCloseUploadURL()
    }
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewReferenceSchema = Yup.object().shape({
    lib: Yup.string().required('Name is required.'),
    ref: Yup.string().required('Reference is required.'),
    duration: Yup.number().required('Duration is required'),
    durationCustomer: Yup.number().required('Costomer Duration is required'),
    referentId: Yup.number().required('Referent ID is required'),
    resourceId: Yup.number().required('Facility ID is required'),
    resourceBackup: Yup.number(),
    resourceBackupSec: Yup.number(),
    referentCustomerId: Yup.number().required('Customer ID is required'),
    perimeter: Yup.string().required('Perimeter is required.'),

  });

  const defaultValues = useMemo(
    () => ({
      lib: currentReference?.lib || '',
      ref: currentReference?.ref || '',
      duration: currentReference?.duration || '',
      durationCustomer: currentReference?.durationCustomer || '',
      referentId: currentReference?.referentId || '',
      resourceId: currentReference?.resourceId || '',
      resourceBackup: currentReference?.resourceBackup || '',
      resourceBackupSec: currentReference?.resourceBackupSec || '',
      referentCustomerId: currentReference?.referentCustomerId || '',
      perimeter: currentReference?.perimeter || '',

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentReference]
  );

  const methods = useForm({
    resolver: yupResolver(NewReferenceSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  useEffect(() => {
    console.log('currentReferenceinUseEffect')
    console.log(currentReference)
    userService.getAllUsersByNotCat('CUSTOMER').then((res) => { setReferentUsers(res.data); }).catch(err => { console.log(err); })
    userService.getAllUsersByCat('CUSTOMER').then((res) => { setReferentCustomerUsers(res.data); }).catch(err => { console.log(err); })
    resourceService.getAllResources().then((res) => { setResources(res.data); setResources1(res.data) }).catch(err => { console.log(err) });

    if (isEdit && currentReference) {
      setDocumentsToShow(currentReference.ProjDocuments)
      reset(defaultValues);
    }
    if (!isEdit) {
      // getUsers()
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentReference]);

  const onSubmit = async (data) => {
    console.log(data);
    setLibApiError(null);
    try {
      if (isEdit && currentReference) {
        //updata method needs user id
        data.id = currentReference.id;
        var newData = { ...data, ...documentsToAdd }
        console.log('newData')
        console.log(newData)
        referenceService.updateReference(newData)
          .then(res => {
            navigate(PATH_DASHBOARD.reference.list)
            enqueueSnackbar('Reference updated successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if (err.response.data.errors[0].key == "lib") {
              setLibApiError(i18next.t(err.response.data.errors[0].code));
            }
          });
      }
      if (!isEdit) {
        console.log('Please select')
        var newData = { ...data, ...documentsToAdd }
        console.log('newData')
        console.log(newData)
        referenceService.addReference(newData)
          .then(res => {
            navigate(PATH_DASHBOARD.reference.list)
            enqueueSnackbar('Reference added successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if (err.response.data.errors[0].key == "lib") {
              setLibApiError(i18next.t(err.response.data.errors[0].code));
            }
          });
      }
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} >

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="lib" label="Test Designation" helperText={libApiError} errorBack={libApiError || null} />
                <RHFTextField name="ref" label="Reference" />
                <RHFAutocomplete
                  name="perimeter"
                  label={"Perimeter"}
                  options={perimeters}
                />
                <Grid item xs={12} sm={6}>
                  {/* Add the placeholder div */}
                  <div></div>
                </Grid>
                <RHFAutocomplete
                  name="referentId"
                  label={"Segula Referent"}
                  shouldGetId={true}
                  options={referentUsers.map(opt => ({ label: opt.firstName + ' ' + opt.lastName, value: opt.id }))}
                  getOptionLabel={(option) => (option.label) ? option.label : ''}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFAutocomplete
                  name="referentCustomerId"
                  label={"Customer Referent"}
                  shouldGetId={true}
                  options={referentCustomerUsers.map(opt => ({ label: opt.firstName + ' ' + opt.lastName, value: opt.id }))}
                  getOptionLabel={(option) => (option.label) ? option.label : ''}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFTextField
                  name="duration"
                  label="Segula Duration"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          days
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />
                <RHFTextField
                  name="durationCustomer"
                  label="Customer Duration"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          days
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />
                <RHFAutocomplete
                  name="resourceId"
                  label={"Facility Reference"}
                  shouldGetId={true}
                  options={resources.map(opt => ({ label: opt.lib, value: opt.id }))}
                  getOptionLabel={(option) => (option.label) ? option.label : ''}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <Grid item xs={12} sm={6}>
                  {/* Add the placeholder div */}
                  <div></div>
                </Grid>
                <RHFAutocomplete
                  name="resourceBackup"
                  label={"Facility Backup 1"}
                  shouldGetId={true}
                  options={resources.map(opt => ({ label: opt.lib, value: opt.id }))}
                  getOptionLabel={(option) => (option.label) ? option.label : ''}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFAutocomplete
                  name="resourceBackupSec"
                  label={"Facility Backup 2"}
                  shouldGetId={true}
                  options={resources.map(opt => ({ label: opt.lib, value: opt.id }))}
                  getOptionLabel={(option) => (option.label) ? option.label : ''}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: '44% 3% 44%',
                  }}
                >
                  <Button sx={{ marginLeft: 2, marginBottom: 2 }}
                    variant="contained"
                    startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                    onClick={handleOpenUploadFile}
                  >
                    Upload
                  </Button>
                  <p>Or</p>
                  <Button sx={{ marginLeft: 2, marginBottom: 2 }}
                    variant="contained"
                    startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                    onClick={handleOpenUploadURL}
                  >
                    URL
                  </Button>
                 </Box> 

            </Box>
            {documentsToShow.length != 0 && <EntityDocumentList isEdit={isEdit} documents={documentsToShow} fullWith onDeleteDocument={onDeleteDocument}></EntityDocumentList>}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Box
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'auto auto',
                }}
              >
                <Link to='/dashboard/reference/list' style={{ textDecoration: 'none' }}><Button variant="contained">Cancel</Button></Link>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Test repository' : 'Save Changes'}
                </LoadingButton>
              </Box>
            </Stack>

          </Card>

        </Grid>
        <FileNewFolderDialog open={openUploadFile} onCreate={console.log('new onCreate')} onClose={handleCloseUploadFile} entity='reference' setUploaderInfo={handleSetUploaderInfo} />
        <EntityTextURLUploader isEdit={isEdit} open={openUploadURL} onClose={handleCloseUploadURL} onSetUploadInfo={handleSetUploaderInfo} onUpload />
      </Grid>
    </FormProvider>
  );
}
