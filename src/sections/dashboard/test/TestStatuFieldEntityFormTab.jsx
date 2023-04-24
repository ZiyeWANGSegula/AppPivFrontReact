import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from '../../../components/hook-form';
// ----------------------------------------------------------------------

TestStatuFieldEntityFormTab.propTypes = {
  title: PropTypes.string,
  estimatedDate: PropTypes.string
};

export default function TestStatuFieldEntityFormTab({ title, entityId, estimatedDate, entityList }) {

  const NewEntitySchema = Yup.object().shape({
    entityId: Yup.string().required(`${title} is required.`),
    dateEstimated: Yup.string().required('Estimated Date is required.'),
    dateReal: Yup.string().required('Real Date is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      entityId: entityId || '',
      dateEstimated: estimatedDate || '',
      dateReal: '',

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entityId]
  );

  const methods = useForm({
    resolver: yupResolver(NewEntitySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;



  const onSubmit = async (data) => {
    alert('test submitted')
  };

  return (
    < FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}>
        {typeof entityId === 'number' ? <RHFSelect native name="entityId" label={`${title}`} placeholder="Referent user" defaultValue='name_test'>
          <option value="" />
          {entityList.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.lib}
            </option>
          ))}
        </RHFSelect> : <RHFTextField name="entityId" label={`${title}`} defaultValue={entityId} />}
        <RHFTextField name="dateEstimated" label="Estimated Date" type="date" InputLabelProps={{ shrink: true }} defaultValue={estimatedDate} InputProps={{ readOnly: true }} sx={{
          '& .MuiInputBase-input': {
            backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
          },
        }} />
        <RHFTextField name="dateReal" label="Real Date" type="date" InputLabelProps={{ shrink: true }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            mt: 2,
            gap: 5

          }}
        >
          <Button
            variant="contained"
            color='secondary'
            type='submit'
          >
            Save
          </Button>
          <Button
            variant="contained"
            color='warning'
            onClick={() => alert('Validation Failed')}
          >
            Validate
          </Button>
        </Box>
      </Box>
    </FormProvider >
  );
}
