import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import VehicleListPage from './VehicleListPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('VehicleListPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <VehicleListPage></VehicleListPage>
            </MemoryRouter>
        </SnackbarProvider>)

    })
})