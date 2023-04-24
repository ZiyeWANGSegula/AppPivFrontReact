import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import ReferenceNewEditForm from '../../../sections/dashboard/reference/ReferenceNewEditForm';

// ----------------------------------------------------------------------

export default function ReferenceCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Test repository"
          links={[
            {
              name: 'Management',
            },
            {
              name: 'Test repositories List',
              href: PATH_DASHBOARD.reference.list,
            },
            { name: 'Create' },
          ]}
        />
        <ReferenceNewEditForm />
      </Container>
    </>
  );
}
