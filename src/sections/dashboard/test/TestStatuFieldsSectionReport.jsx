import React, { useState, useEffect, useMemo } from 'react';
import { useFormContext, useForm } from 'react-hook-form';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, AppBar, Box, Button, Tab, Tabs, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { alpha } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import { useTheme } from '@mui/material/styles';
import { useAuthContext } from '../../../auth/useAuthContext';
// prop types
import PropTypes from 'prop-types';
import Label from '../../../components/label'
import FormProvider, { RHFTextField, RHFSelect } from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import TestWorkflowDocumentTabPanelList from './testWorkflowTabPanel/testWorkflowDocumentTabPanel/TestWorkflowDocumentTabPanelList';
import TestWorkflowIncidentTabPanelList from './testWorkflowTabPanel/testWorkflowIncidentTabPanel/TestWorkflowIncidentTabPanelList';
import TestWorkflowCommentTabPanelList from './testWorkflowTabPanel/testWorkflowCommentTabPanel/TestWorkflowCommentTabPanelList';
import TestWorkflowExemptTabPanelList from './testWorkflowTabPanel/testWorkflowExemptTabPanel/TestWorkflowExemptTabPanelList';
import TabPanel from './TestStatuFieldTabPanel';
import { testService } from '../../../_services/test.service';
import { formatISODate } from '../../../utils/formatTime';
import { userService } from '../../../_services/user.service';
import Axios from '../../../_services/caller.service';
import { testCommentService } from '../../../_services/testComment.service';

function FileIcon({ fileType }) {
    switch (fileType) {
        case 'pdf':
            return <PictureAsPdfOutlinedIcon />;
        case 'doc':
            return <DescriptionOutlinedIcon />;
        // Add more cases for other file types
        default:
            return <InsertDriveFileOutlinedIcon />;
    }
}

FileIcon.propTypes = {
    fileType: PropTypes.string.isRequired,
};

TestStatuFieldsSectionReport.propTypes = {
    title: PropTypes.string,
    entity: PropTypes.string,
    estimatedDate: PropTypes.string,
    stepData: PropTypes.object
};

export default function TestStatuFieldsSectionReport({ title, stepData, entity, estimatedDate, testId, onValidateStateChange, stepName,stepValidated}) {
    const theme = useTheme();
    const { user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const [tabValue, setTabValue] = useState(0);
    const [documentTotal, setDocumentTotal] = useState(0)
    const [commentTotal, setCommentTotal] = useState(0)

    console.log('stepData of TestStatuFieldsSectionDelivery')
    console.log(stepData)

    const [statusValidatedBy, setStatusValidatedBy] = useState(stepData[`${entity}StatusBy`]);
    // button state
    const [validateState, setValidateState] = useState(stepData[`${entity}Status`]);

    const NewEntitySchema = Yup.object().shape({
        dateStart: Yup.string().required('Start Date is required.'),
        dateEnd: Yup.string().required('End Date is required.'),
        dateEstimated: Yup.string().required('Estimated Date is required.'),
        dateReal: Yup.string().required('Real Date is required.'),
    });

    const defaultValues = useMemo(
        () => ({
            dateStart: formatISODate(stepData[`${entity}StartAt`]) || '',
            dateEnd: formatISODate(stepData[`${entity}EndAt`]) || '',
            dateEstimated: estimatedDate || '',
            dateReal: formatISODate(stepData[`${entity}At`]) || '',

        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [title]
    );

    const methods = useForm({
        resolver: yupResolver(NewEntitySchema),
        defaultValues,
    });

    const {
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    // Add this state for the exemption Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState("");

    // tate for the new comment dialog
    const [openNewCommentDialog, setOpenNewCommentDialog] = useState(false);

    //function for the new comment dialog
    const handleNewCommentDialogClose = () => {
        setOpenNewCommentDialog(false);
    };

    // Add these functions for the Dialog
    const handleClickOpen = (content) => {
        setDialogContent(content);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDocumentTotalChange = (total) => {
        setDocumentTotal(total);
    }

    const handleCommentTotalChange = (total) => {
        setCommentTotal(total);
    }

    const onSubmit = (data) => {
        data.step = `REPORTS_${entity.toUpperCase()}`;
        data.id = testId
        data.stepId = stepData.id;
        data.todo = "validate"
        data[`${entity}Status`] = validateState
        data[`${entity}At`] = data.dateReal
        data[`${entity}StartAt`] = data.dateStart
        data[`${entity}endAt`] = data.dateEnd
        testService.updateTest(data)
            .then(res => {
                const newState = !!validateState;
                console.log('newState: ' + newState)
                onValidateStateChange(newState);
                setStatusValidatedBy(user.fullName)
                enqueueSnackbar('TestworkFlow validated successfully');
            })
            .catch(err => { console.log(err); enqueueSnackbar('Unable to update!', { variant: 'error' }); })
    }
    // Use the useEffect hook to toggle the visibility of the exemption fields based on the changes in the date fields:

    useEffect(() => {
        userService.getUser(stepData[`${entity}StatusBy`]).then((res) => {
            setStatusValidatedBy(res.data.fullName);
            console.log('user validator', res.data);
        }).catch(err => {
            console.log(err);
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepData]);
    useEffect(() => {
        const params = {
            id: stepData.testId,
            model: `ProjTest${stepName}`,
            field: `REPORTS_${entity.toUpperCase()}`,
        };
        console.log('params');
        console.log(params);
        Axios.get('/api/documents/', { params }).then(
            (res) => {
                console.log("documents data")
                console.log(res.data)
                handleDocumentTotalChange(res.data.length)

            })
        const getCommentParams = {
            testId: stepData.testId,
            testStatusId: stepData.id,
            testStatus: `REPORTS`,
            testStatusField: `REPORTS_${entity.toUpperCase()}`,
        };
        console.log('params');
        console.log(params);
        testCommentService.getTestComment(getCommentParams).then(
            (res) => {
                console.log("documents data")
                console.log(res.data)
                handleCommentTotalChange(res.data.length)

            })
    }, []);
    return (


        <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static">
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="tabs section"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        px: 2,
                        bgcolor: 'background.neutral',
                    }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Tab
                            label={
                                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                    {title}
                                    {validateState &&
                                        <Typography variant="body1" component="span" sx={{ ml: 2 }}>
                                            Validated by{' '}
                                            <Typography
                                                variant="body1"
                                                component="span"
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                {statusValidatedBy}
                                            </Typography>
                                        </Typography>
                                    }
                                </Box>
                            }
                            onClick={() => setTabValue(0)}
                            icon={<Box
                                component={validateState ? CheckCircleIcon : CancelIcon}
                                sx={{
                                    ml: 1,
                                    color: validateState ? 'success.main' : 'error.main',
                                }}
                            />} />
                    </Box>
                    <Tab label="Documents" icon={<Label color='info' sx={{ mr: 1 }}>{documentTotal}</Label>} sx={{
                        '&.Mui-selected': {
                            color: theme.palette.primary.dark,
                            fontWeight: 'bold',
                        },
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.dark, 0.1),
                        },
                    }} />
                    <Tab label="Incidents" icon={<Label color='success' sx={{ mr: 1 }}>5</Label>} sx={{
                        '&.Mui-selected': {
                            color: theme.palette.primary.dark,
                            fontWeight: 'bold',
                        },
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.dark, 0.1),
                        },
                    }} />
                    <Tab label="Comments" icon={<Label color='warning' sx={{ mr: 1 }}>{commentTotal}</Label>} sx={{
                        '&.Mui-selected': {
                            color: theme.palette.primary.dark,
                            fontWeight: 'bold',
                        },
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.dark, 0.1),
                        },
                    }} />
                    <Tab label="Exempts" icon={<Label color='error' sx={{ mr: 1 }}>3</Label>} sx={{
                        '&.Mui-selected': {
                            color: theme.palette.primary.dark,
                            fontWeight: 'bold',
                        },
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.dark, 0.1),
                        },
                    }} />
                </Tabs>
            </AppBar>

            <Divider></Divider>


            <TabPanel value={tabValue} index={0}>


                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(3, 1fr)',
                        }}>

                        <RHFTextField name="dateStart" label="Start Date" type="date" InputLabelProps={{ shrink: true }} InputProps={validateState ? { readOnly: true } : { readOnly: false }} sx={{
                            '& .MuiInputBase-input': {
                                backgroundColor: validateState ? 'rgba(211, 211, 211, 0.5)' : 'transparent', // Set the grey background color
                            },
                        }} />

                        <RHFTextField name="dateEnd" label="End Date" type="date" InputLabelProps={{ shrink: true }} InputProps={validateState ? { readOnly: true } : { readOnly: false }} sx={{
                            '& .MuiInputBase-input': {
                                backgroundColor: validateState ? 'rgba(211, 211, 211, 0.5)' : 'transparent', // Set the grey background color
                            },
                        }} />

                        <RHFTextField name="dateEstimated" label="Estimated Date" type="date" InputLabelProps={{ shrink: true }} defaultValue={estimatedDate} InputProps={{ readOnly: true }} sx={{
                            '& .MuiInputBase-input': {
                                backgroundColor: 'rgba(211, 211, 211, 0.5)', // Set the grey background color
                            },
                        }} />
                        <RHFTextField name="dateReal" label="Real Date" type="date" InputLabelProps={{ shrink: true }} InputProps={validateState ? { readOnly: true } : { readOnly: false }} sx={{
                            '& .MuiInputBase-input': {
                                backgroundColor: validateState ? 'rgba(211, 211, 211, 0.5)' : 'transparent', // Set the grey background color
                            },
                        }} />

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                mt: 2,
                                gap: 5

                            }}
                        >
                            {!stepValidated && <Button
                                variant="contained"
                                color='secondary'
                                type='submit'
                            >
                                Save
                            </Button>}
                            {!stepValidated && <Button
                                variant="contained"
                                color={validateState ? 'warning' : 'success'}
                                type='submit'
                                onClick={() => {
                                    setValidateState(!validateState);
                                }}
                            >
                                {validateState ? 'Cancel' : 'Validate'}
                            </Button>}
                        </Box>
                    </Box>
                </FormProvider>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <TestWorkflowDocumentTabPanelList stepName={`REPORTS_${entity.toUpperCase()}`} stepData={stepData} model={`ProjTest${stepName}`} entity={`test${stepName}`} setTotal={handleDocumentTotalChange} ></TestWorkflowDocumentTabPanelList>
            </TabPanel>


            <TabPanel value={tabValue} index={2}>
                <TestWorkflowIncidentTabPanelList></TestWorkflowIncidentTabPanelList>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <TestWorkflowCommentTabPanelList stepName='REPORTS' stepData={stepData} entity={entity.toUpperCase()} setTotal={handleCommentTotalChange}></TestWorkflowCommentTabPanelList>
            </TabPanel>


            <TabPanel value={tabValue} index={4}>
                <TestWorkflowExemptTabPanelList></TestWorkflowExemptTabPanelList>



                <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>Exempted Comment</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{dialogContent}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </TabPanel>

            <Dialog open={openNewCommentDialog} onClose={handleNewCommentDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>Add New Comment</DialogTitle>
                <DialogContent>
                    {/* Add your form or inputs for adding a new comment here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNewCommentDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleNewCommentDialogClose} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
}