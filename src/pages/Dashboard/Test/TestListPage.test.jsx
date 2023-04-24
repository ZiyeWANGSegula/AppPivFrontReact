import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import TestListPage from './TestListPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('TestListPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <TestListPage></TestListPage>
            </MemoryRouter>
        </SnackbarProvider>)

    })
})