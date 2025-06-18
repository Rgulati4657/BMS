import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create a context for the theme
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// This component will provide the theme and the toggle function to its children
export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light'); // Default to light mode

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                primary: { main: '#6366F1' }, // A professional indigo
                background: { default: '#F9FAFB', paper: '#FFFFFF' },
                text: { primary: '#1F2937', secondary: '#6B7280' },
              }
            : {
                // Dark mode palette
                primary: { main: '#818CF8' },
                background: { default: '#111827', paper: '#1F2937' },
                text: { primary: '#F9FAFB', secondary: '#9CA3AF' },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
        },
        shape: {
          borderRadius: 12, // More rounded corners for a modern look
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalizes styles and applies background color */}
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};