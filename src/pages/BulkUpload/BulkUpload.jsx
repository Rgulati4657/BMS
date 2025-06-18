
// import React, { useState } from 'react';
// import axios from 'axios';
// import JSZip from 'jszip';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   styled,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   LinearProgress,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import ErrorIcon from '@mui/icons-material/Error';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1, overflow: 'hidden',
//   position: 'absolute', bottom: 0, left: 0, whiteSpace: 'nowrap', width: 1,
// });

// const BulkUpload = () => {
//   const [zipFile, setZipFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isValidating, setIsValidating] = useState(false);
//   const [jobStatus, setJobStatus] = useState(null);
  
//   const API_BASE_URL = import.meta.env.BULK_UPLOAD_URL;

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.name.toLowerCase().endsWith('.zip')) {
//       setZipFile(file);
//       setJobStatus(null);
//     } else {
//       alert('Please select a valid .zip file.');
//       event.target.value = null; 
//     }
//   };

//   // --- THIS IS THE DEFINITIVE, CORRECTED VALIDATION FUNCTION ---
//   const validateZipStructure = async (file) => {
//     try {
//       console.log("--- Starting ZIP Validation ---");
//       const zip = await JSZip.loadAsync(file);
      
//       // Step 1: Find metadata.csv anywhere in the zip.
//       // This regex finds a file that either is metadata.csv or is inside one folder.
//       const metadataFileArray = zip.file(/^([^/]+\/)?metadata\.csv$/i);
      
//       if (metadataFileArray.length === 0) {
//         const message = "Validation Failed: Could not find 'metadata.csv' at the root or inside a single parent folder.";
//         console.error(message);
//         return { isValid: false, message };
//       }

//       // Step 2: Determine the base path from where metadata.csv was found.
//       const metadataFullPath = metadataFileArray[0].name; // e.g., "MyCampaign/metadata.csv" or "metadata.csv"
//       const lastSlashIndex = metadataFullPath.lastIndexOf('/');
//       const basePath = lastSlashIndex !== -1 ? metadataFullPath.substring(0, lastSlashIndex + 1) : ""; // e.g., "MyCampaign/" or ""
      
//       console.log(`Validation: Found 'metadata.csv' at path: '${metadataFullPath}'. Deduced base path: '${basePath}'`);
      
//       // Step 3: Use the determined basePath to check for the 'Data' folder at the same level.
//       const dataFolderPath = basePath + 'Data/';
//       if (!zip.files[dataFolderPath] || !zip.files[dataFolderPath].dir) {
//         const message = `Validation Failed: A folder named 'Data' was not found at the path '${dataFolderPath}'. It must be at the same level as 'metadata.csv'.`;
//         console.error(message);
//         return { isValid: false, message };
//       }
      
//       console.log(`Validation PASS: Found 'Data/' folder at the correct path: '${dataFolderPath}'`);
      
//       // Step 4: Check if the 'Data' folder contains any files.
//       const filesInDataFolder = Object.keys(zip.files).filter(name => name.startsWith(dataFolderPath) && name !== dataFolderPath);
//       if (filesInDataFolder.length === 0) {
//         const message = "Validation Failed: The 'Data' folder cannot be empty.";
//         console.error(message);
//         return { isValid: false, message };
//       }

//       console.log("%c--- All Validations Passed ---", "color: green; font-weight: bold;");
//       return { isValid: true };

//     } catch (error) {
//       const message = 'The selected file is corrupted or not a valid ZIP file.';
//       console.error("Validation FAIL:", error);
//       return { isValid: false, message };
//     }
//   };

//   const handleUpload = async () => {
//     if (!zipFile) return;
//     setIsValidating(true);
//     setJobStatus(null);
    
//     const validationResult = await validateZipStructure(zipFile);
    
//     if (!validationResult.isValid) {
//       setJobStatus({ status: 'failed', message: validationResult.message });
//       setIsValidating(false);
//       return; // STOP.
//     }

//     setIsValidating(false);
//     setIsUploading(true);
//     setJobStatus({ status: 'uploading' });
//     const token = localStorage.getItem('authToken');
//     const uploadData = new FormData();
//     uploadData.append('file', zipFile);

//     try {
//       const { data } = await axios.post(`${API_BASE_URL}/api/bulk-upload`, uploadData, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       pollJobStatus(data.jobId);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to start the bulk upload process.';
//       setJobStatus({ status: 'failed', message: errorMessage });
//       setIsUploading(false);
//     }
//   };

//   const pollJobStatus = (jobId) => {
//     const token = localStorage.getItem('authToken');
//     const intervalId = setInterval(async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE_URL}/api/banners/bulk-upload/status/${jobId}`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         setJobStatus(data);
//         if (['completed', 'failed', 'completed_with_errors'].includes(data.status)) {
//           clearInterval(intervalId);
//           setIsUploading(false);
//         }
//       } catch (error) {
//         setJobStatus({ status: 'failed', message: 'Could not retrieve job status.' });
//         clearInterval(intervalId);
//         setIsUploading(false);
//       }
//     }, 3000);
//   };
  
//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Bulk Banner Upload</Typography>
      
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
//         Create a folder, place `metadata.csv` and a `Data` folder inside, then zip the parent folder.
//       </Typography>
//       <Paper component="pre" variant="outlined" sx={{ p: 2, mb: 4, bgcolor: 'grey.100', overflowX: 'auto', fontSize: '0.875rem', lineHeight: 1.6 }}>
//         {`MyCampaign.zip
// |
// └── MyCampaign/      (Your parent folder)
//     |
//     ├── metadata.csv  (Required)
//     |
//     └── Data/         (Required Folder)
//         |
//         ├── banner1.zip
//         └── banner2.zip
//         ...etc`}
//       </Paper>
      
//       <Box sx={{ p: 4, border: '2px dashed', borderColor: 'grey.400', borderRadius: 2, textAlign: 'center', mb: 3 }}>
//         <CloudUploadIcon sx={{ fontSize: 60, color: 'grey.500' }} />
//         <Typography variant="h6" gutterBottom>{zipFile ? `Selected File: ${zipFile.name}` : 'Drag & drop your master .zip file here'}</Typography>
//         <Typography color="text.secondary">or</Typography>
//         <Button component="label" variant="contained" sx={{ mt: 2 }}>
//           Browse Master ZIP File
//           <VisuallyHiddenInput type="file" accept=".zip,application/zip,application/x-zip-compressed" onChange={handleFileChange} />
//         </Button>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Button variant="contained" size="large" onClick={handleUpload} disabled={!zipFile || isUploading || isValidating} startIcon={(isUploading || isValidating) ? <CircularProgress size={20} color="inherit" /> : null}>
//           {isValidating ? 'Validating...' : (isUploading ? 'Processing...' : 'Upload & Process')}
//         </Button>
//       </Box>

//       {jobStatus && (
//         <Box sx={{ mt: 4 }}>
//           <Divider sx={{ mb: 3 }} /><Typography variant="h5" gutterBottom>Processing Status</Typography>
//           {jobStatus.status === 'uploading' && <Alert severity="info">Validation successful. Uploading file to the server...</Alert>}
//           {(jobStatus.status === 'pending' || jobStatus.status === 'processing') && ( <Box><Alert severity="info" sx={{ mb: 2 }}>File received. Banners are now being processed on the server.</Alert><Typography sx={{ mb: 1 }}>Progress: {jobStatus.progress || 0} / {jobStatus.total || 'N/A'} banners processed.</Typography><LinearProgress variant="determinate" value={jobStatus.total ? (jobStatus.progress / jobStatus.total) * 100 : 0} /></Box>)}
//           {jobStatus.status === 'completed' && (<Alert severity="success"><AlertTitle>Success</AlertTitle>Bulk upload completed successfully. All {jobStatus.total} banners were processed.</Alert>)}
//           {jobStatus.status === 'completed_with_errors' && (<Alert severity="warning"><AlertTitle>Completed with Errors</AlertTitle>The process finished, but some banners could not be created.<List dense>{jobStatus.errors?.map((err, index) => (<ListItem key={index}><ListItemIcon sx={{minWidth: 32}}><ErrorIcon color="warning"/></ListItemIcon><ListItemText primary={`Row ${err.row}: ${err.error}`} /></ListItem>))}</List></Alert>)}
//           {jobStatus.status === 'failed' && (<Alert severity="error"><AlertTitle>Process Failed</AlertTitle>{jobStatus.message || 'A critical error occurred on the server.'}</Alert>)}
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default BulkUpload;

// perfect 

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   styled,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   LinearProgress,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Link,
//   Tooltip
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import DownloadIcon from '@mui/icons-material/Download';
// import ErrorIcon from '@mui/icons-material/Error';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1, overflow: 'hidden',
//   position: 'absolute', bottom: 0, left: 0, whiteSpace: 'nowrap', width: 1,
// });

// const BulkUpload = () => {
//   const [zipFile, setZipFile] = useState(null);
//   const [uploadId, setUploadId] = useState(null); // To store the job ID from the backend
//   const [jobStatus, setJobStatus] = useState(null); // To store the full status object from the backend
//   const [isSubmitting, setIsSubmitting] = useState(false); // General loading state for upload + polling
  
//   const SERVICE_URL = import.meta.env.VITE_BULK_UPLOAD_SERVICE_URL;

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.name.toLowerCase().endsWith('.zip')) {
//       setZipFile(file);
//       // Reset state when a new file is selected
//       setUploadId(null);
//       setJobStatus(null);
//     } else {
//       alert('Please select a valid .zip file.');
//       event.target.value = null; 
//     }
//   };

//   const handleUpload = async () => {
//     if (!zipFile) return;

//     setIsSubmitting(true);
//     setJobStatus({ status: 'uploading' }); // Initial local status for UI feedback
//     const uploadData = new FormData();
//     uploadData.append('file', zipFile);

//     try {
//       const { data } = await axios.post(`${SERVICE_URL}/bulk-upload`, uploadData);
//       setUploadId(data.upload_id); // Store the ID to start polling
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Failed to start the bulk upload process.';
//       setJobStatus({ status: 'failed', final_message: errorMessage });
//       setIsSubmitting(false);
//     }
//   };

//   // This useEffect hook handles the status polling
//   useEffect(() => {
//     let intervalId;
//     // Start polling only if we have an uploadId and the job is not yet finished.
//     if (uploadId && !['completed', 'failed'].includes(jobStatus?.status)) {
//       intervalId = setInterval(async () => {
//         try {
//           const { data } = await axios.get(`${SERVICE_URL}/upload-status/${uploadId}`);
//           setJobStatus(data); // Update the UI with the latest progress

//           // Stop polling if the job is finished
//           if (['completed', 'failed'].includes(data.status)) {
//             clearInterval(intervalId);
//             setIsSubmitting(false);
//           }
//         } catch (error) {
//           console.error("Polling error:", error);
//           const errorMessage = error.response?.data?.error || 'Could not retrieve job status.';
//           setJobStatus({ status: 'failed', final_message: errorMessage });
//           clearInterval(intervalId);
//           setIsSubmitting(false);
//         }
//       }, 5000); // Poll every 5 seconds as recommended
//     }

//     // Cleanup function to stop polling when the component unmounts or dependencies change
//     return () => clearInterval(intervalId);
//   }, [uploadId, jobStatus?.status, SERVICE_URL]);
  
//   const progressPercentage = jobStatus?.total_rows > 0 
//     ? (jobStatus.processed_rows / jobStatus.total_rows) * 100 
//     : 0;

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Bulk Banner Upload</Typography>
      
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
//         Upload a master .zip file with the required structure.
//       </Typography>
//       <Paper component="pre" variant="outlined" sx={{ p: 2, mb: 4, bgcolor: 'grey.100', overflowX: 'auto', fontSize: '0.875rem', lineHeight: 1.6 }}>
//         {`MyCampaign.zip
// |
// ├── metadata.csv
// |
// └── Data/
//     |
//     ├── banner1.zip
//     |
//     └── banner2.zip
//     ...etc`}
//       </Paper>
      
//       <Box sx={{ p: 4, border: '2px dashed', borderColor: 'grey.400', borderRadius: 2, textAlign: 'center', mb: 3 }}>
//         <CloudUploadIcon sx={{ fontSize: 60, color: 'grey.500' }} />
//         <Typography variant="h6" gutterBottom>{zipFile ? `Selected File: ${zipFile.name}` : 'Drag & drop a .zip file here'}</Typography>
//         <Typography color="text.secondary">or</Typography>
//         <Button component="label" variant="contained" sx={{ mt: 2 }} disabled={isSubmitting}>
//           Browse Master ZIP File
//           <VisuallyHiddenInput type="file" accept=".zip" onChange={handleFileChange} />
//         </Button>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Button
//           variant="contained"
//           size="large"
//           onClick={handleUpload}
//           disabled={!zipFile || isSubmitting}
//           startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
//         >
//           {jobStatus?.status === 'uploading' ? 'Uploading...' : 'Upload & Process'}
//         </Button>
//       </Box>

//       {jobStatus && (
//         <Box sx={{ mt: 4 }}>
//           <Divider sx={{ mb: 3 }} /><Typography variant="h5" gutterBottom>Processing Status</Typography>
          
//           {jobStatus.status === 'uploading' && <Alert severity="info">Uploading file to the server...</Alert>}
          
//           {(jobStatus.status === 'pending' || jobStatus.status === 'processing') && (
//             <Box>
//               <Alert severity="info" sx={{ mb: 2 }}>
//                 File received. Banners are now being processed on the server. Please wait.
//               </Alert>
//               <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
//                 Progress: {jobStatus.processed_rows || 0} / {jobStatus.total_rows || 'N/A'}
//               </Typography>
//               <LinearProgress variant="determinate" value={progressPercentage} />
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
//                  <Typography variant="body2" color="text.secondary">Successful: {jobStatus.successful_rows || 0}</Typography>
//                  <Typography variant="body2" color="error">Failed: {jobStatus.failed_rows || 0}</Typography>
//               </Box>
//             </Box>
//           )}

//           {jobStatus.status === 'completed' && (
//              <Alert severity={jobStatus.failed_rows > 0 ? 'warning' : 'success'}>
//                 <AlertTitle>{jobStatus.failed_rows > 0 ? 'Completed with Errors' : 'Success'}</AlertTitle>
//                 {jobStatus.final_message}
//                 {jobStatus.error_csv_download_url && (
//                     <Button
//                         variant="outlined"
//                         size="small"
//                         color="warning"
//                         startIcon={<DownloadIcon />}
//                         href={`${SERVICE_URL}${jobStatus.error_csv_download_url}`}
//                         sx={{ mt: 2 }}
//                     >
//                         Download Error Report
//                     </Button>
//                 )}
//             </Alert>
//           )}

//           {jobStatus.status === 'failed' && (
//              <Alert severity="error">
//                 <AlertTitle>Process Failed</AlertTitle>
//                 {jobStatus.final_message || 'A critical error occurred on the server.'}
//              </Alert>
//           )}
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default BulkUpload;


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


// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   styled,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   Link,
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import TrackChangesIcon from '@mui/icons-material/TrackChanges';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1, overflow: 'hidden',
//   position: 'absolute', bottom: 0, left: 0, whiteSpace: 'nowrap', width: 1,
// });

// const BulkUpload = () => {
//   const [zipFile, setZipFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadResult, setUploadResult] = useState({ message: '', type: '', uploadId: null });
  
//   const SERVICE_URL = import.meta.env.VITE_BULK_UPLOAD_SERVICE_URL;

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.name.toLowerCase().endsWith('.zip')) {
//       setZipFile(file);
//       setUploadResult({ message: '', type: '', uploadId: null });
//     } else {
//       alert('Please select a valid .zip file.');
//       event.target.value = null; 
//     }
//   };

//   const handleUpload = async () => {
//     if (!zipFile) return;

//     setIsUploading(true);
//     setUploadResult({ message: '', type: '' });
//     const uploadData = new FormData();
//     uploadData.append('file', zipFile);

//     try {
//       const { data } = await axios.post(`${SERVICE_URL}/bulk-upload`, uploadData);
      
//       // Save the new upload ID to localStorage for the tracker page
//       const recentUploads = JSON.parse(localStorage.getItem('recentUploads') || '[]');
//       const updatedUploads = [data.upload_id, ...recentUploads.filter(id => id !== data.upload_id)].slice(0, 5); // Keep last 5
//       localStorage.setItem('recentUploads', JSON.stringify(updatedUploads));

//       setUploadResult({ 
//         message: 'Upload started successfully! You can now monitor its progress on the Upload Tracker page.',
//         type: 'success',
//         uploadId: data.upload_id
//       });
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Failed to start the bulk upload process.';
//       setUploadResult({ message: errorMessage, type: 'error', uploadId: null });
//     } finally {
//       setIsUploading(false);
//     }
//   };
  
//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Bulk Banner Upload</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
//         Upload a master .zip file containing a `metadata.csv` and a `Data` folder with the following structure:
//       </Typography>
      
//       {/* START: Added Structure Layout */}
//       <Box
//         component="pre"
//         sx={{
//           p: 2,
//           mb: 4,
//           bgcolor: 'grey.100',
//           border: '1px solid',
//           borderColor: 'grey.300',
//           borderRadius: 1,
//           whiteSpace: 'pre-wrap',
//           wordBreak: 'break-all',
//           fontFamily: 'monospace',
//           fontSize: '0.875rem',
//         }}
//       >
// {`master_upload.zip
// ├── metadata.csv
// └── Data/
//     ├── banner_creative_1.zip
//     ├── banner_creative_2.zip
//     └── ...etc`}
//       </Box>
//       {/* END: Added Structure Layout */}
      
//       <Box sx={{ p: 4, border: '2px dashed', borderColor: 'grey.400', borderRadius: 2, textAlign: 'center', mb: 3 }}>
//         <CloudUploadIcon sx={{ fontSize: 60, color: 'grey.500' }} />
//         <Typography variant="h6" gutterBottom>{zipFile ? `Selected File: ${zipFile.name}` : 'Drag & drop a .zip file here'}</Typography>
//         <Typography color="text.secondary">or</Typography>
//         <Button component="label" variant="contained" sx={{ mt: 2 }} disabled={isUploading}>
//           Browse Master ZIP File
//           <VisuallyHiddenInput type="file" accept=".zip" onChange={handleFileChange} />
//         </Button>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Button variant="contained" size="large" onClick={handleUpload} disabled={!zipFile || isUploading} startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}>
//           {isUploading ? 'Uploading...' : 'Upload & Start Processing'}
//         </Button>
//       </Box>

//       {uploadResult.message && (
//         <Alert severity={uploadResult.type} sx={{ mt: 3 }}>
//           <AlertTitle>{uploadResult.type === 'success' ? 'Processing Started' : 'Error'}</AlertTitle>
//           {uploadResult.message}
//           {uploadResult.uploadId && (
//             <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
//               Tracking ID: {uploadResult.uploadId}
//             </Typography>
//           )}
//           {/* You can add a Link component here to navigate to your new tracker page */}
//           {/* <Button component={Link} to="/upload-tracker" startIcon={<TrackChangesIcon/>} sx={{mt: 1}}>Go to Tracker</Button> */}
//         </Alert>
//       )}
//     </Paper>
//   );
// };

// export default BulkUpload;



// working 
// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   styled,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   Link,
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import TrackChangesIcon from '@mui/icons-material/TrackChanges';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1, overflow: 'hidden',
//   position: 'absolute', bottom: 0, left: 0, whiteSpace: 'nowrap', width: 1,
// });

// const BulkUpload = () => {
//   const [zipFile, setZipFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadResult, setUploadResult] = useState({ message: '', type: '', uploadId: null });
  
//   const SERVICE_URL = import.meta.env.VITE_BULK_UPLOAD_SERVICE_URL;

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.name.toLowerCase().endsWith('.zip')) {
//       setZipFile(file);
//       setUploadResult({ message: '', type: '', uploadId: null });
//     } else {
//       alert('Please select a valid .zip file.');
//       event.target.value = null; 
//     }
//   };

//   const handleUpload = async () => {
//     if (!zipFile) return;

//     setIsUploading(true);
//     setUploadResult({ message: '', type: '' });
//     const uploadData = new FormData();
//     uploadData.append('file', zipFile);

//     try {
//       const { data } = await axios.post(`${SERVICE_URL}/bulk-upload`, uploadData);
      
//       // Save the new upload ID to localStorage for the tracker page
//       const recentUploads = JSON.parse(localStorage.getItem('recentUploads') || '[]');
//       const updatedUploads = [data.upload_id, ...recentUploads.filter(id => id !== data.upload_id)].slice(0, 5); // Keep last 5
//       localStorage.setItem('recentUploads', JSON.stringify(updatedUploads));

//       setUploadResult({ 
//         message: 'Upload started successfully! You can now monitor its progress on the Upload Tracker page.',
//         type: 'success',
//         uploadId: data.upload_id
//       });
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Failed to start the bulk upload process.';
//       setUploadResult({ message: errorMessage, type: 'error', uploadId: null });
//     } finally {
//       setIsUploading(false);
//     }
//   };
  
//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Bulk Banner Upload</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//         Upload a master .zip file containing a `metadata.csv` and a `Data` folder.
//       </Typography>
      
//       <Box sx={{ p: 4, border: '2px dashed', borderColor: 'grey.400', borderRadius: 2, textAlign: 'center', mb: 3 }}>
//         <CloudUploadIcon sx={{ fontSize: 60, color: 'grey.500' }} />
//         <Typography variant="h6" gutterBottom>{zipFile ? `Selected File: ${zipFile.name}` : 'Drag & drop a .zip file here'}</Typography>
//         <Typography color="text.secondary">or</Typography>
//         <Button component="label" variant="contained" sx={{ mt: 2 }} disabled={isUploading}>
//           Browse Master ZIP File
//           <VisuallyHiddenInput type="file" accept=".zip" onChange={handleFileChange} />
//         </Button>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Button variant="contained" size="large" onClick={handleUpload} disabled={!zipFile || isUploading} startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}>
//           {isUploading ? 'Uploading...' : 'Upload & Start Processing'}
//         </Button>
//       </Box>

//       {uploadResult.message && (
//         <Alert severity={uploadResult.type} sx={{ mt: 3 }}>
//           <AlertTitle>{uploadResult.type === 'success' ? 'Processing Started' : 'Error'}</AlertTitle>
//           {uploadResult.message}
//           {uploadResult.uploadId && (
//             <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
//               Tracking ID: {uploadResult.uploadId}
//             </Typography>
//           )}
//           {/* You can add a Link component here to navigate to your new tracker page */}
//           {/* <Button component={Link} to="/upload-tracker" startIcon={<TrackChangesIcon/>} sx={{mt: 1}}>Go to Tracker</Button> */}
//         </Alert>
//       )}
//     </Paper>
//   );
// };

// export default BulkUpload;