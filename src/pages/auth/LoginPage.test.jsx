import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../../auth/JwtContext'
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage'
import '@testing-library/jest-dom'

it('should have a username and password field, also a submit button', () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <LoginPage></LoginPage>
            </MemoryRouter>
        </AuthProvider>
    )
    const usernameField = screen.getByLabelText(/username/i)
    const password = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: 'Login' })

    expect(usernameField).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
})

