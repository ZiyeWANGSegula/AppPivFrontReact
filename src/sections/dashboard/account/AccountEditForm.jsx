import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState} from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, IconButton, InputAdornment, Stack, TextField} from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
    RHFSelect,
  RHFTextField,
} from '../../../components/hook-form';
import i18next from 'i18next';
import { CustomAvatar } from '../../../components/custom-avatar';
import { userService } from '../../../_services/user.service';
import Iconify from '../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

AccountEditForm.propTypes = {
  currentUser: PropTypes.object,
};

export default function AccountEditForm({ currentUser }) {
  const categories = ["ADMIN", "CUSTOMER", "MANAGER", "USER"];
  const [ oldPasswordApiError, setOldPasswordApiError ] = useState(null);
  const [ passwordRepeatApiError, setPasswordRepeatApiError ] = useState(null);
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Your old password is required'),
    password: Yup.string().required('Your new password is required'),
    passwordRepeatAgain: Yup.string().required('Rewriting your new password is required')
  });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      cat: currentUser?.cat || '',
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
    if (currentUser) {
        reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const onSubmit = async (data) => {
    console.log("user data: " + data);
    setOldPasswordApiError(null);
    setPasswordRepeatApiError(null);
    try {
        if (currentUser) {
          //updata method needs user id
          data.id = currentUser.id;
          userService.updateUserPassword(data)
            .then(res => {
              enqueueSnackbar('Account updated successfully');
              setTimeout(() => {
                window.location.reload(true);
              }, 1000);
            })
            .catch(err => {
                console.log(err);
                if(err.response.data.errors[0].key == "oldPassword") {
                    setOldPasswordApiError(i18next.t(err.response.data.errors[0].code));
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

        <Grid item xs={12} md={10}>
          <Card sx={{ p: 3 }}>
          <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: '20% 75%',
                sm: '20% 75%',
              }}
              alignItems="center"
            >
            {currentUser?.cat == 'ADMIN' &&
              <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_11.jpg" sx={{height: '150px',width: '150px',}} />
            }
            {currentUser?.cat == 'CUSTOMER' &&
              <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_18.jpg" sx={{height: '150px',width: '150px',}} />
            }
            {currentUser?.cat == 'MANAGER' &&
              <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_23.jpg" sx={{height: '150px',width: '150px',}} />
            }
            {currentUser?.cat == 'USER' &&
              <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_24.jpg" sx={{height: '150px',width: '150px',}} />
            }
            <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
            }}
            >
                <RHFTextField name="firstName" label="First name" InputLabelProps={{ shrink: true }} disabled sx={{
                    backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
                    borderRadius: '8px'
                    }}
                />
                <RHFTextField name="lastName" label="Last name" InputLabelProps={{ shrink: true }} disabled sx={{
                    backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
                    borderRadius: '8px'
                    }}
                />
                <RHFTextField name="username" label="Username" InputLabelProps={{ shrink: true }} disabled sx={{
                    backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
                    borderRadius: '8px'
                    }}
                />
                <RHFTextField name="email" label="Email Address" InputLabelProps={{ shrink: true }} disabled sx={{
                    backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
                    borderRadius: '8px'
                    }}
                />
                <RHFSelect native name="cat" label="Category" InputLabelProps={{ shrink: true }} placeholder="Categories" disabled sx={{
                    backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
                    borderRadius: '8px'
                    }}
                >
                    <option value="" />
                    {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {i18next.t(cat.toLowerCase())}
                    </option>
                    ))}
                </RHFSelect>
                <Grid item xs={12} sm={6}>
                    {/* Add the placeholder div */}
                    <div></div>
                </Grid>
                <RHFTextField 
                    name="oldPassword" 
                    label="Old password" 
                    helperText={oldPasswordApiError} 
                    errorBack={oldPasswordApiError || null}
                    type={showOldPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                            <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />
                <Grid item xs={12} sm={6}>
                    {/* Add the placeholder div */}
                    <div></div>
                </Grid>
                <RHFTextField 
                    name="password" 
                    label="New password" 
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
                <RHFTextField 
                    name="passwordRepeatAgain" 
                    label="Repeat new password" 
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
            </Box>
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save Changes
          </LoadingButton>
          </Stack>
          </Card>
        </Grid>
      </Grid>

      
    </FormProvider>
  );
}
