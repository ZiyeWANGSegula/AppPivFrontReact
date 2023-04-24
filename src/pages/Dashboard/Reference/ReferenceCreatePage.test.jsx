import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import ReferenceCreatePage from './ReferenceCreatePage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('ReferenceCreatePage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <ReferenceCreatePage></ReferenceCreatePage>
            </MemoryRouter>
        </SnackbarProvider>)
        expect(screen.getByText('New Reference')).toBeDefined();
        expect(screen.getByText('Create a new reference')).toBeDefined();
        expect(screen.getByText('Dashboard')).toBeDefined();

    })
})