import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import TestCreatePage from './TestCreatePage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('TestCreatePage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <TestCreatePage></TestCreatePage>
            </MemoryRouter>
        </SnackbarProvider>)
    })
})