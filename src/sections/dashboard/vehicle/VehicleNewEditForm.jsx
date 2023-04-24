import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button } from '@mui/material';
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
// vehicle services
import { vehicleService } from '../../../_services/vehicle.service';
import Iconify from '../../../components/iconify/Iconify';
import { FileUpload } from '../file';
import TextURLUploader from '../file/portal/TextURLUploader';
import FileNewFolderDialog from '../file/portal/FileNewFolderDialog';
import i18next from 'i18next';
import EntityDocumentList from '../../general/documents/testWorkflowDocumentTabPanel/EntityDocumentList';
import EntityTextURLUploader from '../file/portal/EntityTextURLUploader';


// ----------------------------------------------------------------------

VehicleNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentVehicle: PropTypes.object,
};

export default function VehicleNewEditForm({ isEdit = false, currentVehicle, onDeleteDocument }) {
  //console.log("current " + currentVehicle);
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [uploaderResponse, setUploaderResponse] = useState(null);
  const [deletedUploadFile, setDeletedUploadFile] = useState(false);
  const [libApiError, setLibApiError] = useState(null);
  const [vehiclesEnginesOptions, setVehiclesEnginesOptions] = useState([]);
  const [openUploadURL, setOpenUploadURL] = useState(null)
  const [documentsToAdd, setDocumentsToAdd] = useState([]);
  const [documentsToShow, setDocumentsToShow] = useState([]);

  const navigate = useNavigate();

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

  const handleCloseUploadURL = () => {
    setOpenUploadURL(false);

  }

  const handleSetUploaderInfo = (data, callback) => {
    const uploaderInfo = {
      documentsToAdd: data
    }
    setDocumentsToAdd(uploaderInfo)
    if (isEdit) {
      console.log("currentvehicle.id " + currentVehicle.id)
      uploaderInfo.id = currentVehicle.id
      vehicleService.updateVehicle(uploaderInfo).then(() => {

        enqueueSnackbar('Documents updated');
        handleCloseUploadURL()
        navigate(PATH_DASHBOARD.vehicle.list)

      }

      ).catch(err => console.error(err))
    } else {
      handleCloseUploadURL()
    }
  }

  const handleDeletedUploadFile = (isDeleted) => {
    console.log("Deleting");
    setDeletedUploadFile(isDeleted);
  }

  const { enqueueSnackbar } = useSnackbar();

  const NewVehicleSchema = Yup.object().shape({
    lib: Yup.string().required('Vehicle model is required'),
    program: Yup.string().required('Vehicule program is required'),
    stage: Yup.string().required('Vehicle stage is required'),
    silhouette: Yup.string().required('Vehicle silhouette is required'),
    engine: Yup.string().required('Vehicle engine is required'),
    finishing: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      lib: currentVehicle?.lib || '',
      program: currentVehicle?.program || '',
      stage: currentVehicle?.stage || '',
      silhouette: currentVehicle?.silhouette || '',
      engine: currentVehicle?.engine || '',
      finishing: currentVehicle?.finishing || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentVehicle]
  );

  const methods = useForm({
    resolver: yupResolver(NewVehicleSchema),
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

  const values = watch();

  useEffect(() => {
    //get the vehicles engines
    vehicleService.getVehiclesEngines().then(
      res => {
        setVehiclesEnginesOptions(res.data);
      }
    ).catch(err => {
      console.log(err);
    })

    if (isEdit && currentVehicle) {
      setDocumentsToShow(currentVehicle.ProjDocuments)

      reset(defaultValues);
    }
    if (!isEdit) {

      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentVehicle]);

  const onSubmit = async (data) => {
    console.log("car data: " + data);
    setLibApiError(null);

    try {
      if (isEdit && currentVehicle) {
        //updata method needs vehicle id
        data.id = currentVehicle.id;
        var newData = { ...data, ...documentsToAdd }
        vehicleService.updateVehicle(newData)
          .then(res => {
            navigate(PATH_DASHBOARD.vehicle.list)
            enqueueSnackbar('Vehicle updated successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if (err.response.data.errors[0].key == "lib") {
              setLibApiError(i18next.t(err.response.data.errors[0].code));
            }
          });
      }
      if (!isEdit) {
        console.log("car data: " + data);
        var newData = { ...data, ...documentsToAdd }
        vehicleService.addVehicle(newData)
          .then(res => {
            navigate(PATH_DASHBOARD.vehicle.list)
            enqueueSnackbar('Vehicle added successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if (err.response.data.errors[0].key == "lib") {
              setLibApiError(i18next.t(err.response.data.errors[0].code));
            }
          });

      }
      console.log('DAcarTA', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>

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
              <RHFTextField name="lib" label="Countermark" helperText={libApiError} errorBack={libApiError || null}/>
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFTextField name="program" label="Program" />
              <RHFTextField name="silhouette" label="Silhouette" />
              <RHFTextField name="stage" label="Stage" />
              <RHFAutocomplete
                name="engine"
                label={"Engine"}
                options={vehiclesEnginesOptions}
              />
              <RHFTextField name="finishing" label="Finishing" />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>

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
                <Link to='/dashboard/vehicle/list' style={{ textDecoration: 'none' }}><Button variant="contained">Cancel</Button></Link>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Vehicle' : 'Save Changes'}
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <FileNewFolderDialog open={openUploadFile} onCreate={console.log('new onCreate')} onClose={handleCloseUploadFile} entity='vehicle' setUploaderInfo={handleSetUploaderInfo} />
      <EntityTextURLUploader isEdit={isEdit} open={openUploadURL} onClose={handleCloseUploadURL} onSetUploadInfo={handleSetUploaderInfo} onUpload />
    </FormProvider>
  );
}
