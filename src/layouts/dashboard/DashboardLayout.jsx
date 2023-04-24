import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { useSettingsContext } from '../../components/settings';
//Hook state system
import { useHookstate, hookstate } from '@hookstate/core';

import Main from './Main';
import Header from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
import NavHorizontal from './nav/NavHorizontal';
import { referenceService } from '../../_services/reference.service';
import { vehicleService } from '../../_services/vehicle.service';
import { resourceService } from '../../_services/resource.service';
export default function DashboardLayout() {

    const [open, setOpen] = useState(false);

    const { themeLayout } = useSettingsContext();

    const isDesktop = useResponsive('up', 'lg');

    const isNavHorizontal = themeLayout === 'horizontal';

    const isNavMini = themeLayout === 'mini';


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} />;


    if (isNavHorizontal) {
        return (
            <>
                <Header onOpenNav={handleOpen} />

                {isDesktop ? <NavHorizontal /> : renderNavVertical}

                <Main>
                    <Outlet />
                </Main>
            </>
        );
    }

    if (isNavMini) {
        return (
            <>
                <Header onOpenNav={handleOpen} />

                <Box
                    sx={{
                        display: { lg: 'flex' },
                        minHeight: { lg: 1 },
                    }}
                >
                    {isDesktop ? <NavMini /> : renderNavVertical}

                    <Main>
                        <Outlet />
                    </Main>
                </Box>
            </>
        );
    }
    return (
        <>
            <Header onOpenNav={handleOpen} />

            <Box
                sx={{
                    display: { lg: 'flex' },
                    minHeight: { lg: 1 },
                }}
            >
                {renderNavVertical}

                <Main>
                    <Outlet />
                </Main>
            </Box>
        </>
    );
}