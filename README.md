:root {
  --sequence-theme: hand
}

# AppPivManagementFront v0.0.8

# how to install
I love **bold text**

## how to install
    run "npm i" in the terminal
## how to run
    run "npm run dev" in the terminal
## how to test
    run "npm test" in the terminal

## how to add a new route
    In src/routes/index call new path from src/routes/paths

```javascript
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const ComponentsOverview = Loadable(lazy(() => import('../pages/ComponentsOverview')));
const Color = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationColor')));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        { path: <LandingPage />, index: true },
        { path: 'about-us', element: <About /> },
        { path: 'contact-us', element: <Contact /> },
        {
          path: 'components',
          children: [
            { element: <ComponentsOverview />, index: true },
            { path: 'color', element: <Color /> },
          ],
        },
      ],
    },
  ]);
}
```
## Usage of routes

```javascript
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

<Link underline="none" variant="subtitle2" component={RouterLink} to="/about-us">
  Go to About us
</Link>;

```

## Set index page route
```javascript
export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'about',
          element: <AboutPage />,
        },
      ],
    },
  ]);
}
```

## Preferences management
The UI Preferences are automatically stored in the application/local storage with the key "settings"

## Add a CRUD action for example vehicle

# vehicle.service.jsx
Code the axios crud actions. -> src\_services\vehicle.service.jsx
# config-navigation.jsx
Add the navitem -> src\layouts\dashboard\nav\config-navigation.jsx
# VehicleCreatePage.jsx
write the vehicle create page -> src\pages\Dashboard\Vehicle\VehicleCreatePage.jsx
# VehicleEditPage.jsx
write the vehicle edit page -> src\pages\Dashboard\Vehicle\VehicleEditPage.jsx
# VehicleListPage.jsx
write the vehicle list page -> src\pages\Dashboard\Vehicle\VehicleListPage.jsx
# elements.jsx
Lazy load the vehicle pages -> src\routes\elements.jsx
# paths.jsx
Configure the paths for the vehicle pages -> src\routes\paths.jsx
# index.jsx in the routes directory
Configure the the paths and the elements relations for the vehicle pages -> src\routes\index.jsx
# VehileNewEditForm.jsx
Construct the edit form and the create form -> src\sections\dashboard\Vehicle\VehicleNewEditForm.jsx
# VehicleTableRow.jsx
Construct the vehicle table row -> src\sections\dashboard\Vehicle\list\VehicleTableRow.jsx
# VehicleTableToolbar.jsx
Construct the tool bar -> src\sections\dashboard\Vehicle\list\VehicleTableToolbar.jsx
# index.jsx in the sections directory
import and export the VehicleTableRow and VehicleTableToolbar -> src\sections\dashboard\Vehicle\list\index.jsx