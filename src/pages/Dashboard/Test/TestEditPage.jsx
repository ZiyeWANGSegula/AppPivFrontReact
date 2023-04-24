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
import TestNewEditForm from '../../../sections/dashboard/test/TestNewEditForm';
// Test services
import { TestService } from '../../../_services/test.service';
// ----------------------------------------------------------------------

export default function TestEditPage() {
  const { themeStretch } = useSettingsContext();

   const [currentTest, setCurrentTest] = useState(null);
   

  
  const { name } = useParams();
  console.log('param id: ' + name)
  
  useEffect(() => {     

    TestService.getTest(name)
        .then(res => {
            setCurrentTest(res.data)
            console.log('get Test res: ' + res)
            console.log('get Test res.lib:' + res.data.lib)
        })
        .catch(err => console.log(err))

}, [])

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Test"
          links={[
            {
              name: 'General',
            },
            {
              name: 'Tests List',
              href: PATH_DASHBOARD.test.list,
            },
            { name: currentTest?.lib },
          ]}
        />

        <TestNewEditForm isEdit currentTest={currentTest} />
      </Container>
    </>
  );
}
