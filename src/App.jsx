// i18n
import './locales/i18n';
// router
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import routes from './routes';
import getRoutes from './_helpers/RoutesGetter';
import Router from './routes';
import { AuthProvider } from './auth/JwtContext';
// redux
import { store, persistor } from './redux/store';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import SnackbarProvider from './components/snackbar';
import { MotionLazyContainer } from './components/animate';
import { Snackbar } from '@mui/material';
import ScrollToTop from './components/scroll-to-top';
// theme
import ThemeProvider from './theme';
//setting 
import { ThemeSettings, SettingsProvider } from './components/settings';
// error boundary
import { ErrorBoundary } from 'react-error-boundary'
// ErrorFallback
import ErrorFallbackPage from './pages/ErrorFallbackPage';
import Page404 from './pages/Page404';
function App() {

  return (

    <AuthProvider>
      <ReduxProvider store={store}>
        <SettingsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <MotionLazyContainer>
              <ThemeProvider>
                <ThemeSettings>
                  <SnackbarProvider>
                    <ErrorBoundary FallbackComponent={ErrorFallbackPage}>
                      <Router></Router>
                    </ErrorBoundary>
                  </SnackbarProvider>
                </ThemeSettings>
              </ThemeProvider>
            </MotionLazyContainer>
          </BrowserRouter>
        </SettingsProvider>
      </ReduxProvider>
    </AuthProvider>


  );
}

export default App
