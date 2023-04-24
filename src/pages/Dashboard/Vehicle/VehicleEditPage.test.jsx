import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import VehicleEditPage from './VehicleEditPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('VehicleEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <VehicleEditPage></VehicleEditPage>
            </MemoryRouter>
        </SnackbarProvider>)


    })
})