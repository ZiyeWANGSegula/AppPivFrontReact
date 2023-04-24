import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import VehicleCreatePage from './VehicleCreatePage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('VehicleCreatePage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <VehicleCreatePage></VehicleCreatePage>
            </MemoryRouter>
        </SnackbarProvider>)
    })
})