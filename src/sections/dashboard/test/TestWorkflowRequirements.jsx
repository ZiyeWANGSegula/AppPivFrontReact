import { Grid, Card, Button, Typography, Stack, Box, Divider, TextField } from '@mui/material';
import Iconify from '../../../components/iconify/Iconify';
import { RHFTextField } from '../../../components/hook-form'
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import useResponsive from '../../../hooks/useResponsive';
import TestWorkflowRequirementsBlock from './TestWorkflowRequirementsBlock';
import TestStatuFieldsSection from './TestStatuFieldsSection';
import TestStatuFieldsSectionPlanningFreeze from './TestStatuFieldsSectionPlanningFreeze';
import { fDate } from '../../../utils/formatTime';
import { useSnackbar } from '../../../components/snackbar';
import { referenceService } from '../../../_services/reference.service'
import { vehicleService } from '../../../_services/vehicle.service'
import { resourceService } from '../../../_services/resource.service'
import { testService } from '../../../_services/test.service';
import { formatISODate } from '../../../utils/formatTime';

export default function TestWorkflowRequirements({ onNextStep, currentTest, stepName }) {
  const { enqueueSnackbar } = useSnackbar()
  const [stepData, setStepData] = useState(currentTest[`ProjTest${stepName}`])
  const [validateState, setValidateState] = useState();
  const [estimatedDate, setEstimatedDate] = useState();
  const [realDate, setRealDate] = useState();
  const referenceStatus = currentTest[`ProjTest${stepName}`]['referenceStatus']
  const resourceStatus = currentTest[`ProjTest${stepName}`]['resourceStatus']
  const vehicleStatus = currentTest[`ProjTest${stepName}`]['vehicleStatus']
  const [references, setReferences] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [resources, setResources] = useState([])


  useEffect(() => {
    fetchData();
    testService.getTest(currentTest.id).
      then(res => {
        console.log('requirement initialized get')
        console.log(res.data)
        setValidateState(res.data[`ProjTest${stepName}`]['status']);
        setEstimatedDate(formatISODate(res.data[`ProjTest${stepName}`]['estimAt']));
        setRealDate(formatISODate(res.data[`ProjTest${stepName}`]['at']));
      })
  }, []);
  useEffect(() => {
    const data = {
      id: currentTest.id,
      step: `${stepName.toUpperCase()}S`,
      stepId: currentTest.id,
      status: validateState,
      estimAt: estimatedDate,
      at: realDate,
    }
    console.log("data validation step");
    console.log(data);

    testService
      .updateTest(data)
      .then((res) => {
        enqueueSnackbar("TestworkFlow validated successfully");
      })
      .catch((err) => console.log(err));

  }, [validateState]);

  const fetchData = async () => {
    try {
      const referenceRes = await referenceService.getAllReferences();
      const vehicleRes = await vehicleService.getAllVehicles();
      const resourceRes = await resourceService.getAllResources();

      setReferences(referenceRes.data);
      setVehicles(vehicleRes.data);
      setResources(resourceRes.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleEstimatedDateChange = (event) => {
    setEstimatedDate(event.target.value);
  };
  const handleRealDateChange = (event) => {
    setRealDate(event.target.value);
    console.log('realdate: ' + realDate)
  };


  const sections = [
    {
      title: "Test repository",
      entity: "reference",
      stepDataKey: "referenceEstimAt",
      entityList: references,
      validateState: referenceStatus,
    },
    {
      title: "Vehicle",
      entity: "vehicle",
      stepDataKey: "vehicleEstimAt",
      entityList: vehicles,
      validateState: vehicleStatus,
    },
    {
      title: "Facility",
      entity: "resource",
      stepDataKey: "resourceEstimAt",
      entityList: resources,
      validateState: resourceStatus,
    },
    
  ];

  const [sectionValidationStates, setSectionValidationStates] = useState(
    sections.map((section) => section.validateState)
  );

  const handleValidationButtonClicked = () => {
    setValidateState(!validateState);
  };

  const handleSectionValidationStateChange = (sectionIndex, state) => {
    setSectionValidationStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[sectionIndex] = state;
      return newStates;
    });
  };


  return (

    <>
      <Card sx={{ width: '100%' }}>
        <Stack
          spacing={{ xs: 2, md: 2 }}
          sx={{ p: 3 }}
        >
          {sections.map((section, index) => (
            <TestStatuFieldsSection
              title={section.title}
              entity={section.entity}
              stepData={stepData}
              estimatedDate={formatISODate(stepData[section.stepDataKey])}
              entityList={section.entityList}
              testId={currentTest.id}
              onValidateStateChange={(state) => handleSectionValidationStateChange(index, state)}
              stepName={stepName}
              stepValidated={validateState}
              backendKey='REQUIREMENTS'
            />
          ))}
          {/* <TestStatuFieldsSectionPlanningFreeze title={"Test schedule"} entity={"testDate"} stepData={stepData} estimatedDate={}></TestStatuFieldsSectionPlanningFreeze> */}
        </Stack>


        <Divider sx={{ my: 3, borderStyle: 'dashed', marginLeft: 6, marginRight: 6 }} />

        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          sx={{ width: 1, padding: 3 }}
        >
          <TextField id="dateEstimated" label="Estimated Date" type="date" onChange={handleEstimatedDateChange} InputLabelProps={{ shrink: true }} value={estimatedDate} InputProps={{ readOnly: true }} sx={{
            '& .MuiInputBase-input': {
              backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
            },
          }} />
          <TextField id="dateReal" label="Real Date" type="date" onChange={handleRealDateChange} InputLabelProps={{ shrink: true }} value={realDate} InputProps={validateState ? { readOnly: true } : { readOnly: false }} sx={{
            '& .MuiInputBase-input': {
              backgroundColor: validateState ? 'rgba(211, 211, 211, 0.5)' : 'transparent', // Set the grey background color
            },
          }} />

          {sectionValidationStates.every((state) => state) && (
            <Button
              size="large"
              variant="contained"
              color={validateState ? 'warning' : 'success'}
              onClick={handleValidationButtonClicked}
              sx={{ margin: 3 }}
            >
              {validateState ? 'Cancel validation' : 'Validate Requirement'}
            </Button>
          )}
          {validateState &&
            <Button
              size="medium"
              color="inherit"
              onClick={onNextStep}
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            >
              Next
            </Button>
          }
        </Stack>

      </Card>
    </>
  )
}