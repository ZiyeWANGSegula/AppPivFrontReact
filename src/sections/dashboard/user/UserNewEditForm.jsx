import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, InputAdornment, IconButton, Button } from '@mui/material';
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
// user services
import { userService } from '../../../_services/user.service';
import i18next from 'i18next';
import Iconify from '../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, currentUser }) {
  console.log("current " + currentUser);
  const categories = ["ADMIN", "CUSTOMER", "MANAGER", "USER"];
  const [ usernameApiError, setUsernameApiError ] = useState(null);
  const [ passwordRepeatApiError, setPasswordRepeatApiError ] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();



  const NewUserSchema = (isEdit)
    ? Yup.object().shape({    
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Email must be a valid email address').required('Email is required'),
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      cat: Yup.string().required('Category is required'),
    })
    : Yup.object().shape({    
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        cat: Yup.string().required('Category is required'),
        password: Yup.string().required('Password is required'),
        passwordRepeat: Yup.string().required('Repeated password should match password above'),
      });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      cat: currentUser?.cat || '',
      password: currentUser?.password || '',
      passwordRepeat: currentUser?.passwordRepeat || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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
    if (isEdit && currentUser) {

      reset(defaultValues);
    }
    if (!isEdit) {

      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    setUsernameApiError(null);
    setPasswordRepeatApiError(null);
    try {
      if (isEdit && currentUser) {
        //updata method needs user id
        data.id = currentUser.id;
        userService.updateUser(data)
          .then(res => {
            navigate(PATH_DASHBOARD.user.list)
            enqueueSnackbar('User updated successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if(err.response.data.errors[0].key == "username") {
              setUsernameApiError(i18next.t(err.response.data.errors[0].code));
            }
          });
      }
      if (!isEdit) {
        userService.addUser(data)
          .then(res => {
            navigate(PATH_DASHBOARD.user.list)
            enqueueSnackbar('User added successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if(err.response.data.errors[0].key == "username") {
              setUsernameApiError(i18next.t(err.response.data.errors[0].code));
            } else if(err.response.data.errors[0].key == "passwordRepeat") {
              setPasswordRepeatApiError(i18next.t(err.response.data.errors[0].code));
            }
          })

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
              <RHFAutocomplete
                name="cat"
                label={"Category"}
                options={categories}
                getOptionLabel={(option) => i18next.t(option.toLowerCase())}
              />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFTextField name="firstName" label="First name" />
              <RHFTextField name="lastName" label="Last name" />
              <RHFTextField name="email" label="Email Address" />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFTextField 
                name="username" 
                label="Username" 
                helperText={usernameApiError} 
                errorBack={usernameApiError || null}
              />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>

              {!isEdit && (
                <RHFTextField 
                  name="password" 
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                    ),
                  }}
                />
              )}
              {!isEdit && (
                <RHFTextField 
                  name="passwordRepeat" 
                  label="Repeat password" 
                  helperText={passwordRepeatApiError} 
                  errorBack={passwordRepeatApiError || null} 
                  type={showPasswordRepeat ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPasswordRepeat(!showPasswordRepeat)} edge="end">
                        <Iconify icon={showPasswordRepeat ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                    ),
                  }}
                />
              )}
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
                <Link to='/dashboard/user/list' style={{ textDecoration: 'none' }}><Button variant="contained">Cancel</Button></Link>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create User' : 'Save Changes'}
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
