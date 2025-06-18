import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppThemeProvider } from './contexts/ThemeContext.jsx'; // Import our provider
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppThemeProvider> {/* Wrap the entire app */}
        <App />
      </AppThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);