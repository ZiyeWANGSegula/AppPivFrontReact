import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );



// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
// DASHBOARD: GENERAL
// DANSHBOARD: USER

export const UserListPage = Loadable(lazy(() => import('../pages/Dashboard//User/UserListPage')));
export const UserCreatePage = Loadable(lazy(() => import('../pages/Dashboard/User/UserCreatePage')));
export const UserEditPage = Loadable(lazy(() => import('../pages/Dashboard/User/UserEditPage')));

// DANSHBOARD: RESOURCE 
export const ResourceListPage = Loadable(lazy(() => import('../pages/Dashboard//Resource/ResourceListPage')));
export const ResourceCreatePage = Loadable(lazy(() => import('../pages/Dashboard/Resource/ResourceCreatePage')));
export const ResourceEditPage = Loadable(lazy(() => import('../pages/Dashboard/Resource/ResourceEditPage')));

// DANSHBOARD: REFERENCE

export const ReferenceListPage = Loadable(lazy(() => import('../pages/Dashboard//Reference/ReferenceListPage')));
export const ReferenceCreatePage = Loadable(lazy(() => import('../pages/Dashboard/Reference/ReferenceCreatePage')));
export const ReferenceEditPage = Loadable(lazy(() => import('../pages/Dashboard/Reference/ReferenceEditPage')));

// DANSHBOARD: VEHICULE
export const VehicleListPage = Loadable(lazy(() => import('../pages/Dashboard//Vehicle/VehicleListPage')));
export const VehicleCreatePage = Loadable(lazy(() => import('../pages/Dashboard/Vehicle/VehicleCreatePage')));
export const VehicleEditPage = Loadable(lazy(() => import('../pages/Dashboard/Vehicle/VehicleEditPage')));

//Test
export const TestWorkflowPage = Loadable(lazy(() => import('../pages/Dashboard//Test/TestWorkflowPage')));
export const TestListPage = Loadable(lazy(() => import('../pages/Dashboard//Test/TestListPage')));
export const TestCreatePage = Loadable(lazy(() => import('../pages/Dashboard/Test/TestCreatePage')));
//export const TestEditPage = Loadable(lazy(() => import('../pages/Dashboard/Test/TestEditPage')));


// MAIN
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));