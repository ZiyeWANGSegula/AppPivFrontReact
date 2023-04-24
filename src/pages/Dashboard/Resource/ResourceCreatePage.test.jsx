import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import ResourceCreatePage from './ResourceCreatePage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('ResourceCreatePage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <ResourceCreatePage></ResourceCreatePage>
            </MemoryRouter>
        </SnackbarProvider>)
    })
})