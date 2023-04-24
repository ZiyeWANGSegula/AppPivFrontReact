import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import ResourceListPage from './ResourceListPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('ResourceEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <ResourceListPage></ResourceListPage>
            </MemoryRouter>
        </SnackbarProvider>)

    })
})