import { Grid, Card, Button, Typography, Stack, Box, Divider, TextField } from '@mui/material';
import Iconify from '../../../components/iconify/Iconify';
import { RHFTextField } from '../../../components/hook-form'
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import useSnackbar from '../../../components/snackbar'
import useResponsive from '../../../hooks/useResponsive';
import TestWorkflowRequirementsBlock from './TestWorkflowRequirementsBlock';
import TestStatuFieldsSection from './TestStatuFieldsSection';
import TestStatuFieldsSectionFeasiblity from './TestStatuFieldsSectionFeasiblity';
import { fDate } from '../../../utils/formatTime';
import { resourceService } from '../../../_services/resource.service'
import { testService } from '../../../_services/test.service';
import { formatISODate } from '../../../utils/formatTime';
import { Backup } from '@mui/icons-material';

export default function TestWorkflowFeasibility({ onBackStep, onNextStep, currentTest, stepName }) {
    //const { enqueueSnackbar } = useSnackbar();
    const [stepData, setStepData] = useState(currentTest[`ProjTest${stepName}`])
    const [validateState, setValidateState] = useState();
    const [estimatedDate, setEstimatedDate] = useState();
    const [realDate, setRealDate] = useState();
    const skillsStatus = currentTest[`ProjTest${stepName}`]['skillsStatus']
    const resourceStatus = currentTest[`ProjTest${stepName}`]['resourceStatus']
    const backupStatus = currentTest[`ProjTest${stepName}`]['backupStatus']

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
                //enqueueSnackbar("TestworkFlow validated successfully");
            })
            .catch((err) => console.log(err));

    }, [validateState]);

    const fetchData = async () => {
        try {
            const resourceRes = await resourceService.getAllResources();
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
            validateState: resourceStatus,
        },
        {
            validateState: skillsStatus,
        },
        {
            validateState: backupStatus,
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
                    <TestStatuFieldsSection
                        title="Facility availability"
                        entity="resource"
                        stepData={stepData}
                        estimatedDate={formatISODate(stepData['resourceEstimAt'])}
                        entityList={resources}
                        testId={currentTest.id}
                        onValidateStateChange={(state) => handleSectionValidationStateChange(0, state)}
                        stepName={stepName}
                        stepValidated={validateState}
                        backendKey='FEASIBILITY'
                    />

                    <TestStatuFieldsSectionFeasiblity
                        title="Skill availability"
                        entity="skills"
                        stepData={stepData}
                        estimatedDate={formatISODate(stepData['skillsEstimAt'])}
                        testId={currentTest.id}
                        onValidateStateChange={(state) => handleSectionValidationStateChange(1, state)}
                        stepName={stepName}
                        stepValidated={validateState}
                    />
                    <TestStatuFieldsSectionFeasiblity
                        title="Backup availability"
                        entity="backup"
                        stepData={stepData}
                        estimatedDate={formatISODate(stepData['backupEstimAt'])}
                        testId={currentTest.id}
                        onValidateStateChange={(state) => handleSectionValidationStateChange(2, state)}
                        stepName={stepName}
                        stepValidated={validateState}
                    />

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
                    <Button
                        size="medium"
                        color="inherit"
                        onClick={onBackStep}
                        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                    >
                        Back
                    </Button>
                    {sectionValidationStates.every((state) => state) && (
                        <Button
                            size="large"
                            variant="contained"
                            color={validateState ? 'warning' : 'success'}
                            onClick={handleValidationButtonClicked}
                            sx={{ margin: 3 }}
                        >
                            {validateState ? 'Cancel validation' : 'Validate Feasibility'}
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