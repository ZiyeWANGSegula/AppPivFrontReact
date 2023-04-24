import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Grid, Card, Button, Typography, Stack, Box, Divider } from '@mui/material';
import Iconify from '../../../components/iconify/Iconify';
import FormProvider, { RHFTextField } from '../../../components/hook-form'
import { useForm, Controller } from 'react-hook-form';
import useResponsive from '../../../hooks/useResponsive';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo,useEffect } from 'react';
import { fDate } from '../../../utils/formatTime';
import {useSnackbar} from '../../../components/snackbar';

TestWorkflowRequirementsBlock.prototype = {
  entity:PropTypes.object,
  estimatedAt:PropTypes.instanceOf(Date),
  entityId:PropTypes.number
}

export default function TestWorkflowRequirementsBlock({ entity, estimdAt, entityId }) {
  const upMd = useResponsive('up', 'md');
  let today = new Date().toISOString().slice(0, 10)
  console.log('date now')
  console.log(today)
  const { enqueueSnackbar } = useSnackbar();

  const TestWorkflowRequirementsBlockSchema = Yup.object().shape(
    {
      lib: Yup.string().required(`${entity} model is required`),
      EstimAt: Yup.date().required('Estimated date is required'),
      At: Yup.date().required('Real date is required'),
      Doc: Yup.string().required('Document is required'),
      StatuBy: Yup.string().required('Validator is required'),

    }
  )

  const defaultValues = useMemo(
    () => ({
      lib: entityId || '',
      //slice 0-10 for correct the date format to YYYY-MM-DD
      estimdAt: estimdAt.slice(0, 10) || '',
      At: today,
      Document: '',
      statuBy: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entity]
  );

  const methods = useForm({
    resolver: yupResolver(TestWorkflowRequirementsBlockSchema),
    defaultValues,
  }
  );
  
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data) => {
    console.log("form data: " + data);
   
  };

  return (

    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    

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
            <RHFTextField name="lib" label={entity} />
            <RHFTextField name="estimdAt" label="Estimated date" type='date'/>
            <RHFTextField name="At" label="Real date" type='date'/>
            <RHFTextField name="Document" label="Document" />
            <RHFTextField name="engine" label="Validated by" />
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save changes
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>

  </FormProvider>
  )
}