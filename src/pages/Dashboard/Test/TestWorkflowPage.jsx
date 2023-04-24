import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// @mui
import { Grid, Container, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//redux
import { useDispatch, useSelector } from '../../../redux/store';
import { backStep, nextStep, gotoStep, resetWorkflow } from '../../../redux/slices/test';

import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { CheckoutSteps, TestWorkflowDelivery, TestWorkflowRequirements, TestWorkflowTesting, TestWorkflowReports, TestWorkflowFeasibility, TestWorkflowPlanningFreeze } from '../../../sections/dashboard/test';
import { testService } from '../../../_services/test.service';

// ----------------------------------------------------------------------

const STEPS = ['Requirements', 'Feasibility', 'Planning Freeze', 'Delivery', 'Testing', 'Reports'];
const propertiesToCheck = [
    'ProjTestRequirement',
    'ProjTestFeasibilityCheck',
    'ProjTestPlanningFreeze',
    'ProjTestReception',
    'ProjTestCourse',
    'ProjTestReport',
  ];
// ----------------------------------------------------------------------

export default function TestWorkflowPage() {
    const { themeStretch } = useSettingsContext();

    const [currentTest, setCurrentTest] = useState(null);



    const { name } = useParams();
    console.log('param id: ' + name)
    const navigate = useNavigate();
    const { settings } = useSettingsContext();

    useEffect(() => {
        //handleResetWorkflow()
        testService.getTest(name)
            .then(res => {
                setCurrentTest(res.data)
                handleGotoStep(findFirstFalseStatus(res.data))
            })
            .catch(err => console.log(err))
    }, [])
    const dispatch = useDispatch();
    const { checkout } = useSelector((state) => state.test);
    const { activeStep } = checkout;
    const completed = activeStep === STEPS.length;




    const handleNextStep = () => {
        dispatch(nextStep());
    };

    const handleBackStep = () => {
        dispatch(backStep());
    };

    const handleGotoStep = (step) => {
        dispatch(gotoStep(step));
    };

    const handleResetWorkflow = () => {
        dispatch(resetWorkflow());
    }

    const findFirstFalseStatus = (data) => {

        for (let i = 0; i < propertiesToCheck.length; i++) {
            if (data[propertiesToCheck[i]] && data[propertiesToCheck[i]].status === false) {
              return i;
            }
          }
        
          return 0; // Return 0, to go the first property
      };
    console.log('currentTest', currentTest)
    return (
        <>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                {currentTest == null ? (<div>loading</div>) : (

                    <CustomBreadcrumbs
                        heading={`${currentTest.lib}`}
                        links={[
                            { name: 'General'},
                            {
                                name: 'Tests List',
                                href: PATH_DASHBOARD.test.root,
                            },
                            {
                                name: currentTest?.lib
                            },
                            { name: "Test Workflow" },
                        ]}
                    />
                )}

                <Grid container justifyContent={completed ? 'center' : 'center'}>
                    <Grid item xs={12} md={8}>
                        <CheckoutSteps activeStep={activeStep} steps={STEPS} />
                    </Grid>
                </Grid>
                {completed ? (
                    <Button onClick={handleResetWorkflow}>finished</Button>
                ) : (currentTest == null ? (<div>loading</div>) : (
                    <>
                        {activeStep === 0 && (
                            <TestWorkflowRequirements
                                currentTest={currentTest}
                                checkout={checkout}
                                onNextStep={handleNextStep}
                                stepName='Requirement'

                            />
                        )}
                        {activeStep === 1 && (
                            <TestWorkflowFeasibility
                                currentTest={currentTest}
                                checkout={checkout}
                                onBackStep={handleBackStep}
                                onNextStep={handleNextStep}
                                stepName='FeasibilityCheck'
                            />
                        )}
                        {activeStep === 2 && (
                            <TestWorkflowPlanningFreeze
                                currentTest={currentTest}
                                checkout={checkout}
                                onNextStep={handleNextStep}
                                onBackStep={handleBackStep}
                                stepName='PlanningFreeze'
                            />
                        )}
                        {activeStep === 3 && (
                            <TestWorkflowDelivery
                                currentTest={currentTest}
                                checkout={checkout}
                                onNextStep={handleNextStep}
                                onBackStep={handleBackStep}
                                stepName='Reception'
                            />
                        )}
                        {activeStep === 4 && (
                            <TestWorkflowTesting
                                currentTest={currentTest}
                                checkout={checkout}
                                onNextStep={handleNextStep}
                                onBackStep={handleBackStep}
                                stepName='Course'
                            />
                        )}
                        {activeStep === 5 && (
                            <TestWorkflowReports
                                currentTest={currentTest}
                                checkout={checkout}
                                onNextStep={handleNextStep}
                                onBackStep={handleBackStep}
                                stepName='Report'
                            />
                        )}
                    </>
                )
                )}
            </Container>
        </>
    )
}