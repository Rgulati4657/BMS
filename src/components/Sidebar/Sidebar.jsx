// import React from 'react';
// import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
// import { NavLink } from 'react-router-dom';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import ViewListIcon from '@mui/icons-material/ViewList';
// import BackupTableIcon from '@mui/icons-material/BackupTable';

// const navItems = [
//   { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
//   { text: 'Upload Banner', icon: <CloudUploadIcon />, path: '/upload-banner' },
//   { text: 'Banner List', icon: <ViewListIcon />, path: '/banner-list' },
//   { text: 'Bulk Upload', icon: <BackupTableIcon />, path: '/bulk-upload' },
// ];

// const Sidebar = () => {
//   const navLinkStyles = ({ isActive }) => ({
//     display: 'flex',
//     width: '100%',
//     textDecoration: 'none',
//     color: 'inherit',
//     backgroundColor: isActive ? 'action.selected' : 'transparent',
//     borderRadius: '8px',
//   });

//   return (
//     <Box sx={{ width: 260, height: '100vh', borderRight: '1px solid', borderColor: 'divider', p: 2 }}>
//       <Typography variant="h5" sx={{ p: 2, fontWeight: 'bold' }}>
//         Banner CMS
//       </Typography>
//       <Divider sx={{ mb: 2 }}/>
//       <List>
//         {navItems.map((item) => (
//           <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
//             <NavLink to={item.path} style={navLinkStyles}>
//               <ListItemButton sx={{ borderRadius: '8px' }}>
//                 <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.text} />
//               </ListItemButton>
//             </NavLink>
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// };

// export default Sidebar;

import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ViewListIcon from '@mui/icons-material/ViewList';
import BackupTableIcon from '@mui/icons-material/BackupTable';
// --- NEW: Import the icon for the tracker ---
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

// --- MODIFIED: Added Upload Tracker to the nav items array ---
const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Upload Banner', icon: <CloudUploadIcon />, path: '/upload-banner' },
  { text: 'Banner List', icon: <ViewListIcon />, path: '/banner-list' },
  { text: 'Bulk Upload', icon: <BackupTableIcon />, path: '/bulk-upload' },
  { text: 'Upload Tracker', icon: <TrackChangesIcon />, path: '/upload-tracker' },
];

const Sidebar = () => {
  const navLinkStyles = ({ isActive }) => ({
    display: 'flex',
    width: '100%',
    textDecoration: 'none',
    color: 'inherit',
    backgroundColor: isActive ? 'action.selected' : 'transparent',
    borderRadius: '8px',
  });

  return (
    <Box sx={{ width: 260, flexShrink: 0, height: '100vh', borderRight: '1px solid', borderColor: 'divider', p: 2 }}>
      <Typography variant="h5" sx={{ p: 2, fontWeight: 'bold' }}>
        Banner CMS
      </Typography>
      <Divider sx={{ mb: 2 }}/>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <NavLink to={item.path} style={navLinkStyles}>
              <ListItemButton sx={{ borderRadius: '8px' }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;