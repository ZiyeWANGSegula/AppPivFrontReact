import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import TestEditPage from './TestEditPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('TestEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <TestEditPage></TestEditPage>
            </MemoryRouter>
        </SnackbarProvider>)


    })
})