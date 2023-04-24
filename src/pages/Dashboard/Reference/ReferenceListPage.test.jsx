import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import ReferenceListPage from './ReferenceListPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('ReferenceEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <ReferenceListPage></ReferenceListPage>
            </MemoryRouter>
        </SnackbarProvider>)

        //const newRefernceButton = screen.getByRole('button', { name: "New Reference" })
        expect(screen.getByLabelText(/dense/i)).toBeDefined();
        expect(screen.getByLabelText(/start date/i)).toBeDefined();
        expect(screen.getByLabelText(/end date/i)).toBeDefined();
        expect(screen.getByLabelText(/duration/i)).toBeDefined();
        //expect(newRefernceButton).toBeDefined()

    })
})