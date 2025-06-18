import React, { useContext } from 'react';
import { Box, IconButton, Tooltip, Avatar } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom'; // <-- CRITICAL: Outlet is imported here
import Sidebar from '@/components/Sidebar/Sidebar.jsx'; // Make sure this path is correct
import { ColorModeContext } from '@/contexts/ThemeContext.jsx'; // Make sure this path is correct
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';

const DashboardLayout = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login'); // Redirect to your login page
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* The Sidebar is part of the layout */}
      <Sidebar />
      
      {/* The Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: '100vh', overflow: 'auto' }}>
        
        {/* The Top Bar with theme toggle and user avatar */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
          <Tooltip title="Toggle light/dark theme">
            <IconButton sx={{ mr: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          <Avatar sx={{ ml: 2, bgcolor: 'primary.main' }}>U</Avatar>
        </Box>
        
        {/* --- THIS IS THE MOST IMPORTANT LINE --- */}
        {/* This is the placeholder where React Router will render the correct page */}
        {/* (Dashboard, BannerList, UploadTracker, etc.) based on the URL. */}
        <Outlet />

      </Box>
    </Box>
  );
};

export default DashboardLayout;