import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, Autocomplete, TextField } from '@mui/material';
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
// resource services
import { resourceService } from '../../../_services/resource.service';
import Iconify from '../../../components/iconify/Iconify';
import TextURLUploader from '../file/portal/TextURLUploader';
import FileNewFolderDialog from '../file/portal/FileNewFolderDialog';
import i18next from 'i18next';
import EntityDocumentList from '../../general/documents/testWorkflowDocumentTabPanel/EntityDocumentList';
import EntityTextURLUploader from '../file/portal/EntityTextURLUploader';

import { FileUpload } from '../file';

// ----------------------------------------------------------------------

ResourceNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentResource: PropTypes.object,
};

export default function ResourceNewEditForm({ isEdit = false, currentResource, onDeleteDocument }) {
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [uploaderResponse, setUploaderResponse] = useState(null);
  const [deletedUploadFile, setDeletedUploadFile] = useState(false);
  const [libApiError, setLibApiError] = useState(null);
  const placeOptions = ["BLP", "LFV", "TRP", "OTHER"];
  const optionsMovies = ['The Godfather', 'Pulp Fiction'];
  const [openUploadURL, setOpenUploadURL] = useState(null)
  const [documentsToAdd, setDocumentsToAdd] = useState([]);
  const [documentsToShow, setDocumentsToShow] = useState([]);

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

      uploaderInfo.id = currentResource.id
      resourceService.updateResource(uploaderInfo).then(() => {

        enqueueSnackbar('Documents updated');
        handleCloseUploadURL()
        navigate(PATH_DASHBOARD.resource.list)

      }

      ).catch(err => console.error(err))
    } else {
      handleCloseUploadURL()
    }
  }



  const getOpObj = option => {
    if (!option._id) option = options.find(op => op._id === option);
    return option;
  };

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewResourceSchema = Yup.object().shape({
    lib: Yup.string().required('Label is required'),
    ref: Yup.string(),
    place: Yup.string().required('Place is required'),
    building: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      lib: currentResource?.lib || '',
      ref: currentResource?.ref || '',
      place: currentResource?.place || '',
      building: currentResource?.building || '',
    }),
    [currentResource]
  );

  const methods = useForm({
    resolver: yupResolver(NewResourceSchema),
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
    if (isEdit && currentResource) {
      setDocumentsToShow(currentResource.ProjDocuments)

      reset(defaultValues);
    }
    if (!isEdit) {

      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentResource]);

  const onSubmit = async (data) => {
    console.log(data);
    setLibApiError(null);
    try {
      if (isEdit && currentResource) {
        //updata method needs resource id
        data.id = currentResource.id;
        var newData = { ...data, ...documentsToAdd }
        resourceService.updateResource(newData)
          .then(res => {
            navigate(PATH_DASHBOARD.resource.list)
            enqueueSnackbar('Resource updated successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if (err.response.data.errors[0].key == "lib") {
              setLibApiError(i18next.t(err.response.data.errors[0].code));
            }
          });
      }
      if (!isEdit) {
        var newData = { ...data, ...documentsToAdd }
        resourceService.addResource(newData)
          .then(res => {
            navigate(PATH_DASHBOARD.resource.list)
            enqueueSnackbar('Resource added successfully');
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
      <Grid container spacing={3} fullwidth>

        <Grid item xs={12} md={8} fullwidth>
          <Card sx={{ p: 3 }} fullwidth>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="lib" label="Label" helperText={libApiError} errorBack={libApiError || null} />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFTextField name="ref" label="Facility Reference" />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFTextField name="building" label="Building Number" />
              <RHFAutocomplete
                name="place"
                label={"Place"}
                options={placeOptions}
                getOptionLabel={(option) => i18next.t(option.toLowerCase())}
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
                <Link to='/dashboard/resource/list' style={{ textDecoration: 'none' }}><Button variant="contained">Cancel</Button></Link>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Facility' : 'Save Changes'}
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <FileNewFolderDialog open={openUploadFile} onCreate={console.log('new onCreate')} onClose={handleCloseUploadFile} entity='resource' setUploaderInfo={handleSetUploaderInfo} />
      <EntityTextURLUploader isEdit={isEdit} open={openUploadURL} onClose={handleCloseUploadURL} onSetUploadInfo={handleSetUploaderInfo} onUpload />
    </FormProvider>
  );
}
