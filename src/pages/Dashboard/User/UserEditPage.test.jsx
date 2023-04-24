import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import UserEditPage from './UserEditPage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('UserEditPage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <UserEditPage></UserEditPage>
            </MemoryRouter>
        </SnackbarProvider>)


    })
})