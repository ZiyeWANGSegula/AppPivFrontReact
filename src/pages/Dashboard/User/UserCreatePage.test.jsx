import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react'
import UserCreatePage from './UserCreatePage';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack"

describe('UserCreatePage', () => {
    test('renders', () => {
        
        render(
        <SnackbarProvider>
            <MemoryRouter>
                <UserCreatePage></UserCreatePage>
            </MemoryRouter>
        </SnackbarProvider>)
    })
})