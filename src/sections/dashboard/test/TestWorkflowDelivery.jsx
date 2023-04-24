import { Grid, Card, Button, Typography, Stack, Box, Divider, TextField } from '@mui/material';
import Iconify from '../../../components/iconify/Iconify';
import FormProvider, { RHFTextField } from '../../../components/hook-form'
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useResponsive from '../../../hooks/useResponsive';
import TestStatuFieldsSectionDelivery from './TestStatuFieldsSectionDelivery';
import { useSnackbar } from '../../../components/snackbar';
import { formatISODate } from '../../../utils/formatTime';
import { testService } from '../../../_services/test.service';
export default function TestWorkflowDelivery({ onNextStep, onBackStep, currentTest, stepName }) {
    const { enqueueSnackbar } = useSnackbar();
    const stepData = currentTest[`ProjTest${stepName}`]
    const [validateState, setValidateState] = useState(stepData['status']);
    const [estimatedDate, setEstimatedDate] = useState(stepData['estimAt']);
    const [realDate, setRealDate] = useState(stepData['at']);

    const deliveryStatus = currentTest[`ProjTest${stepName}`]['deliveryStatus']
    const complianceStatus = currentTest[`ProjTest${stepName}`]['complianceStatus']

    useEffect(() => {

        const data = {
            id: currentTest.id,
            step: `RECEPTION`,
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
                enqueueSnackbar("TestworkFlow updated successfully");
            })
            .catch((err) => console.log(err));

    }, [validateState]);



    const handleEstimatedDateChange = (event) => {
        setEstimatedDate(event.target.value);
    };
    const handleRealDateChange = (event) => {
        setRealDate(event.target.value);
        console.log('realdate: ' + realDate)
    };

    const handleValidationButtonClicked = () => {
        setValidateState(!validateState);
    };

    const sections = [
        {
            title: "Delivery",
            entity: "delivery",
            stepDataKey: "deliveryEstimAt",
            validateState: deliveryStatus,
        },
        {
            title: "Compliance",
            entity: "compliance",
            stepDataKey: "complianceEstimAt",
            validateState: complianceStatus,
        },
    ];

    const [sectionValidationStates, setSectionValidationStates] = useState(
        sections.map((section) => section.validateState)
    );

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
                        <TestStatuFieldsSectionDelivery
                            title={section.title}
                            entity={section.entity}
                            stepData={stepData}
                            estimatedDate={formatISODate(stepData[section.stepDataKey])}
                            testId={currentTest.id}
                            onValidateStateChange={(state) => handleSectionValidationStateChange(index, state)}
                            stepName={stepName}
                            stepValidated={validateState}
                        />
                    ))}
                </Stack>


                <Divider sx={{ my: 3, borderStyle: 'dashed', marginLeft: 6, marginRight: 6 }} />

                <Stack
                    spacing={2}
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                    sx={{ width: 1, padding: 3 }}
                >
                    <TextField id="dateEstimated" label="Estimated Date" type="date" onChange={handleEstimatedDateChange} InputLabelProps={{ shrink: true }} defaultValue={formatISODate(estimatedDate)} InputProps={{ readOnly: true }} sx={{
                        '& .MuiInputBase-input': {
                            backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
                        },
                    }} />
                    <TextField id="dateReal" label="Real Date" type="date" onChange={handleRealDateChange} InputLabelProps={{ shrink: true }} defaultValue={formatISODate(realDate)} InputProps={validateState ? { readOnly: true } : { readOnly: false }} sx={{
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
                            {validateState ? 'Cancel validation' : 'Validate Delivery'}
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