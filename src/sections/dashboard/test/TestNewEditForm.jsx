import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Hidden, Button } from '@mui/material';
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
// test services
import { testService } from '../../../_services/test.service';
import { userService } from '../../../_services/user.service';
import { resourceService } from '../../../_services/resource.service';
import { vehicleService } from '../../../_services/vehicle.service';
import { referenceService } from '../../../_services/reference.service';
import { Opacity } from '@mui/icons-material';

// ----------------------------------------------------------------------

TestNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTest: PropTypes.object,
};

export default function TestNewEditForm({ isEdit = false, currentTest }) {

  const [referentUsers, setReferentUsers] = useState([]);
  const [referentCustomerUsers, setReferentCustomerUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [references, setReferences] = useState([]);

  let today = new Date().toISOString().slice(0, 10)

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const user = [
    {
      date: '2023-01-15',
      assignment: 'Task A',
      duration: 5,
      comment: 'Completed',
    },
    {
      date: '2023-02-21',
      assignment: 'Task B',
      duration: 3,
      comment: 'In progress',
    },
  ];

  const NewTestSchema = Yup.object().shape({
    estimStartAt: Yup.string().required('Label is required'),
    resourceId: Yup.number().required('Place is required'),
    referentCustomerId: Yup.number().required('Label is required'),
    referentId: Yup.number().required('Label is required'),
    vehicleId: Yup.number().required('Label is required'),
  });

  const defaultValues = useMemo(
    () => ({
      estimStartAt: currentTest?.estimStartAt || today,
      resourceId: currentTest?.resourceId || '',
      referentCustomerId: currentTest?.referentCustomerId || '',
      referentId: currentTest?.referentId || '',
      vehicleId: currentTest?.vehicleId || '',
    }),
    [currentTest]
  );

  const methods = useForm({
    resolver: yupResolver(NewTestSchema),
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
    userService.getAllUsersByNotCat('CUSTOMER').then((res) => { setReferentUsers(res.data);}).catch(err => { console.log(err);})
    userService.getAllUsersByCat('CUSTOMER').then((res) => { setReferentCustomerUsers(res.data);}).catch(err => { console.log(err);})
    referenceService.getAllReferences().then((res) => { setReferences(res.data); }).catch(err => { console.log(err); });
    resourceService.getAllResources().then((res) => { setResources(res.data) }).catch(err => { console.log(err) });
    vehicleService.getAllVehicles().then((res) => { setVehicles(res.data); }).catch(err => { console.log(err) })
    if (isEdit && currentTest) {

      reset(defaultValues);
    }
    if (!isEdit) {

      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTest]);

  const onSubmit = async (data) => {
    console.log('daata creation')
    console.log(data)
    try {
      if (isEdit && currentTest) {
        //updata method needs test id
        data.id = currentTest.id;
        testService.updateTest(data)
          .then(res => {
            navigate(PATH_DASHBOARD.test.list)
            enqueueSnackbar('Test updated successfully');
          })
          .catch(err => console.log(err))
      }
      if (!isEdit) {
        console.log('daata creation')
        console.log(data)
        testService.addTest(data)
          .then(res => {
            navigate(PATH_DASHBOARD.test.list)
            enqueueSnackbar('Test added successfully');
          })
          .catch(err => console.log(err))

      }
      console.log('DATA', data);
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
              <RHFTextField name="estimStartAt" label="Test Start At" type='date' />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>

              <RHFAutocomplete
                name="vehicleId"
                label={"Vehicle"}
                shouldGetId={true}
                options={vehicles.map(opt=>({label:opt.lib,value:opt.id}))}
                getOptionLabel={(option) => (option.label)?option.label:''}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFAutocomplete
                name="referenceId"
                label={"Test Repository"}
                shouldGetId={true}
                options={references.map(opt=>({label:opt.lib,value:opt.id}))}
                getOptionLabel={(option) => (option.label)?option.label:''}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFAutocomplete
                name="referentId"
                label={"Segula Referent"}
                shouldGetId={true}
                options={referentUsers.map(opt=>({label:opt.firstName+' '+opt.lastName,value:opt.id}))}
                getOptionLabel={(option) => (option.label)?option.label:''}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                name="referentCustomerId"
                label={"Customer Referent"}
                shouldGetId={true}
                options={referentCustomerUsers.map(opt=>({label:opt.firstName+' '+opt.lastName,value:opt.id}))}
                getOptionLabel={(option) => (option.label)?option.label:''}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                name="resourceId"
                label={"Facility Reference"}
                shouldGetId={true}
                options={resources.map(opt=>({label:opt.lib,value:opt.id}))}
                getOptionLabel={(option) => (option.label)?option.label:''}
                isOptionEqualToValue={(option, value) => option.value === value}
              />


            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Box
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'auto auto',
                  }}
              >
                <Link to='/dashboard/test/list' style={{ textDecoration: 'none' }}><Button variant="contained">Cancel</Button></Link>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Test' : 'Save Changes'}
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
