// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  test: icon('ic_test'),
  user: icon('ic_user'),
  vehicle: icon('ic_vehicle'),
  reference: icon('ic_file'),
  resource: icon('ic_facility'),
  dashboard: icon('ic_dashboard'),
  
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      // Test
      {
        title: 'tests',
        path: PATH_DASHBOARD.test.list,
        icon: ICONS.test,
      }
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // REFERENCE
      {
        title: 'test repositories',
        path: PATH_DASHBOARD.reference.list,
        icon: ICONS.reference,
      },
      // VEHICLE
      {
        title: 'vehicles',
        path: PATH_DASHBOARD.vehicle.list,
        icon: ICONS.vehicle,
      },
      // Resource
      {
        title: 'facilities',
        path: PATH_DASHBOARD.resource.list,
        icon: ICONS.resource,
      },
    ],
  },
    // Settings
  // ----------------------------------------------------------------------
  {
    subheader: 'settings',
    items: [
      {
        title: 'users',
        path: PATH_DASHBOARD.user.list,
        icon: ICONS.user,
      },
    ],
  },
];

export default navConfig;
