
import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  styled,
  CircularProgress,
  Alert,
  AlertTitle,
  Link,
  Icon,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
// Import icons for the structure view
import FolderZipIcon from '@mui/icons-material/FolderZip';
import FolderIcon from '@mui/icons-material/Folder';
import TableViewIcon from '@mui/icons-material/TableView';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1, overflow: 'hidden',
  position: 'absolute', bottom: 0, left: 0, whiteSpace: 'nowrap', width: 1,
});

// A small helper component for structure items to avoid repetition
const StructureItem = ({ icon, text, indent = 0 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', pl: indent * 2, mb: 0.5 }}>
    <Icon component={icon} sx={{ mr: 1.5, color: 'text.secondary' }} />
    <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
      {text}
    </Typography>
  </Box>
);


const BulkUpload = () => {
  const [zipFile, setZipFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState({ message: '', type: '', uploadId: null });
  
  const SERVICE_URL = import.meta.env.VITE_BULK_UPLOAD_SERVICE_URL;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setZipFile(file);
      setUploadResult({ message: '', type: '', uploadId: null });
    } else {
      alert('Please select a valid .zip file.');
      event.target.value = null; 
    }
  };

  const handleUpload = async () => {
    if (!zipFile) return;

    setIsUploading(true);
    setUploadResult({ message: '', type: '' });
    const uploadData = new FormData();
    uploadData.append('file', zipFile);

    try {
      const { data } = await axios.post(`${SERVICE_URL}/bulk-upload`, uploadData);
      
      const recentUploads = JSON.parse(localStorage.getItem('recentUploads') || '[]');
      const updatedUploads = [data.upload_id, ...recentUploads.filter(id => id !== data.upload_id)].slice(0, 5);
      localStorage.setItem('recentUploads', JSON.stringify(updatedUploads));

      setUploadResult({ 
        message: 'Upload started successfully! You can now monitor its progress on the Upload Tracker page.',
        type: 'success',
        uploadId: data.upload_id
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to start the bulk upload process.';
      setUploadResult({ message: errorMessage, type: 'error', uploadId: null });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Paper sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>Bulk Banner Upload</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        Upload a master .zip file containing a `metadata.csv` and a `Data` folder with the following structure:
      </Typography>
      
      {/* START: Improved Structure Layout */}
      <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: 'action.hover' }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Required .ZIP Structure
        </Typography>
        <StructureItem icon={FolderZipIcon} text="master_upload.zip" indent={0} />
        <StructureItem icon={TableViewIcon} text="metadata.csv" indent={1} />
        <StructureItem icon={FolderIcon} text="Data/" indent={1} />
        <StructureItem icon={FolderZipIcon} text="banner_creative_1.zip" indent={2} />
        <StructureItem icon={FolderZipIcon} text="banner_creative_2.zip" indent={2} />
        <Box sx={{ pl: 4, mt: 0.5 }}>
            <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                ...etc
            </Typography>
        </Box>
      </Paper>
      {/* END: Improved Structure Layout */}
      
      <Box sx={{ p: 4, border: '2px dashed', borderColor: 'grey.400', borderRadius: 2, textAlign: 'center', mb: 3 }}>
        <CloudUploadIcon sx={{ fontSize: 60, color: 'grey.500' }} />
        <Typography variant="h6" gutterBottom>{zipFile ? `Selected File: ${zipFile.name}` : 'Drag & drop a .zip file here'}</Typography>
        <Typography color="text.secondary">or</Typography>
        <Button component="label" variant="contained" sx={{ mt: 2 }} disabled={isUploading}>
          Browse Master ZIP File
          <VisuallyHiddenInput type="file" accept=".zip" onChange={handleFileChange} />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" onClick={handleUpload} disabled={!zipFile || isUploading} startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}>
          {isUploading ? 'Uploading...' : 'Upload & Start Processing'}
        </Button>
      </Box>

      {uploadResult.message && (
        <Alert severity={uploadResult.type} sx={{ mt: 3 }}>
          <AlertTitle>{uploadResult.type === 'success' ? 'Processing Started' : 'Error'}</AlertTitle>
          {uploadResult.message}
          {uploadResult.uploadId && (
            <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
              Tracking ID: {uploadResult.uploadId}
            </Typography>
          )}
          {/* <Button component={Link} to="/upload-tracker" startIcon={<TrackChangesIcon/>} sx={{mt: 1}}>Go to Tracker</Button> */}
        </Alert>
      )}
    </Paper>
  );
};

export default BulkUpload;

