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
import ResourceNewEditForm from '../../../sections/dashboard/resource/ResourceNewEditForm';
// resource services
import { resourceService } from '../../../_services/resource.service';
// ----------------------------------------------------------------------

export default function ResourceEditPage() {
  const { themeStretch } = useSettingsContext();

  const [currentResource, setCurrentResource] = useState(null);
  const [documentsToShow, setDocumentsToShow] = useState(null);



  const { name } = useParams();
  console.log('param id: ' + name)

  const getCurrentResource = () => {
    resourceService.getResource(name)
      .then(res => {
        setCurrentResource(res.data)
        console.log('get resource res: ' + res)
        console.log('get resource res.data:' + res.data.lib)
      })
      .catch(err => console.log(err))

  }

  useEffect(() => {
    getCurrentResource()

  }, [])

  const handleDelelteDocument = (documentsToDel) => {
    const params = {
      id: name,
      documentsToDel: documentsToDel
    }
    resourceService.updateResource(params).then(() => getCurrentResource()).catch(err => console.error(err))
  }

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Facility"
          links={[
            {
              name: 'Management',
            },
            {
              name: 'Facilities List',
              href: PATH_DASHBOARD.resource.list,
            },
            { name: currentResource?.lib },
          ]}
        />
        {currentResource && (
          <ResourceNewEditForm isEdit currentResource={currentResource} onDeleteDocument={handleDelelteDocument} />
        )}
      </Container>
    </>
  );
}
