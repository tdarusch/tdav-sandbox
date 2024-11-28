import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
import './app.css'
import { createTheme, ThemeProvider } from '@mui/material'
import { LoadingProvider } from './lib/LoadingContext.jsx'
import { UserProvider } from './lib/UserContext.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <LoadingProvider>
            <UserProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <App />
              </LocalizationProvider>
            </UserProvider>
          </LoadingProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
