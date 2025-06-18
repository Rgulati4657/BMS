

import React from 'react';
import { Box, Grid, Paper, Typography, Icon } from '@mui/material';
import { Link } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ViewListIcon from '@mui/icons-material/ViewList';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import TrackChangesIcon from '@mui/icons-material/TrackChanges'; // <-- Import the new icon

const featureCards = [
  { 
    title: 'Upload Banner', 
    path: '/upload-banner', // Make sure this path matches your router
    icon: <CloudUploadIcon sx={{ fontSize: 40 }}/>, 
    description: 'Add a new individual banner to the system.' 
  },
  { 
    title: 'Banner List', 
    path: '/banner-list', 
    icon: <ViewListIcon sx={{ fontSize: 40 }}/>, 
    description: 'View, edit, and manage all existing banners.' 
  },
  { 
    title: 'Bulk Upload', 
    path: '/bulk-upload', 
    icon: <BackupTableIcon sx={{ fontSize: 40 }}/>, 
    description: 'Upload multiple banners at once using a ZIP file.' 
  },
  // --- NEW: Added the card for the Upload Tracker ---
  { 
    title: 'Upload Tracker', 
    path: '/upload-tracker', // The path for your new page
    icon: <TrackChangesIcon sx={{ fontSize: 40 }}/>, 
    description: 'Monitor the progress of ongoing bulk uploads.' 
  },
];

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome Back!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Select an option below to manage your banners.
      </Typography>
      
      <Grid container spacing={4}>
        {featureCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}> {/* Adjusted md={4} for better spacing if more cards are added */}
            <Paper 
              component={Link} 
              to={card.path}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 200,
                textDecoration: 'none',
                color: 'text.primary',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                }
              }}
            >
              <Box>
                <Icon color="primary" sx={{ mb: 1 }}>{card.icon}</Icon>
                <Typography variant="h6" fontWeight="bold">{card.title}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;