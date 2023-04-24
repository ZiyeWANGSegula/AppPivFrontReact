// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
//authentication
import { useAuthContext } from "../../../auth/useAuthContext"
// components
import { useSettingsContext } from '../../../components/settings';
//general APP
import {AppWelcome, AppWidgetSummary} from '../../../sections/general/app';

// assets
import { SeoIllustration } from '../../../assets/illustrations';
import { Link } from 'react-router-dom';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import AccountEditForm from '../../../sections/dashboard/account/AccountEditForm';
import { userService } from '../../../_services/user.service';
import { useEffect, useState } from 'react';


// ----------------------------------------------------------------------


export default function UserAccountEditPage() {

  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {     

    userService.getUser(user.id)
        .then(res => {
            setCurrentUser(res.data)
        })
        .catch(err => console.log(err))

}, [])

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit user account"
          links={[
            { name: user.fullName},
          ]}
        />
        <AccountEditForm currentUser={currentUser}/>
      </Container>
    </>
  );
}