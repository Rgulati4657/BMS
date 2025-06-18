

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import RefreshIcon from '@mui/icons-material/Refresh';

// This is a separate component to display the status of a single job
const JobStatusDisplay = ({ jobStatus, serviceUrl }) => {
  if (!jobStatus) {
    return <CircularProgress size={20} />;
  }
  
  const progressPercentage = jobStatus.total_rows > 0 
    ? (jobStatus.processed_rows / jobStatus.total_rows) * 100 
    : 0;

  return (
    <Box sx={{ mt: 2 }}>
      {(jobStatus.status === 'pending' || jobStatus.status === 'processing') && (
        <Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            Status: <strong>{jobStatus.status.toUpperCase()}</strong>. Last updated: {new Date().toLocaleTimeString()}
          </Alert>
          <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
            Progress: {jobStatus.processed_rows || 0} / {jobStatus.total_rows || 'N/A'}
          </Typography>
          <LinearProgress variant="determinate" value={progressPercentage} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">Successful: {jobStatus.successful_rows || 0}</Typography>
              <Typography variant="body2" color="error">Failed: {jobStatus.failed_rows || 0}</Typography>
          </Box>
        </Box>
      )}

      {jobStatus.status === 'completed' && (
          <Alert severity={jobStatus.failed_rows > 0 ? 'warning' : 'success'}>
            <AlertTitle>{jobStatus.failed_rows > 0 ? 'Completed with Errors' : 'Completed Successfully'}</AlertTitle>
            {jobStatus.final_message}
            {jobStatus.error_csv_download_url && (
                <Button
                    variant="outlined"
                    size="small"
                    color="warning"
                    startIcon={<DownloadIcon />}
                    href={`${serviceUrl}${jobStatus.error_csv_download_url}`}
                    sx={{ mt: 2 }}
                >
                    Download Error Report
                </Button>
            )}
        </Alert>
      )}

      {jobStatus.status === 'failed' && (
          <Alert severity="error">
            <AlertTitle>Process Failed</AlertTitle>
            {jobStatus.final_message || 'A critical error occurred on the server.'}
          </Alert>
      )}
    </Box>
  );
};

const UploadTracker = () => {
  const [manualId, setManualId] = useState('');
  const [trackedJobs, setTrackedJobs] = useState({});
  const [recentUploads, setRecentUploads] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  
  const SERVICE_URL = import.meta.env.VITE_BULK_UPLOAD_SERVICE_URL;

  const fetchJobStatus = useCallback(async (uploadId) => {
    setLoadingStates(prev => ({ ...prev, [uploadId]: true }));
    try {
      const { data } = await axios.get(`${SERVICE_URL}/upload-status/${uploadId}`);
      setTrackedJobs(prev => ({ ...prev, [uploadId]: data }));
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Could not find or access job ${uploadId}.`;
      setTrackedJobs(prev => ({ ...prev, [uploadId]: { status: 'failed', final_message: errorMessage } }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [uploadId]: false }));
    }
  }, [SERVICE_URL]);

  useEffect(() => {
    const storedUploads = JSON.parse(localStorage.getItem('recentUploads') || '[]');
    setRecentUploads(storedUploads);
    storedUploads.forEach(id => fetchJobStatus(id));
  }, [fetchJobStatus]);

  useEffect(() => {
    const pollingIntervals = {};
    Object.entries(trackedJobs).forEach(([id, status]) => {
      if (status && ['pending', 'processing'].includes(status.status)) {
        pollingIntervals[id] = setInterval(() => fetchJobStatus(id), 5000);
      }
    });
    return () => {
      Object.values(pollingIntervals).forEach(clearInterval);
    };
  }, [trackedJobs, fetchJobStatus]);

  const handleManualTrack = () => {
    if (manualId.trim()) {
      const newId = manualId.trim();
      if (!recentUploads.includes(newId)) {
        const updatedUploads = [newId, ...recentUploads].slice(0, 5);
        setRecentUploads(updatedUploads);
        localStorage.setItem('recentUploads', JSON.stringify(updatedUploads));
      }
      fetchJobStatus(newId);
      setManualId('');
    }
  };

  const refreshAll = () => {
    const storedUploads = JSON.parse(localStorage.getItem('recentUploads') || '[]');
    setRecentUploads(storedUploads);
    storedUploads.forEach(id => fetchJobStatus(id));
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>Upload Status Tracker</Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Track a New Upload</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth label="Enter Tracking ID (upload_id)" value={manualId}
              onChange={(e) => setManualId(e.target.value)} size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button fullWidth variant="contained" onClick={handleManualTrack} startIcon={<TravelExploreIcon />} disabled={!manualId.trim()}>
              Track
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>Recent Uploads</Typography>
        <IconButton onClick={refreshAll} color="primary">
            <Tooltip title="Refresh All Statuses"><RefreshIcon /></Tooltip>
        </IconButton>
      </Box>

      {recentUploads.length === 0 ? (
        <Typography color="text.secondary">No recent uploads found. Start a new bulk upload to see its status here.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {recentUploads.map(id => (
            <Paper key={id} variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" component="div">
                  Tracking ID: <Typography component="span" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{id}</Typography>
                </Typography>
                {loadingStates[id] && <CircularProgress size={20} />}
              </Box>
              <JobStatusDisplay jobStatus={trackedJobs[id]} serviceUrl={SERVICE_URL} />
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default UploadTracker;