// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
//authentication
import { useAuthContext } from "../../auth/useAuthContext"
// components
import { useSettingsContext } from '../../components/settings';
//general APP
import {AppWelcome, AppWidgetSummary} from '../../sections/general/app';

// assets
import { SeoIllustration } from '../../assets/illustrations';
import { Link } from 'react-router-dom';


// ----------------------------------------------------------------------


export default function GeneralAppPage() {

    const { user } = useAuthContext()
    console.log('user should be in the auth context', user)

    const theme = useTheme();

    const { themeStretch } = useSettingsContext();

    
    return(
    <Container maxWidth={themeStretch ? false : 'xl'}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <AppWelcome
          title={`Welcome back! \n ${user?.fullName}`}
          description="This app allows management of vehicle test workflows."
          img={
            <SeoIllustration
              sx={{
                p: 3,
                width: 360,
                margin: { xs: 'auto', md: 'inherit' },
              }}
            />
          }
          action={<Link to='/dashboard/test/list' style={{ textDecoration: 'none' }}><Button variant="contained">Start</Button></Link>}
        />
      </Grid>

      </Grid>
    </Container>
)}