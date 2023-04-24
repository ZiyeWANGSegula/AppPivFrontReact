import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import ReferenceEditPage from './ReferenceEditPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('ReferenceEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <ReferenceEditPage></ReferenceEditPage>
            </MemoryRouter>
        </SnackbarProvider>)

        const saveChangesButton = screen.getByRole('button', { name: 'Save Changes' })
        expect(screen.getByLabelText(/name/i)).toBeDefined();
        expect(screen.getByLabelText(/Referent/i)).toBeDefined();
        expect(screen.getByLabelText(/duration/i)).toBeDefined();
        expect(screen.getByLabelText(/customer/i)).toBeDefined();
        expect(screen.getByLabelText(/resource/i)).toBeDefined();
        expect(saveChangesButton).toBeDefined()

    })
})