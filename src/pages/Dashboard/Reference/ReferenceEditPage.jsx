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
import ReferenceNewEditForm from '../../../sections/dashboard/reference/ReferenceNewEditForm';
// reference services
import { referenceService } from '../../../_services/reference.service';
// ----------------------------------------------------------------------

export default function ReferenceEditPage() {
  const { themeStretch } = useSettingsContext();

  const [currentReference, setCurrentReference] = useState(null);
  const [documentsToShow, setDocumentsToShow] = useState(null);


  const { name } = useParams();
  console.log('param id: ' + name)

  const getCurrentReference = () => {
    console.log('getCurrentReference is executed')
    referenceService.getReference(name)
      .then(res => {
        setCurrentReference(res.data)
        console.log('getCurrentReference is executed in then')
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getCurrentReference()
  }, [])



  const handleDelelteDocument = (documentsToDel)=>{
    const params = {
      id:name,
      documentsToDel:documentsToDel
    }
    referenceService.updateReference(params).then(()=>getCurrentReference()).catch(err=>console.error(err))
  }

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Test repository"
          links={[
            {
              name: 'Management',
            },
            {
              name: 'Test repositories List',
              href: PATH_DASHBOARD.reference.list,
            },
            { name: currentReference?.lib },
          ]}
        />

        {currentReference && (
          <ReferenceNewEditForm isEdit currentReference={currentReference} onDeleteDocument = {handleDelelteDocument} />
        )}
      </Container>
    </>
  );
}
