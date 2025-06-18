
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// All imports now use the clean '@/' alias
import LoginPage from '@/pages/Login/Login.jsx';
import DashboardLayout from '@/components/Layout/DashboardLayout.jsx';
import Dashboard from '@/pages/Dashboard/Dashboard.jsx';
import BannerUpload from '@/pages/BannerUpload/BannerUpload.jsx';
import BannerList from '@/pages/BannerList/BannerList.jsx';
import BulkUpload from '@/pages/BulkUpload/BulkUpload.jsx';

// --- NEW: Import the UploadTracker component using your path alias ---
import UploadTracker from '@/pages/UploadTracker/UploadTracker.jsx';

// A simple component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* This is your correct main route structure. It will not be changed. */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* All child routes below are correctly rendered inside your layout's <Outlet> */}
        
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload-banner" element={<BannerUpload />} />
        <Route path="banner-list" element={<BannerList />} />
        <Route path="bulk-upload" element={<BulkUpload />} />

        {/* --- THIS IS THE FINAL, CORRECT FIX --- */}
        {/* We are adding the route for the tracker page HERE, inside the protected layout */}
        <Route path="upload-tracker" element={<UploadTracker />} />

      </Route>

      {/* A catch-all route for any other path */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;