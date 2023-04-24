import { Navigate, useRoutes } from 'react-router-dom';
import {
    LoginPage,
    //User
    UserCreatePage, UserEditPage, UserListPage,
    //Vehicle
    VehicleCreatePage, VehicleEditPage, VehicleListPage,
    //Resource
    ResourceCreatePage, ResourceEditPage, ResourceListPage,
    //Reference
    ReferenceCreatePage, ReferenceEditPage, ReferenceListPage,
    //Test
    TestWorkflowPage,TestListPage,TestCreatePage,
    //Main
    Page404
} from './elements';

import { PATH_AFTER_LOGIN } from '../config-global';
import GeneralAppPage from '../pages/Dashboard/GeneralAppPage';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard/DashboardLayout';
import GuestGuard from '../auth/GuestGuard';
import AuthGuard from '../auth/AuthGuard';
import UserAccountEditPage from '../pages/Dashboard/Account/UserAccountEditPage';
export default function Router() {
    return useRoutes([
        // Landing Page
        {
            path: '/',
            element: (
                <GuestGuard>
                    <LoginPage />
                </GuestGuard>
            )

        },
        // Auth
        {
            path: 'auth',
            children: [
                {
                    path: 'login',
                    element: (
                        <GuestGuard>
                            <LoginPage />
                        </GuestGuard>
                    )
                }

            ]
        },

        // dashboard
        {
            path: 'dashboard',
            element: (
                <AuthGuard>
                    <DashboardLayout />
                </AuthGuard>
            ),
            children: [
                { path: 'account', element: <UserAccountEditPage /> },
                { element: <Navigate to={PATH_AFTER_LOGIN} replace={true} />, index: true },
                { path: 'app', element: <GeneralAppPage /> },
                {
                    path: 'user',
                    children: [
                        { element: <Navigate to="/dashboard/user/list" replace />, index: true },
                        { path: 'list', element: <UserListPage /> },
                        { path: 'new', element: <UserCreatePage /> },
                        { path: ':name/edit', element: <UserEditPage /> }
                    ],
                },
                {
                    path: 'resource',
                    children: [
                        { element: <Navigate to="/dashboard/resource/list" replace />, index: true },
                        { path: 'list', element: <ResourceListPage /> },
                        { path: 'new', element: <ResourceCreatePage /> },
                        { path: ':name/edit', element: <ResourceEditPage /> },
                    ],
                },
                {
                    path: 'vehicle',
                    children: [
                        { element: <Navigate to="/dashboard/vehicle/list" replace />, index: true },
                        { path: 'list', element: <VehicleListPage /> },
                        { path: 'new', element: <VehicleCreatePage /> },
                        { path: ':name/edit', element: <VehicleEditPage /> },
                    ],
                },
                {
                    path: 'reference',
                    children: [
                        { element: <Navigate to="/dashboard/reference/list" replace />, index: true },
                        { path: 'list', element: <ReferenceListPage /> },
                        { path: 'new', element: <ReferenceCreatePage /> },
                        { path: ':name/edit', element: <ReferenceEditPage /> },
                    ],
                },
                {
                    path: 'test',
                    children: [
                        { element: <Navigate to="/dashboard/test/list" replace />, index: true },
                        { path: 'list', element: <TestListPage /> },
                        { path: 'new', element: <TestCreatePage /> },
                        { path: ':name/test-workflow', element: <TestWorkflowPage /> },
                    ],
                },

            ]

        },
        {
            element: <CompactLayout />,
            children: [
                { path: '404', element: <Page404 /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },

    ])
}
