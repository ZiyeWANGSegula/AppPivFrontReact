import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../../sections/dashboard/user/UserNewEditForm';
// user services
import { userService } from '../../../_services/user.service';
// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();

   const [currentUser, setCurrentUser] = useState(null);

  
  const { name } = useParams();
  console.log('param id: ' + name)
  
  useEffect(() => {     

    userService.getUser(name)
        .then(res => {
            setCurrentUser(res.data)
            console.log('get user res: ' + res)
            console.log('get user res.data:' + res.data.firstName)
        })
        .catch(err => console.log(err))

}, [])

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit user"
          links={[
            {
              name: 'Settings',
            },
            {
              name: 'Users List',
              href: PATH_DASHBOARD.user.list,
            },
            { name: currentUser?.username },
          ]}
        />

        <UserNewEditForm isEdit currentUser={currentUser} />
      </Container>
    </>
  );
}
