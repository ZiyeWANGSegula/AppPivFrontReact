import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import ResourceEditPage from './ResourceEditPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('ResourceEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <ResourceEditPage></ResourceEditPage>
            </MemoryRouter>
        </SnackbarProvider>)


    })
})