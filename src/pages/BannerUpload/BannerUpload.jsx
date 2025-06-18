// import React, { useState } from 'react';
// import { 
//   Box, 
//   Paper, 
//   Typography, 
//   Stepper, 
//   Step, 
//   StepLabel, 
//   Button, 
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   styled,
//   Icon,
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// // --- Styled Components for the Custom Stepper ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 10,
//     left: 'calc(-50% + 16px)',
//     right: 'calc(50% + 16px)',
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: theme.palette.primary.main,
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: theme.palette.primary.main,
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
//     borderTopWidth: 3,
//     borderRadius: 1,
//   },
// }));

// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
//   display: 'flex',
//   height: 22,
//   alignItems: 'center',
//   ...(ownerState.active && {
//     color: theme.palette.primary.main,
//   }),
//   '& .QontoStepIcon-completedIcon': {
//     color: theme.palette.primary.main,
//     zIndex: 1,
//     fontSize: 24,
//   },
//   '& .QontoStepIcon-circle': {
//     width: 12,
//     height: 12,
//     borderRadius: '50%',
//     backgroundColor: 'currentColor',
//   },
// }));

// function QontoStepIcon(props) {
//   const { active, completed, className } = props;
//   return (
//     <QontoStepIconRoot ownerState={{ active }} className={className}>
//       {completed ? (
//         <Check className="QontoStepIcon-completedIcon" />
//       ) : (
//         <div className="QontoStepIcon-circle" />
//       )}
//     </QontoStepIconRoot>
//   );
// }

// // --- Main Component ---
// const steps = [
//   'Banner Details',
//   'Targeting & Scheduling',
//   'Content & Configuration',
//   'Review & Submit',
// ];

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     client_id: '',
//     pan_id: '',
//     channel: '',
//     language: '',
//     device_type: '',
//     geolocation: '',
//     html_file: null,
//     priority: '',
//     segment_tag: '',
//     status: 'draft',
//     valid_from: '',
//     valid_to: '',
//   });

//   const handleNext = () => {
//     // We would add validation logic here before proceeding
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };
  
//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//     }
//   };
  
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({...formData, [name]: value });
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: // Banner Details
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Channel</InputLabel>
//                 <Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}>
//                   <MenuItem value="netbanking">Net Banking</MenuItem>
//                   <MenuItem value="mobile">Mobile App</MenuItem>
//                   <MenuItem value="website">Public Website</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 1: // Targeting & Scheduling
//         return (
//            <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="device_type" label="Device Type (e.g., desktop)" value={formData.device_type} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12}><TextField name="geolocation" label="Geolocation (e.g., Mumbai)" value={formData.geolocation} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
//             </Grid>
//           </Grid>
//         );
//       case 2: // Content & Configuration
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//                 <Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
//                     Upload HTML File
//                     <input type="file" accept=".html" hidden onChange={handleFileChange} />
//                 </Button>
//                 {formData.html_file && <Typography variant="body2" sx={{mt:1}}>Selected: {formData.html_file.name}</Typography>}
//             </Grid>
//             <Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth /></Grid>
//              <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
//                   <MenuItem value="draft">Draft</MenuItem>
//                   <MenuItem value="active">Active</MenuItem>
//                   <MenuItem value="inactive">Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 3: // Review & Submit
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>Review Your Banner Details</Typography>
//             <Paper variant="outlined" sx={{p: 2, mt: 2}}>
//               {Object.entries(formData).map(([key, value]) => (
//                 value && <Typography key={key}><strong>{key.replace('_', ' ')}:</strong> {typeof value === 'object' ? value.name : value}</Typography>
//               ))}
//             </Paper>
//           </Box>
//         );
//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//         Follow the simple 4 steps to complete your banner upload.
//       </Typography>

//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         {/* --- Left Side: Stepper --- */}
//         <Grid item xs={12} md={4}>
//            <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label}>
//                 <StepLabel StepIconComponent={QontoStepIcon}>
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>

//         {/* --- Right Side: Form Content --- */}
//         <Grid item xs={12} md={8}>
//           <Box sx={{ minHeight: 350, mb: 3 }}>
//             {getStepContent(activeStep)}
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//             <Button
//               disabled={activeStep === 0}
//               onClick={handleBack}
//               sx={{ mr: 1 }}
//             >
//               Back
//             </Button>
//             <Button variant="contained" onClick={handleNext}>
//               {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   styled,
//   CircularProgress,
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import MyLocationIcon from '@mui/icons-material/MyLocation';

// // --- Styled Components for the Custom Stepper ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 10,
//     left: 'calc(-50% + 16px)',
//     right: 'calc(50% + 16px)',
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: theme.palette.primary.main,
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: theme.palette.primary.main,
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
//     borderTopWidth: 3,
//     borderRadius: 1,
//   },
// }));

// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
//   display: 'flex',
//   height: 22,
//   alignItems: 'center',
//   ...(ownerState.active && {
//     color: theme.palette.primary.main,
//   }),
//   '& .QontoStepIcon-completedIcon': {
//     color: theme.palette.primary.main,
//     zIndex: 1,
//     fontSize: 24,
//   },
//   '& .QontoStepIcon-circle': {
//     width: 12,
//     height: 12,
//     borderRadius: '50%',
//     backgroundColor: 'currentColor',
//   },
// }));

// function QontoStepIcon(props) {
//   const { active, completed, className } = props;
//   return (
//     <QontoStepIconRoot ownerState={{ active }} className={className}>
//       {completed ? (
//         <Check className="QontoStepIcon-completedIcon" />
//       ) : (
//         <div className="QontoStepIcon-circle" />
//       )}
//     </QontoStepIconRoot>
//   );
// }

// // --- Main Component ---
// const steps = [
//   'Banner Details',
//   'Targeting & Scheduling',
//   'Content & Configuration',
//   'Review & Submit',
// ];

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     client_id: '',
//     pan_id: '',
//     channel: '',
//     language: 'en-US',
//     device_type: '',
//     geolocation: '',
//     html_file: null,
//     priority: 5,
//     segment_tag: '',
//     status: 'draft',
//     valid_from: '',
//     valid_to: '',
//   });

//   const [locationStatus, setLocationStatus] = useState({
//       loading: false,
//       error: null,
//   });

//   useEffect(() => {
//     const getDeviceType = () => {
//       const ua = navigator.userAgent;
//       if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
//       if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
//       return "desktop";
//     };
//     setFormData(prev => ({ ...prev, device_type: getDeviceType() }));
//   }, []);

//   const handleNext = () => setActiveStep((prev) => prev + 1);
//   const handleBack = () => setActiveStep((prev) => prev - 1);
//   const handleStepClick = (step) => {
//     if (step < activeStep) {
//       setActiveStep(step);
//     }
//   };
  
//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//     }
//   };
  
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({...formData, [name]: value });
//   };

//   const handleGetLocation = () => {
//       if (!navigator.geolocation) {
//           setLocationStatus({ loading: false, error: "Geolocation is not supported by your browser." });
//           return;
//       }
//       setLocationStatus({ loading: true, error: null });
//       navigator.geolocation.getCurrentPosition(
//           (position) => {
//               const { latitude, longitude } = position.coords;
//               const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
//               setFormData(prev => ({...prev, geolocation: locationString}));
//               setLocationStatus({ loading: false, error: null });
//           },
//           () => {
//               setLocationStatus({ loading: false, error: "Unable to retrieve your location. Please grant permission." });
//           }
//       );
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: // Banner Details
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Channel</InputLabel>
//                 <Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}>
//                   <MenuItem value="netbanking">Net Banking</MenuItem>
//                   <MenuItem value="mobile">Mobile App</MenuItem>
//                   <MenuItem value="website">Public Website</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 1: // Targeting & Scheduling
//         return (
//            <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="device_type" label="Detected Device Type" value={formData.device_type} fullWidth InputProps={{ readOnly: true }} /></Grid>
            
//             <Grid item xs={12}>
//                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>Geolocation</Typography>
//                 <Button 
//                     variant="outlined" 
//                     startIcon={locationStatus.loading ? <CircularProgress size={20}/> : <MyLocationIcon />}
//                     onClick={handleGetLocation}
//                     disabled={locationStatus.loading}
//                 >
//                     Get Current Location
//                 </Button>
//                 {formData.geolocation && <Typography variant="body2" sx={{mt:1}}>Coordinates: {formData.geolocation}</Typography>}
//                 {locationStatus.error && <Typography variant="body2" color="error" sx={{mt:1}}>{locationStatus.error}</Typography>}
//             </Grid>

//             <Grid item xs={12} sm={6}>
//                 <TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
//             </Grid>
//           </Grid>
//         );
//       case 2: // Content & Configuration
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//                 <Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
//                     Upload HTML File
//                     <input type="file" accept=".html" hidden onChange={handleFileChange} />
//                 </Button>
//                 {formData.html_file && <Typography variant="body2" sx={{mt:1}}>Selected: {formData.html_file.name}</Typography>}
//             </Grid>
//             <Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth /></Grid>
//              <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
//                   <MenuItem value="draft">Draft</MenuItem>
//                   <MenuItem value="active">Active</MenuItem>
//                   <MenuItem value="inactive">Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 3: // Review & Submit
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>Review Your Banner Details</Typography>
//             <Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>
//               {Object.entries(formData).map(([key, value]) => {
//                 if (!value) return null; // Don't show empty fields
//                 const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);
//                 return (
//                   <Typography key={key} sx={{mb: 1}}>
//                     <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}
//                   </Typography>
//                 );
//               })}
//             </Paper>
//           </Box>
//         );
//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//         Follow the simple 4 steps to complete your banner upload.
//       </Typography>

//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         <Grid item xs={12} md={4}>
//            <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label}>
//                 <StepLabel 
//                   StepIconComponent={QontoStepIcon}
//                   onClick={() => handleStepClick(index)}
//                   sx={{ 
//                     cursor: index < activeStep ? 'pointer' : 'default',
//                     '&:hover': {
//                       backgroundColor: index < activeStep ? 'action.hover' : 'transparent',
//                     },
//                     p: 1,
//                     borderRadius: 2
//                   }}
//                 >
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>

//         <Grid item xs={12} md={8}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: {xs: 'auto', md: 400} }}>
//             <Box sx={{ flexGrow: 1 }}>
//                 {getStepContent(activeStep)}
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//                 <Button
//                 disabled={activeStep === 0}
//                 onClick={handleBack}
//                 sx={{ mr: 1 }}
//                 >
//                 Back
//                 </Button>
//                 <Button variant="contained" onClick={handleNext}>
//                 {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//                 </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;


// Better version of the BannerUpload component with improved structure and functionality:
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   styled,
//   CircularProgress,
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import MyLocationIcon from '@mui/icons-material/MyLocation';

// // --- (No changes to Styled Components: QontoConnector, QontoStepIconRoot, QontoStepIcon) ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0', borderTopWidth: 3, borderRadius: 1 },
// }));
// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0', display: 'flex', height: 22, alignItems: 'center',
//   ...(ownerState.active && { color: theme.palette.primary.main }),
//   '& .QontoStepIcon-completedIcon': { color: theme.palette.primary.main, zIndex: 1, fontSize: 24 },
//   '& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
// }));
// function QontoStepIcon(props) {
//   const { active, completed, className } = props;
//   return (<QontoStepIconRoot ownerState={{ active }} className={className}><Check className="QontoStepIcon-completedIcon" /></QontoStepIconRoot>);
// }
// // --- End of Styled Components ---

// const steps = ['Banner Details', 'Targeting & Scheduling', 'Content & Configuration', 'Review & Submit'];
// const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({ /* ... same as before */ });
//   const [locationStatus, setLocationStatus] = useState({ loading: false, error: null });
  
//   // --- NEW: State for validation errors ---
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const getDeviceType = () => {
//       const ua = navigator.userAgent;
//       if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
//       if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
//       return "desktop";
//     };
//     setFormData(prev => ({ ...prev, device_type: getDeviceType() }));
//   });

//   // --- NEW: Validation Logic ---
//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.client_id.trim()) newErrors.client_id = 'Client ID is required.';
//         if (!formData.pan_id.trim()) newErrors.pan_id = 'PAN ID is required.';
//         else if (!PAN_REGEX.test(formData.pan_id)) newErrors.pan_id = 'Invalid PAN ID format.';
//         if (!formData.channel) newErrors.channel = 'Channel is required.';
//         break;
//       case 1:
//         if (!formData.valid_from) newErrors.valid_from = 'Start date is required.';
//         if (!formData.valid_to) newErrors.valid_to = 'End date is required.';
//         else if (formData.valid_from && new Date(formData.valid_to) <= new Date(formData.valid_from)) {
//             newErrors.valid_to = 'End date must be after the start date.';
//         }
//         break;
//       case 2:
//         if (!formData.html_file) newErrors.html_file = 'An HTML file is required for upload.';
//         if (!formData.priority) newErrors.priority = 'Priority is required.';
//         else if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1 and 10.';
//         break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
  
//   // --- UPDATED: handleNext now performs validation ---
//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setActiveStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => setActiveStep((prev) => prev - 1);
  
//   // --- UPDATED: Clickable stepper logic ---
//   const handleStepClick = (step) => {
//     // Only allow jumping back to previously completed steps
//     if (step < activeStep) {
//       setActiveStep(step);
//     }
//   };
  
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//     // Clear error for the field being edited
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };
  
//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//       if (errors.html_file) {
//         setErrors({...errors, html_file: null});
//       }
//     }
//   };

//   const handleGetLocation = () => { if (!navigator.geolocation) {
//           setLocationStatus({ loading: false, error: "Geolocation is not supported by your browser." });
//           return;
//       }
//       setLocationStatus({ loading: true, error: null });
//       navigator.geolocation.getCurrentPosition(
//           (position) => {
//               const { latitude, longitude } = position.coords;
//               const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
//               setFormData(prev => ({...prev, geolocation: locationString}));
//               setLocationStatus({ loading: false, error: null });
//           },
//           () => {
//               setLocationStatus({ loading: false, error: "Unable to retrieve your location. Please grant permission." });
//           }
//       );
//      };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: // Banner Details
//         return (
//           <Grid container spacing={4}>
//             <Grid item xs={12} sm={6}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth error={!!errors.client_id} helperText={errors.client_id} /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth error={!!errors.pan_id} helperText={errors.pan_id} /></Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth error={!!errors.channel}>
//                 <InputLabel>Channel</InputLabel>
//                 <Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}>
//                   <MenuItem value="netbanking">Net Banking</MenuItem>
//                   <MenuItem value="mobile">Mobile App</MenuItem>
//                   <MenuItem value="website">Public Website</MenuItem>
//                 </Select>
//                 {errors.channel && <FormHelperText>{errors.channel}</FormHelperText>}
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 1: // Targeting & Scheduling
//         return (
//            <Grid container spacing={4} alignItems="center">
//             <Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="device_type" label="Detected Device Type" value={formData.device_type} fullWidth InputProps={{ readOnly: true }} /></Grid>
//             <Grid item xs={12}>
//                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>Geolocation</Typography>
//                 <Button variant="outlined" startIcon={locationStatus.loading ? <CircularProgress size={20}/> : <MyLocationIcon />} onClick={handleGetLocation} disabled={locationStatus.loading}>Get Current Location</Button>
//                 {formData.geolocation && <Typography variant="body2" sx={{mt:1}}>Coordinates: {formData.geolocation}</Typography>}
//                 {locationStatus.error && <Typography variant="body2" color="error" sx={{mt:1}}>{locationStatus.error}</Typography>}
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_from} helperText={errors.valid_from} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_to} helperText={errors.valid_to} />
//             </Grid>
//           </Grid>
//         );
//       case 2: // Content & Configuration
//         return (
//           <Grid container spacing={4}>
//             <Grid item xs={12}>
//                 <FormControl fullWidth error={!!errors.html_file}>
//                     <Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
//                         Upload HTML File
//                         <input type="file" accept=".html" hidden onChange={handleFileChange} />
//                     </Button>
//                     {formData.html_file && <Typography variant="body2" sx={{mt:1}}>Selected: {formData.html_file.name}</Typography>}
//                     {errors.html_file && <FormHelperText sx={{ml: 2}}>{errors.html_file}</FormHelperText>}
//                 </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth error={!!errors.priority} helperText={errors.priority} /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth /></Grid>
//              <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select name="status" value={formData.status} label="Status" onChange={handleChange}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 3: // Review & Submit
//         return ( 
//         <Box>
//             <Typography variant="h6" gutterBottom>Review Your Banner Details</Typography>
//             <Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>
//               {Object.entries(formData).map(([key, value]) => {
//                 if (!value) return null; // Don't show empty fields
//                 const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);
//                 return (
//                   <Typography key={key} sx={{mb: 1}}>
//                     <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}
//                   </Typography>
//                 );
//               })}
//             </Paper>
//           </Box>);
//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//         Follow the simple 4 steps to complete your banner upload.
//       </Typography>
//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         {/* --- Left Side: Stepper (UPDATED) --- */}
//         <Grid item xs={12} md={4}>
//            <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label} completed={index < activeStep}>
//                 <StepLabel
//                   onClick={() => handleStepClick(index)}
//                   StepIconComponent={QontoStepIcon}
//                   sx={{ p: 1, borderRadius: 2, cursor: index < activeStep ? 'pointer' : 'default', '&:hover': { backgroundColor: index < activeStep ? 'action.hover' : 'transparent' } }}
//                 >
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>
//         {/* --- Right Side: Form Content (UPDATED) --- */}
//         <Grid item xs={12} md={8}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: {xs: 'auto', md: 450} }}>
//             <Box>
//                 {getStepContent(activeStep)}
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//                 <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//                 <Button variant="contained" onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;

// bugged 
// import React, { useState, useEffect, useMemo, version } from 'react'; // Import useMemo
// import {
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   styled,
//   CircularProgress,
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import MyLocationIcon from '@mui/icons-material/MyLocation';

// // --- (No changes to Styled Components) ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0', borderTopWidth: 3, borderRadius: 1 },
// }));
// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0', display: 'flex', height: 22, alignItems: 'center',
//   ...(ownerState.active && { color: theme.palette.primary.main }),
//   '& .QontoStepIcon-completedIcon': { color: theme.palette.primary.main, zIndex: 1, fontSize: 24 },
//   '& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
// }));
// function QontoStepIcon(props) {
//   const { active, completed, className } = props;
//   return (<QontoStepIconRoot ownerState={{ active }} className={className}><Check className="QontoStepIcon-completedIcon" /></QontoStepIconRoot>);
// }
// // --- End of Styled Components ---

// const steps = ['Banner Details', 'Targeting & Scheduling', 'Content & Configuration', 'Review & Submit'];
// const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     client_id: '',
//     pan_id: '',
//     channel: '',
//     language: 'en-US',
//     device_type: '',
//     geolocation: '',
//     valid_from: '',
//     valid_to: '',
//     html_file: null,
//     priority: '',
//     segment_tag: '',
//     status: 'draft',
//   });
//   const [locationStatus, setLocationStatus] = useState({ loading: false, error: null });
//   const [errors, setErrors] = useState({});

//   // --- MODIFIED: useEffect now only runs once on mount ---
//   useEffect(() => {
//     const getDeviceType = () => {
//       const ua = navigator.userAgent;
//       if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
//       if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
//       return "desktop";
//     };
//     setFormData(prev => ({ ...prev, device_type: getDeviceType() }));
//   }, []); // Empty dependency array ensures this runs only once

//   const validateStep = (step) => {
//     // ... (This function remains the same, it's correct for on-submit validation)
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.client_id.trim()) newErrors.client_id = 'Client ID is required.';
//         if (!formData.pan_id.trim()) newErrors.pan_id = 'PAN ID is required.';
//         else if (!PAN_REGEX.test(formData.pan_id)) newErrors.pan_id = 'Invalid PAN ID format.';
//         if (!formData.channel) newErrors.channel = 'Channel is required.';
//         break;
//       case 1:
//         if (!formData.valid_from) newErrors.valid_from = 'Start date is required.';
//         if (!formData.valid_to) newErrors.valid_to = 'End date is required.';
//         else if (formData.valid_from && new Date(formData.valid_to) <= new Date(formData.valid_from)) {
//             newErrors.valid_to = 'End date must be after the start date.';
//         }
//         break;
//       case 2:
//         if (!formData.html_file) newErrors.html_file = 'An HTML file is required for upload.';
//         if (!formData.priority) newErrors.priority = 'Priority is required.';
//         else if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1 and 10.';
//         break;
//       default: break;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // --- NEW: Real-time validation for disabling the "Next" button ---
//   const isNextDisabled = useMemo(() => {
//     switch (activeStep) {
//       case 0:
//         return !formData.client_id.trim() || !formData.pan_id.trim() || !PAN_REGEX.test(formData.pan_id) || !formData.channel;
//       case 1:
//         return !formData.valid_from || !formData.valid_to || (new Date(formData.valid_to) <= new Date(formData.valid_from));
//       case 2:
//         return !formData.html_file || !formData.priority || formData.priority < 1 || formData.priority > 10;
//       default:
//         return false;
//     }
//   }, [formData, activeStep]);
  
//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       setActiveStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => setActiveStep((prev) => prev - 1);
//   const handleStepClick = (step) => { if (step < activeStep) { setActiveStep(step); } };
  
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) { setErrors({ ...errors, [name]: null }); }
//   };
  
//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//       if (errors.html_file) { setErrors({...errors, html_file: null}); }
//     }
//   };

//   const handleGetLocation = () => { /* ... (No changes needed here) ... */ };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: // Banner Details
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth error={!!errors.client_id} helperText={errors.client_id || ' '} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth error={!!errors.pan_id} helperText={errors.pan_id || ' '} />
//             </Grid>
//             {/* --- MODIFIED: Channel width adjusted via Grid --- */}
//             <Grid item xs={12} sm={8}>
//               <FormControl fullWidth error={!!errors.channel}>
//                 <InputLabel>Channel</InputLabel>
//                 <Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}>
//                   <MenuItem value="netbanking">Net Banking</MenuItem>
//                   <MenuItem value="mobile">Mobile App</MenuItem>
//                   <MenuItem value="website">Public Website</MenuItem>
//                 </Select>
//                 {/* The FormHelperText is used for spacing even when there's no error */}
//                 <FormHelperText>{errors.channel || ' '}</FormHelperText>
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 1: // Targeting & Scheduling
//         return (
//            <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth helperText=" " /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="device_type" label="Detected Device Type" value={formData.device_type} fullWidth InputProps={{ readOnly: true }} helperText=" " /></Grid>
//             <Grid item xs={12}>
//                 <Button variant="outlined" startIcon={locationStatus.loading ? <CircularProgress size={20}/> : <MyLocationIcon />} onClick={handleGetLocation} disabled={locationStatus.loading}>Get Current Location</Button>
//                 {formData.geolocation && <Typography variant="body2" sx={{mt:1}}>Coordinates: {formData.geolocation}</Typography>}
//                 {locationStatus.error && <Typography variant="body2" color="error" sx={{mt:1}}>{locationStatus.error}</Typography>}
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_from} helperText={errors.valid_from || ' '} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_to} helperText={errors.valid_to || ' '} />
//             </Grid>
//           </Grid>
//         );
//       case 2: // Content & Configuration
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//                 <FormControl fullWidth error={!!errors.html_file}>
//                     <Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}> Upload HTML File <input type="file" accept=".html" hidden onChange={handleFileChange} /></Button>
//                     {formData.html_file && <Typography variant="body2" sx={{mt:1}}>Selected: {formData.html_file.name}</Typography>}
//                     <FormHelperText sx={{ml: 2}}>{errors.html_file || ' '}</FormHelperText>
//                 </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth error={!!errors.priority} helperText={errors.priority || ' '} /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth helperText=" " /></Grid>
//              <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select name="status" value={formData.status} label="Status" onChange={handleChange}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select>
//                  <FormHelperText>{' '}</FormHelperText>
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 3: // Review & Submit
//         return ( 
//           <Box>
//             <Typography variant="h6" gutterBottom>Review Your Banner Details</Typography>
//             <Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>
//               {Object.entries(formData).map(([key, value]) => {
//                 if (!value) return null;
//                 const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);
//                 return (
//                   <Typography key={key} sx={{mb: 1}}>
//                     <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}
//                   </Typography>
//                 );
//               })}
//             </Paper>
//           </Box>
//         );
//       default: return 'Unknown step';
//     }
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//         Follow the simple 4 steps to complete your banner upload.
//       </Typography>
//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         <Grid item xs={12} md={4}>
//            <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label} completed={index < activeStep}>
//                 <StepLabel onClick={() => handleStepClick(index)} StepIconComponent={QontoStepIcon} sx={{ p: 1, borderRadius: 2, cursor: index < activeStep ? 'pointer' : 'default', '&:hover': { backgroundColor: index < activeStep ? 'action.hover' : 'transparent' } }}>
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           {/* --- MODIFIED: Adjusted minHeight and margins for better button depth --- */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: {xs: 'auto', md: 400} }}>
//             <Box>
//                 {getStepContent(activeStep)}
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//                 <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//                 <Button variant="contained" onClick={handleNext} disabled={isNextDisabled}>
//                   {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//                 </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;

// best for refer 

// import React from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   styled,
//   CircularProgress,
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import MyLocationIcon from '@mui/icons-material/MyLocation';

// // --- Styled Components (Unchanged) ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0', borderTopWidth: 3, borderRadius: 1 },
// }));
// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0', display: 'flex', height: 22, alignItems: 'center',
//   ...(ownerState.active && { color: theme.palette.primary.main }),
//   '& .QontoStepIcon-completedIcon': { color: theme.palette.primary.main, zIndex: 1, fontSize: 24 },
//   '& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
// }));
// function QontoStepIcon(props) {
//   const { active, completed, className } = props;
//   return (<QontoStepIconRoot ownerState={{ active }} className={className}>{completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}</QontoStepIconRoot>);
// }
// // --- End of Styled Components ---

// const steps = ['Banner Details', 'Targeting & Scheduling', 'Content & Configuration', 'Review & Submit'];
// const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [formData, setFormData] = React.useState({
//     client_id: '',
//     pan_id: '',
//     channel: '',
//     language: 'en-US',
//     device_type: '',
//     geolocation: '',
//     valid_from: '',
//     valid_to: '',
//     html_file: null,
//     priority: 5,
//     segment_tag: '',
//     status: 'draft',
//   });
//   const [locationStatus, setLocationStatus] = React.useState({ loading: false, error: null });
//   const [errors, setErrors] = React.useState({});

//   React.useEffect(() => {
//     const getDeviceType = () => {
//       const ua = navigator.userAgent;
//       if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
//       if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
//       return "desktop";
//     };
//     setFormData(prev => ({ ...prev, device_type: getDeviceType() }));
//   }, []);

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.client_id.trim()) newErrors.client_id = 'Client ID is required.';
//         if (!formData.pan_id.trim()) newErrors.pan_id = 'PAN ID is required.';
//         else if (!PAN_REGEX.test(formData.pan_id)) newErrors.pan_id = 'Invalid PAN ID format.';
//         if (!formData.channel) newErrors.channel = 'Channel is required.';
//         break;
//       case 1:
//         if (!formData.valid_from) newErrors.valid_from = 'Start date is required.';
//         if (!formData.valid_to) newErrors.valid_to = 'End date is required.';
//         else if (formData.valid_from && new Date(formData.valid_to) <= new Date(formData.valid_from)) {
//             newErrors.valid_to = 'End date must be after the start date.';
//         }
//         break;
//       case 2:
//         if (!formData.html_file) newErrors.html_file = 'An HTML file is required for upload.';
//         if (formData.priority === '' || formData.priority === null) newErrors.priority = 'Priority is required.';
//         else if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1 and 10.';
//         break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     // This is the core logic: if validation passes, go to the next step.
//     // If it fails, validateStep has already set the errors, which will cause a re-render to show them.
//     if (validateStep(activeStep)) {
//       setActiveStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => setActiveStep((prev) => prev - 1);
//   const handleStepClick = (step) => { if (step < activeStep) { setActiveStep(step); } };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//     // This clears an error as soon as the user starts typing in the field.
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };

//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//       if (errors.html_file) {
//         setErrors({...errors, html_file: null});
//       }
//     }
//   };

//   const handleGetLocation = () => { /* ... Unchanged ... */ };

//   const getStepContent = (step) => {
//     // Add ' ' as helperText to reserve space and prevent layout shifts when errors appear/disappear.
//     switch (step) {
//       case 0:
//         return (
//           <Grid container spacing={4}>
//             <Grid item xs={12} sm={6}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth error={!!errors.client_id} helperText={errors.client_id || ' '}/></Grid>
//             <Grid item xs={12} sm={6}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth error={!!errors.pan_id} helperText={errors.pan_id || ' '}/></Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth error={!!errors.channel}>
//                 <InputLabel>Channel</InputLabel>
//                 <Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select>
//                 <FormHelperText>{errors.channel || ' '}</FormHelperText>
//               </FormControl>
//             </Grid>
//           </Grid>
//         );
//       case 1:
//         return (
//            <Grid container spacing={4} alignItems="center">
//             <Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth helperText=" "/></Grid>
//             <Grid item xs={12} sm={6}><TextField name="device_type" label="Detected Device Type" value={formData.device_type} fullWidth InputProps={{ readOnly: true }} helperText=" "/></Grid>
//             <Grid item xs={12}><Button variant="outlined" startIcon={locationStatus.loading ? <CircularProgress size={20}/> : <MyLocationIcon />} onClick={handleGetLocation} disabled={locationStatus.loading}>Get Current Location</Button>{formData.geolocation && <Typography variant="body2" sx={{mt:1}}>Coordinates: {formData.geolocation}</Typography>}{locationStatus.error && <Typography variant="body2" color="error" sx={{mt:1}}>{locationStatus.error}</Typography>}</Grid>
//             <Grid item xs={12} sm={6}><TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_from} helperText={errors.valid_from || ' '} /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_to} helperText={errors.valid_to || ' '} /></Grid>
//           </Grid>
//         );
//       case 2:
//         return (
//           <Grid container spacing={4}>
//             <Grid item xs={12}><FormControl fullWidth error={!!errors.html_file}><Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}><input type="file" accept=".html" hidden onChange={handleFileChange} />Upload HTML File</Button>{formData.html_file && <Typography variant="body2" sx={{mt:1, ml: 2}}>Selected: {formData.html_file.name}</Typography>}<FormHelperText sx={{ml: 2}}>{errors.html_file || ' '}</FormHelperText></FormControl></Grid>
//             <Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth error={!!errors.priority} helperText={errors.priority || ' '} /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth helperText=" "/></Grid>
//             <Grid item xs={12}><FormControl fullWidth><InputLabel>Status</InputLabel><Select name="status" value={formData.status} label="Status" onChange={handleChange}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select><FormHelperText> </FormHelperText></FormControl></Grid>
//           </Grid>
//         );
//       case 3:
//         return ( <Box><Typography variant="h6" gutterBottom>Review Your Banner Details</Typography><Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>{Object.entries(formData).map(([key, value]) => {if (!value) return null;const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);return (<Typography key={key} sx={{mb: 1}}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}</Typography>);})}</Paper></Box>);
//       default:
//         return 'Unknown step';
//     }
//   };

//   // --- REMOVED: isNextDisabled function is no longer needed. ---

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>Follow the simple 4 steps to complete your banner upload.</Typography>
//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         <Grid item xs={12} md={4}>
//           <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label} completed={index < activeStep}>
//                 <StepLabel onClick={() => handleStepClick(index)} StepIconComponent={QontoStepIcon} sx={{ p: 1, borderRadius: 2, cursor: index < activeStep ? 'pointer' : 'default', '&:hover': { backgroundColor: index < activeStep ? 'action.hover' : 'transparent' } }}>
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           {/* --- MODIFIED: REMOVED minHeight TO FIX BUTTON PLACEMENT --- */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//             <Box>
//                 {getStepContent(activeStep)}
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//                 <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//                 {/* --- MODIFIED: REMOVED disabled prop. The button is now always clickable. --- */}
//                 <Button variant="contained" onClick={handleNext}>
//                   {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//                 </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;

// import React from 'react';
// import axios from 'axios'; // Using axios for robust data sending
// import {
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   styled,
//   CircularProgress,
//   Alert,
//   AlertTitle,
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import MyLocationIcon from '@mui/icons-material/MyLocation';

// // --- Styled Components (Unchanged) ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0', borderTopWidth: 3, borderRadius: 1 },
// }));
// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0', display: 'flex', height: 22, alignItems: 'center',
//   ...(ownerState.active && { color: theme.palette.primary.main }),
//   '& .QontoStepIcon-completedIcon': { color: theme.palette.primary.main, zIndex: 1, fontSize: 24 },
//   '& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
// }));
// function QontoStepIcon(props) {
//   const { active, completed } = props;
//   return (<QontoStepIconRoot ownerState={{ active }}>{completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}</QontoStepIconRoot>);
// }
// // --- End of Styled Components ---

// const steps = ['Banner Details', 'Targeting & Scheduling', 'Content & Configuration', 'Review & Submit'];
// const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [formData, setFormData] = React.useState({
//     client_id: '', pan_id: '', channel: '', language: 'en-US', device_type: '', geolocation: '',
//     valid_from: '', valid_to: '', html_file: null, priority: 5, segment_tag: '', status: 'draft',
//   });
//   const [locationStatus, setLocationStatus] = React.useState({ loading: false, error: null });
//   const [errors, setErrors] = React.useState({});

//   // --- NEW: State for submission process ---
//   const [isSubmitting, setIsSubmitting] = React.useState(false);
//   const [submissionStatus, setSubmissionStatus] = React.useState({ message: '', type: '' }); // type: 'success' or 'error'

//   React.useEffect(() => {
//     const getDeviceType = () => {
//       const ua = navigator.userAgent;
//       if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
//       if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
//       return "desktop";
//     };
//     setFormData(prev => ({ ...prev, device_type: getDeviceType() }));
//   }, []);

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.client_id.trim()) newErrors.client_id = 'Client ID is required.';
//         if (!formData.pan_id.trim()) newErrors.pan_id = 'PAN ID is required.';
//         else if (!PAN_REGEX.test(formData.pan_id)) newErrors.pan_id = 'Invalid PAN ID format.';
//         if (!formData.channel) newErrors.channel = 'Channel is required.';
//         break;
//       case 1:
//         if (!formData.valid_from) newErrors.valid_from = 'Start date is required.';
//         if (!formData.valid_to) newErrors.valid_to = 'End date is required.';
//         else if (formData.valid_from && new Date(formData.valid_to) <= new Date(formData.valid_from)) newErrors.valid_to = 'End date must be after the start date.';
//         break;
//       case 2:
//         if (!formData.html_file) newErrors.html_file = 'An HTML file is required for upload.';
//         if (formData.priority === '' || formData.priority === null) newErrors.priority = 'Priority is required.';
//         else if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1 and 10.';
//         break;
//       default: break;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => { if (validateStep(activeStep)) { setActiveStep((prev) => prev + 1); } };
//   const handleBack = () => setActiveStep((prev) => prev - 1);
//   const handleStepClick = (step) => { if (step < activeStep) { setActiveStep(step); } };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) { setErrors({ ...errors, [name]: null }); }
//   };
//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//       if (errors.html_file) { setErrors({...errors, html_file: null}); }
//     }
//   };
//   const handleGetLocation = () => { /* Unchanged */ };

//   // --- NEW: Function to handle the final submission ---
//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmissionStatus({ message: '', type: '' });

//     // Create a FormData object to send file and text fields together
//     const uploadData = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) { // Append only if value is not null or empty
//         uploadData.append(key, value);
//       }
//     });

//     try {
//       const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Your base URL from .env file
//       const token = localStorage.getItem('authToken');

//       await axios.post(`${API_BASE_URL}/api/banners`, uploadData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Axios handles this correctly with FormData
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       setSubmissionStatus({ message: 'Banner has been uploaded successfully!', type: 'success' });
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
//       setSubmissionStatus({ message: errorMessage, type: 'error' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: /* Unchanged */ return ( <Grid container spacing={4}><Grid item xs={12} sm={6}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth error={!!errors.client_id} helperText={errors.client_id || ' '}/></Grid><Grid item xs={12} sm={6}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth error={!!errors.pan_id} helperText={errors.pan_id || ' '}/></Grid><Grid item xs={12}><FormControl fullWidth error={!!errors.channel}><InputLabel>Channel</InputLabel><Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select><FormHelperText>{errors.channel || ' '}</FormHelperText></FormControl></Grid></Grid> );
//       case 1: /* Unchanged */ return ( <Grid container spacing={4} alignItems="center"><Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth helperText=" "/></Grid><Grid item xs={12} sm={6}><TextField name="device_type" label="Detected Device Type" value={formData.device_type} fullWidth InputProps={{ readOnly: true }} helperText=" "/></Grid><Grid item xs={12}><Button variant="outlined" startIcon={locationStatus.loading ? <CircularProgress size={20}/> : <MyLocationIcon />} onClick={handleGetLocation} disabled={locationStatus.loading}>Get Current Location</Button>{formData.geolocation && <Typography variant="body2" sx={{mt:1}}>Coordinates: {formData.geolocation}</Typography>}{locationStatus.error && <Typography variant="body2" color="error" sx={{mt:1}}>{locationStatus.error}</Typography>}</Grid><Grid item xs={12} sm={6}><TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_from} helperText={errors.valid_from || ' '} /></Grid><Grid item xs={12} sm={6}><TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_to} helperText={errors.valid_to || ' '} /></Grid></Grid> );
//       case 2: /* Unchanged */ return ( <Grid container spacing={4}><Grid item xs={12}><FormControl fullWidth error={!!errors.html_file}><Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}><input type="file" accept=".html" hidden onChange={handleFileChange} />Upload HTML File</Button>{formData.html_file && <Typography variant="body2" sx={{mt:1, ml: 2}}>Selected: {formData.html_file.name}</Typography>}<FormHelperText sx={{ml: 2}}>{errors.html_file || ' '}</FormHelperText></FormControl></Grid><Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth error={!!errors.priority} helperText={errors.priority || ' '} /></Grid><Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth helperText=" "/></Grid><Grid item xs={12}><FormControl fullWidth><InputLabel>Status</InputLabel><Select name="status" value={formData.status} label="Status" onChange={handleChange}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select><FormHelperText> </FormHelperText></FormControl></Grid></Grid> );
//       case 3:
//         return ( 
//           <Box>
//             <Typography variant="h6" gutterBottom>Review Your Banner Details</Typography>
//             <Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>
//               {Object.entries(formData).map(([key, value]) => {
//                 if (!value) return null;
//                 const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);
//                 return ( <Typography key={key} sx={{mb: 1}}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}</Typography> );
//               })}
//             </Paper>
//             {/* --- NEW: Display Success or Error Alert --- */}
//             {submissionStatus.message && (
//               <Alert severity={submissionStatus.type} sx={{ mt: 3 }}>
//                 <AlertTitle>{submissionStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
//                 {submissionStatus.message}
//               </Alert>
//             )}
//           </Box>
//         );
//       default: return 'Unknown step';
//     }
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>Follow the simple 4 steps to complete your banner upload.</Typography>
//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         <Grid item xs={12} md={4}>
//           <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label} completed={index < activeStep}>
//                 <StepLabel onClick={() => handleStepClick(index)} StepIconComponent={QontoStepIcon} sx={{ p: 1, borderRadius: 2, cursor: index < activeStep ? 'pointer' : 'default', '&:hover': { backgroundColor: index < activeStep ? 'action.hover' : 'transparent' } }}>
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//             <Box>{getStepContent(activeStep)}</Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//               <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//               <Button
//                 variant="contained"
//                 onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
//                 disabled={isSubmitting || submissionStatus.type === 'success'}
//               >
//                 {activeStep === steps.length - 1 ? 
//                   (isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Finish') : 'Next'
//                 }
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;

// the best code till now 

// import React from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   styled,
//   CircularProgress,
//   Alert,
//   AlertTitle,
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import MyLocationIcon from '@mui/icons-material/MyLocation';

// // --- Styled Components (Unchanged) ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0', borderTopWidth: 3, borderRadius: 1 },
// }));
// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0', display: 'flex', height: 22, alignItems: 'center',
//   ...(ownerState.active && { color: theme.palette.primary.main }),
//   '& .QontoStepIcon-completedIcon': { color: theme.palette.primary.main, zIndex: 1, fontSize: 24 },
//   '& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
// }));
// function QontoStepIcon(props) {
//   const { active, completed } = props;
//   return (<QontoStepIconRoot ownerState={{ active }}>{completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}</QontoStepIconRoot>);
// }
// // --- End of Styled Components ---

// const steps = ['Banner Details', 'Targeting & Scheduling', 'Content & Configuration', 'Review & Submit'];
// const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [formData, setFormData] = React.useState({
//     client_id: '', pan_id: '', channel: '', language: 'en-US', device_type: '', geolocation: '',
//     valid_from: '', valid_to: '', html_file: null, priority: 5, segment_tag: '', status: 'draft',
//   });
//   const [locationStatus, setLocationStatus] = React.useState({ loading: false, error: null });
//   const [errors, setErrors] = React.useState({});
//   const [isSubmitting, setIsSubmitting] = React.useState(false);
//   const [submissionStatus, setSubmissionStatus] = React.useState({ message: '', type: '' });

//   React.useEffect(() => {
//     const getDeviceType = () => {
//       const ua = navigator.userAgent;
//       if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
//       if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
//       return "desktop";
//     };
//     setFormData(prev => ({ ...prev, device_type: getDeviceType() }));
//   }, []);

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.client_id.trim()) newErrors.client_id = 'Client ID is required.';
//         if (!formData.pan_id.trim()) newErrors.pan_id = 'PAN ID is required.';
//         else if (!PAN_REGEX.test(formData.pan_id)) newErrors.pan_id = 'Invalid PAN ID format.';
//         if (!formData.channel) newErrors.channel = 'Channel is required.';
//         break;
//       case 1:
//         if (!formData.valid_from) newErrors.valid_from = 'Start date is required.';
//         if (!formData.valid_to) newErrors.valid_to = 'End date is required.';
//         else if (formData.valid_from && new Date(formData.valid_to) <= new Date(formData.valid_from)) newErrors.valid_to = 'End date must be after the start date.';
//         break;
//       case 2:
//         if (!formData.html_file) newErrors.html_file = 'An HTML file is required for upload.';
//         if (formData.priority === '' || formData.priority === null) newErrors.priority = 'Priority is required.';
//         else if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1 and 10.';
//         break;
//       default: break;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => { if (validateStep(activeStep)) { setActiveStep((prev) => prev + 1); } };
//   const handleBack = () => { setSubmissionStatus({ message: '', type: '' }); setActiveStep((prev) => prev - 1); };
//   const handleStepClick = (step) => { if (step < activeStep) { setSubmissionStatus({ message: '', type: '' }); setActiveStep(step); } };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) { setErrors({ ...errors, [name]: null }); }
//   };
//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//       if (errors.html_file) { setErrors({...errors, html_file: null}); }
//     }
//   };

//   // --- FIXED: Restored the full, working geolocation logic ---
//   const handleGetLocation = () => {
//     if (!navigator.geolocation) {
//         setLocationStatus({ loading: false, error: "Geolocation is not supported by your browser." });
//         return;
//     }
//     setLocationStatus({ loading: true, error: null });
//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             const { latitude, longitude } = position.coords;
//             const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
//             setFormData(prev => ({...prev, geolocation: locationString}));
//             setLocationStatus({ loading: false, error: null });
//         },
//         () => {
//             setLocationStatus({ loading: false, error: "Unable to retrieve location. Please grant permission." });
//         }
//     );
//   };

//   // --- FIXED: handleSubmit now performs the correct two-step upload process ---
//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmissionStatus({ message: '', type: '' });
//     const token = localStorage.getItem('authToken');
//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//     try {
//       // Step 1: Upload the file to get a URL and Banner ID.
//       // This is the endpoint for pre-uploading, as established previously.
//       const fileUploadData = new FormData();
//       fileUploadData.append('file', formData.html_file);
//       fileUploadData.append('clientId', formData.client_id);
//       fileUploadData.append('panId', formData.pan_id);
//       fileUploadData.append('channel', formData.channel);

//       const gcsResponse = await axios.post(`${API_BASE_URL}/api/banners/upload`, fileUploadData, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       const { gcs_url, banner_id } = gcsResponse.data;
//       if (!gcs_url || !banner_id) {
//         throw new Error("File upload response was invalid. Missing URL or Banner ID.");
//       }

//       // Step 2: Create the final JSON payload with all data for the main endpoint.
//       const dbPayload = {
//         bannerId: banner_id,
//         clientId: formData.client_id,
//         panId: formData.pan_id,
//         channel: formData.channel,
//         language: formData.language,
//         deviceType: formData.device_type,
//         geolocation: formData.geolocation,
//         validFrom: formData.valid_from,
//         validTo: formData.valid_to,
//         imageUrl: gcs_url, // Use the URL from the first step
//         priority: formData.priority,
//         segmentTag: formData.segment_tag,
//         status: formData.status,
//       };

//       // This is the final save endpoint.
//       await axios.post(`${API_BASE_URL}/api/banners`, dbPayload, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       setSubmissionStatus({ message: 'Banner has been uploaded and saved successfully!', type: 'success' });
//     } catch (error) {
//       console.error("Submission failed:", error);
//       const errorMessage = error.response?.data?.message || 'An unexpected error occurred during the final submission.';
//       setSubmissionStatus({ message: errorMessage, type: 'error' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getStepContent = (step) => {
//     // No changes needed here, this logic is correct.
//     switch (step) {
//       case 0: return ( <Grid container spacing={4}><Grid item xs={12} sm={6}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth error={!!errors.client_id} helperText={errors.client_id || ' '}/></Grid><Grid item xs={12} sm={6}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth error={!!errors.pan_id} helperText={errors.pan_id || ' '}/></Grid><Grid item xs={12}><FormControl fullWidth error={!!errors.channel}><InputLabel>Channel</InputLabel><Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select><FormHelperText>{errors.channel || ' '}</FormHelperText></FormControl></Grid></Grid> );
//       case 1: return ( <Grid container spacing={4} alignItems="center"><Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth helperText=" "/></Grid><Grid item xs={12} sm={6}><TextField name="device_type" label="Detected Device Type" value={formData.device_type} fullWidth InputProps={{ readOnly: true }} helperText=" "/></Grid><Grid item xs={12}><Button variant="outlined" startIcon={locationStatus.loading ? <CircularProgress size={20}/> : <MyLocationIcon />} onClick={handleGetLocation} disabled={locationStatus.loading}>Get Current Location</Button>{formData.geolocation && <Typography variant="body2" sx={{mt:1}}>Coordinates: {formData.geolocation}</Typography>}{locationStatus.error && <Typography variant="body2" color="error" sx={{mt:1}}>{locationStatus.error}</Typography>}</Grid><Grid item xs={12} sm={6}><TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_from} helperText={errors.valid_from || ' '} /></Grid><Grid item xs={12} sm={6}><TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_to} helperText={errors.valid_to || ' '} /></Grid></Grid> );
//       case 2: return ( <Grid container spacing={4}><Grid item xs={12}><FormControl fullWidth error={!!errors.html_file}><Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}><input type="file" accept=".html" hidden onChange={handleFileChange} />Upload HTML File</Button>{formData.html_file && <Typography variant="body2" sx={{mt:1, ml: 2}}>Selected: {formData.html_file.name}</Typography>}<FormHelperText sx={{ml: 2}}>{errors.html_file || ' '}</FormHelperText></FormControl></Grid><Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth error={!!errors.priority} helperText={errors.priority || ' '} /></Grid><Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth helperText=" "/></Grid><Grid item xs={12}><FormControl fullWidth><InputLabel>Status</InputLabel><Select name="status" value={formData.status} label="Status" onChange={handleChange}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select><FormHelperText> </FormHelperText></FormControl></Grid></Grid> );
//       case 3:
//         return ( <Box><Typography variant="h6" gutterBottom>Review Your Banner Details</Typography><Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>{Object.entries(formData).map(([key, value]) => {if (!value) return null;const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);return ( <Typography key={key} sx={{mb: 1}}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}</Typography> );})}</Paper>{submissionStatus.message && (<Alert severity={submissionStatus.type} sx={{ mt: 3 }}><AlertTitle>{submissionStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>{submissionStatus.message}</Alert>)}</Box>);
//       default: return 'Unknown step';
//     }
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>Follow the simple 4 steps to complete your banner upload.</Typography>
//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         <Grid item xs={12} md={4}>
//           <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label} completed={index < activeStep}>
//                 <StepLabel onClick={() => handleStepClick(index)} StepIconComponent={QontoStepIcon} sx={{ p: 1, borderRadius: 2, cursor: index < activeStep ? 'pointer' : 'default', '&:hover': { backgroundColor: index < activeStep ? 'action.hover' : 'transparent' } }}>
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//             <Box>{getStepContent(activeStep)}</Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//               <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//               <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} disabled={isSubmitting || submissionStatus.type === 'success'}>
//                 {activeStep === steps.length - 1 ? (isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Finish') : 'Next'}
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;

// perfect code 

// import React from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   styled,
//   CircularProgress,
//   Alert,
//   AlertTitle,
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import MyLocationIcon from '@mui/icons-material/MyLocation';

// // --- Styled Components (Unchanged) ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0', borderTopWidth: 3, borderRadius: 1 },
// }));
// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0', display: 'flex', height: 22, alignItems: 'center',
//   ...(ownerState.active && { color: theme.palette.primary.main }),
//   '& .QontoStepIcon-completedIcon': { color: theme.palette.primary.main, zIndex: 1, fontSize: 24 },
//   '& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
// }));
// function QontoStepIcon(props) {
//   const { active, completed } = props;
//   return (<QontoStepIconRoot ownerState={{ active }}>{completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}</QontoStepIconRoot>);
// }
// // --- End of Styled Components ---

// const steps = ['Banner Details', 'Targeting & Scheduling', 'Content & Configuration', 'Review & Submit'];
// const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [formData, setFormData] = React.useState({
//     client_id: '', pan_id: '', channel: '', language: 'en-US', device_type: '', geolocation: '',
//     valid_from: '', valid_to: '', html_file: null, priority: 5, segment_tag: '', status: 'draft',
//     clickAction: '', // Added clickAction to match API spec
//   });
//   const [locationStatus, setLocationStatus] = React.useState({ loading: false, error: null });
//   const [errors, setErrors] = React.useState({});
//   const [isSubmitting, setIsSubmitting] = React.useState(false);
//   const [submissionStatus, setSubmissionStatus] = React.useState({ message: '', type: '' });

//   React.useEffect(() => {
//     const getDeviceType = () => {
//       const ua = navigator.userAgent;
//       if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
//       if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
//       return "desktop";
//     };
//     setFormData(prev => ({ ...prev, device_type: getDeviceType() }));
//   }, []);

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.client_id.trim()) newErrors.client_id = 'Client ID is required.';
//         if (!formData.pan_id.trim()) newErrors.pan_id = 'PAN ID is required.';
//         else if (!PAN_REGEX.test(formData.pan_id)) newErrors.pan_id = 'Invalid PAN ID format.';
//         if (!formData.channel) newErrors.channel = 'Channel is required.';
//         break;
//       case 1:
//         if (!formData.valid_from) newErrors.valid_from = 'Start date is required.';
//         if (!formData.valid_to) newErrors.valid_to = 'End date is required.';
//         else if (formData.valid_from && new Date(formData.valid_to) <= new Date(formData.valid_from)) newErrors.valid_to = 'End date must be after the start date.';
//         break;
//       case 2:
//         if (!formData.html_file) newErrors.html_file = 'An HTML file is required for upload.';
//         if (!formData.clickAction.trim()) newErrors.clickAction = 'Click Action URL is required.';
//         if (formData.priority === '' || formData.priority === null) newErrors.priority = 'Priority is required.';
//         else if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1 and 10.';
//         break;
//       default: break;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => { if (validateStep(activeStep)) { setActiveStep((prev) => prev + 1); } };
//   const handleBack = () => { setSubmissionStatus({ message: '', type: '' }); setActiveStep((prev) => prev - 1); };
//   const handleStepClick = (step) => { if (step < activeStep) { setSubmissionStatus({ message: '', type: '' }); setActiveStep(step); } };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) { setErrors({ ...errors, [name]: null }); }
//   };

//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//       if (errors.html_file) { setErrors({...errors, html_file: null}); }
//     }
//   };

//   const handleGetLocation = () => {
//     if (!navigator.geolocation) { setLocationStatus({ loading: false, error: "Geolocation is not supported." }); return; }
//     setLocationStatus({ loading: true, error: null });
//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             const { latitude, longitude } = position.coords;
//             setFormData(prev => ({...prev, geolocation: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}));
//             setLocationStatus({ loading: false, error: null });
//         },
//         () => { setLocationStatus({ loading: false, error: "Unable to retrieve location." }); }
//     );
//   };

//   // --- MODIFIED: handleSubmit now builds the exact multipart/form-data payload required ---
//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmissionStatus({ message: '', type: '' });
//     const token = localStorage.getItem('authToken');
//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//     // 1. Create the JSON metadata object with the correct keys
//     const bannerMetadata = {
//       clientId: formData.client_id,
//       panId: formData.pan_id,
//       channel: formData.channel,
//       clickAction: formData.clickAction,
//       priority: formData.priority,
//       validFrom: formData.valid_from,
//       validTo: formData.valid_to,
//       language: formData.language,
//       segmentTag: formData.segment_tag,
//       deviceType: formData.device_type,
//       geoLocation: formData.geolocation,
//       status: formData.status
//     };

//     // 2. Create the FormData object
//     const finalUploadData = new FormData();

//     // 3. Append the two required parts
//     // Part 1: The 'banner' part as a JSON Blob
//     finalUploadData.append('banner', new Blob([JSON.stringify(bannerMetadata)], { type: 'application/json' }));
//     // Part 2: The 'file' part
//     finalUploadData.append('file', formData.html_file);
    
//     try {
//       await axios.post(`${API_BASE_URL}/api/banners`, finalUploadData, {
//         headers: { 'Authorization': `Bearer ${token}` } // 'Content-Type' is set automatically by axios for FormData
//       });

//       setSubmissionStatus({ message: 'Banner has been uploaded successfully!', type: 'success' });
//     } catch (error) {
//       console.error("Submission failed:", error);
//       const errorMessage = error.response?.data?.message || 'An unexpected error occurred during the final submission.';
//       setSubmissionStatus({ message: errorMessage, type: 'error' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: /* No changes */ return ( <Grid container spacing={4}><Grid item xs={12} sm={6}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth error={!!errors.client_id} helperText={errors.client_id || ' '}/></Grid><Grid item xs={12} sm={6}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth error={!!errors.pan_id} helperText={errors.pan_id || ' '}/></Grid><Grid item xs={12}><FormControl fullWidth error={!!errors.channel}><InputLabel>Channel</InputLabel><Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select><FormHelperText>{errors.channel || ' '}</FormHelperText></FormControl></Grid></Grid> );
//       case 1: /* No changes */ return ( <Grid container spacing={4} alignItems="center"><Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth helperText=" "/></Grid><Grid item xs={12} sm={6}><TextField name="device_type" label="Detected Device Type" value={formData.device_type} fullWidth InputProps={{ readOnly: true }} helperText=" "/></Grid><Grid item xs={12}><Button variant="outlined" startIcon={locationStatus.loading ? <CircularProgress size={20}/> : <MyLocationIcon />} onClick={handleGetLocation} disabled={locationStatus.loading}>Get Current Location</Button>{formData.geolocation && <Typography variant="body2" sx={{mt:1}}>Coordinates: {formData.geolocation}</Typography>}{locationStatus.error && <Typography variant="body2" color="error" sx={{mt:1}}>{locationStatus.error}</Typography>}</Grid><Grid item xs={12} sm={6}><TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_from} helperText={errors.valid_from || ' '} /></Grid><Grid item xs={12} sm={6}><TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_to} helperText={errors.valid_to || ' '} /></Grid></Grid> );
//       case 2: // MODIFIED: Added Click Action URL field
//         return (
//           <Grid container spacing={4}>
//             <Grid item xs={12}><FormControl fullWidth error={!!errors.html_file}><Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}><input type="file" accept=".html" hidden onChange={handleFileChange} />Upload HTML File</Button>{formData.html_file && <Typography variant="body2" sx={{mt:1, ml: 2}}>Selected: {formData.html_file.name}</Typography>}<FormHelperText sx={{ml: 2}}>{errors.html_file || ' '}</FormHelperText></FormControl></Grid>
//             <Grid item xs={12}>
//               <TextField name="clickAction" label="Click Action URL" value={formData.clickAction} onChange={handleChange} fullWidth error={!!errors.clickAction} helperText={errors.clickAction || 'e.g., https://example.com/offer'}/>
//             </Grid>
//             <Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth error={!!errors.priority} helperText={errors.priority || ' '} /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth helperText=" "/></Grid>
//             <Grid item xs={12}><FormControl fullWidth><InputLabel>Status</InputLabel><Select name="status" value={formData.status} label="Status" onChange={handleChange}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select><FormHelperText> </FormHelperText></FormControl></Grid>
//           </Grid>
//         );
//       case 3: // No changes
//         return ( <Box><Typography variant="h6" gutterBottom>Review Your Banner Details</Typography><Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>{Object.entries(formData).map(([key, value]) => {if (!value) return null;const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);return ( <Typography key={key} sx={{mb: 1}}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}</Typography> );})}</Paper>{submissionStatus.message && (<Alert severity={submissionStatus.type} sx={{ mt: 3 }}><AlertTitle>{submissionStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>{submissionStatus.message}</Alert>)}</Box>);
//       default: return 'Unknown step';
//     }
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>Follow the simple 4 steps to complete your banner upload.</Typography>
//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         <Grid item xs={12} md={4}>
//           <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label} completed={index < activeStep}>
//                 <StepLabel onClick={() => handleStepClick(index)} StepIconComponent={QontoStepIcon} sx={{ p: 1, borderRadius: 2, cursor: index < activeStep ? 'pointer' : 'default', '&:hover': { backgroundColor: index < activeStep ? 'action.hover' : 'transparent' } }}>
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//             <Box>{getStepContent(activeStep)}</Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//               <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//               <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} disabled={isSubmitting || submissionStatus.type === 'success'}>
//                 {activeStep === steps.length - 1 ? (isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Finish') : 'Next'}
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;


// final code decided till now 

// import React from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   styled,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   Autocomplete, // <-- Import Autocomplete
// } from '@mui/material';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import Check from '@mui/icons-material/Check';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// // --- Styled Components (Unchanged) ---
// const QontoConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0', borderTopWidth: 3, borderRadius: 1 },
// }));
// const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0', display: 'flex', height: 22, alignItems: 'center',
//   ...(ownerState.active && { color: theme.palette.primary.main }),
//   '& .QontoStepIcon-completedIcon': { color: theme.palette.primary.main, zIndex: 1, fontSize: 24 },
//   '& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
// }));
// function QontoStepIcon(props) {
//   const { active, completed } = props;
//   return (<QontoStepIconRoot ownerState={{ active }}>{completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}</QontoStepIconRoot>);
// }
// // --- End of Styled Components ---

// const steps = ['Banner Details', 'Targeting & Scheduling', 'Content & Configuration', 'Review & Submit'];
// const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
// const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'All India']; // Predefined locations

// const BannerUpload = () => {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [formData, setFormData] = React.useState({
//     client_id: '', pan_id: '', channel: '', language: 'en-US', device_type: '', geolocation: '',
//     valid_from: '', valid_to: '', html_file: null, priority: 5, segment_tag: '', status: 'draft',
//     clickAction: '',
//   });
//   const [errors, setErrors] = React.useState({});
//   const [isSubmitting, setIsSubmitting] = React.useState(false);
//   const [submissionStatus, setSubmissionStatus] = React.useState({ message: '', type: '' });

//   // REMOVED: The useEffect for auto-detecting device type is no longer needed.

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.client_id.trim()) newErrors.client_id = 'Client ID is required.';
//         if (!formData.pan_id.trim()) newErrors.pan_id = 'PAN ID is required.';
//         else if (!PAN_REGEX.test(formData.pan_id)) newErrors.pan_id = 'Invalid PAN ID format.';
//         if (!formData.channel) newErrors.channel = 'Channel is required.';
//         break;
//       case 1: // MODIFIED: Added validation for new required fields
//         if (!formData.device_type) newErrors.device_type = 'Device type is required.';
//         if (!formData.geolocation) newErrors.geolocation = 'Geolocation is required.';
//         if (!formData.valid_from) newErrors.valid_from = 'Start date is required.';
//         if (!formData.valid_to) newErrors.valid_to = 'End date is required.';
//         else if (formData.valid_from && new Date(formData.valid_to) <= new Date(formData.valid_from)) newErrors.valid_to = 'End date must be after the start date.';
//         break;
//       case 2:
//         if (!formData.html_file) newErrors.html_file = 'An HTML file is required for upload.';
//         if (!formData.clickAction.trim()) newErrors.clickAction = 'Click Action URL is required.';
//         if (formData.priority === '' || formData.priority === null) newErrors.priority = 'Priority is required.';
//         else if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1 and 10.';
//         break;
//       default: break;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => { if (validateStep(activeStep)) { setActiveStep((prev) => prev + 1); } };
//   const handleBack = () => { setSubmissionStatus({ message: '', type: '' }); setActiveStep((prev) => prev - 1); };
//   const handleStepClick = (step) => { if (step < activeStep) { setSubmissionStatus({ message: '', type: '' }); setActiveStep(step); } };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) { setErrors({ ...errors, [name]: null }); }
//   };

//   // NEW: Specific handler for the Autocomplete component
//   const handleAutocompleteChange = (name, newValue) => {
//     setFormData({ ...formData, [name]: newValue });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };

//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFormData({...formData, html_file: event.target.files[0]});
//       if (errors.html_file) { setErrors({...errors, html_file: null}); }
//     }
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmissionStatus({ message: '', type: '' });
//     const token = localStorage.getItem('authToken');
//     // --- FIXED: Using import.meta.env for Vite environment variables ---
//     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//     const bannerMetadata = {
//       clientId: formData.client_id, panId: formData.pan_id, channel: formData.channel,
//       clickAction: formData.clickAction, priority: formData.priority, validFrom: formData.valid_from,
//       validTo: formData.valid_to, language: formData.language, segmentTag: formData.segment_tag,
//       deviceType: formData.device_type, geoLocation: formData.geolocation, status: formData.status
//     };

//     const finalUploadData = new FormData();
//     finalUploadData.append('banner', new Blob([JSON.stringify(bannerMetadata)], { type: 'application/json' }));
//     finalUploadData.append('file', formData.html_file);
    
//     // --- KEPT AS REQUESTED: Debug logging to the console ---
//     console.log("%c--- Submitting Banner Data ---", "color: #1E90FF; font-size: 16px; font-weight: bold;");
//     console.log("%c1. Metadata JSON part:", "font-weight: bold;");
//     console.log(bannerMetadata);
//     console.log("%c2. Full FormData parts being sent:", "font-weight: bold;");
//     for (let [key, value] of finalUploadData.entries()) {
//       console.log(`   - Key: '${key}'`, " | Value:", value);
//     }
//     console.log("%c3. Target Endpoint:", "font-weight: bold;");
//     console.log(`${API_BASE_URL}/api/banners`);
//     console.log("---------------------------------");
    
//     try {
//       await axios.post(`${API_BASE_URL}/api/banners`, finalUploadData, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setSubmissionStatus({ message: 'Banner has been uploaded successfully!', type: 'success' });
//     } catch (error) {
//       console.error("Submission failed:", error);
//       const errorMessage = error.response?.data?.message || 'An unexpected error occurred during the final submission.';
//       setSubmissionStatus({ message: errorMessage, type: 'error' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: return ( <Grid container spacing={4}><Grid item xs={12} sm={6}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth error={!!errors.client_id} helperText={errors.client_id || ' '}/></Grid><Grid item xs={12} sm={6}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth error={!!errors.pan_id} helperText={errors.pan_id || ' '}/></Grid><Grid item xs={12}><FormControl fullWidth error={!!errors.channel}><InputLabel>Channel</InputLabel><Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select><FormHelperText>{errors.channel || ' '}</FormHelperText></FormControl></Grid></Grid> );
//       case 1: // --- MODIFIED: Device Type and Geolocation are now inputs ---
//         return (
//           <Grid container spacing={4} alignItems="flex-start">
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={!!errors.device_type}>
//                 <InputLabel>Device Type</InputLabel>
//                 <Select name="device_type" value={formData.device_type} label="Device Type" onChange={handleChange}>
//                   <MenuItem value="desktop">Desktop</MenuItem>
//                   <MenuItem value="mobile">Mobile</MenuItem>
//                   <MenuItem value="tablet">Tablet</MenuItem>
//                 </Select>
//                 <FormHelperText>{errors.device_type || ' '}</FormHelperText>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Autocomplete
//                 freeSolo
//                 options={locations}
//                 value={formData.geolocation}
//                 onChange={(event, newValue) => {
//                   handleAutocompleteChange('geolocation', newValue || '');
//                 }}
//                 onInputChange={(event, newInputValue) => {
//                   handleAutocompleteChange('geolocation', newInputValue);
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Geolocation"
//                     error={!!errors.geolocation}
//                     helperText={errors.geolocation || ' '}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth helperText=" "/></Grid>
//             <Grid item xs={12} sm={6}></Grid> {/* Empty grid item for alignment */}
//             <Grid item xs={12} sm={6}><TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_from} helperText={errors.valid_from || ' '} /></Grid>
//             <Grid item xs={12} sm={6}><TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_to} helperText={errors.valid_to || ' '} /></Grid>
//           </Grid>
//         );
//       case 2: return ( <Grid container spacing={4}><Grid item xs={12}><FormControl fullWidth error={!!errors.html_file}><Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}><input type="file" accept=".html" hidden onChange={handleFileChange} />Upload HTML File</Button>{formData.html_file && <Typography variant="body2" sx={{mt:1, ml: 2}}>Selected: {formData.html_file.name}</Typography>}<FormHelperText sx={{ml: 2}}>{errors.html_file || ' '}</FormHelperText></FormControl></Grid><Grid item xs={12}><TextField name="clickAction" label="Click Action URL" value={formData.clickAction} onChange={handleChange} fullWidth error={!!errors.clickAction} helperText={errors.clickAction || 'e.g., https://example.com/offer'}/></Grid><Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth error={!!errors.priority} helperText={errors.priority || ' '} /></Grid><Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth helperText=" "/></Grid><Grid item xs={12}><FormControl fullWidth><InputLabel>Status</InputLabel><Select name="status" value={formData.status} label="Status" onChange={handleChange}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select><FormHelperText> </FormHelperText></FormControl></Grid></Grid> );
//       case 3: return ( <Box><Typography variant="h6" gutterBottom>Review Your Banner Details</Typography><Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>{Object.entries(formData).map(([key, value]) => {if (!value) return null;const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);return ( <Typography key={key} sx={{mb: 1}}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}</Typography> );})}</Paper>{submissionStatus.message && (<Alert severity={submissionStatus.type} sx={{ mt: 3 }}><AlertTitle>{submissionStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>{submissionStatus.message}</Alert>)}</Box>);
//       default: return 'Unknown step';
//     }
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 } }}>
//       <Typography variant="h4" gutterBottom>Create New Banner</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>Follow the simple 4 steps to complete your banner upload.</Typography>
//       <Grid container spacing={{ xs: 2, md: 5 }}>
//         <Grid item xs={12} md={4}>
//           <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
//             {steps.map((label, index) => (
//               <Step key={label} completed={index < activeStep}>
//                 <StepLabel onClick={() => handleStepClick(index)} StepIconComponent={QontoStepIcon} sx={{ p: 1, borderRadius: 2, cursor: index < activeStep ? 'pointer' : 'default', '&:hover': { backgroundColor: index < activeStep ? 'action.hover' : 'transparent' } }}>
//                   <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
//                 </StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//             <Box>{getStepContent(activeStep)}</Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//               <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//               <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} disabled={isSubmitting || submissionStatus.type === 'success'}>
//                 {activeStep === steps.length - 1 ? (isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Finish') : 'Next'}
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default BannerUpload;

import React from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  styled,
  CircularProgress,
  Alert,
  AlertTitle,
  Autocomplete,
} from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Check from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// --- Styled Components (Unchanged) ---
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
  [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0', borderTopWidth: 3, borderRadius: 1 },
}));
const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0', display: 'flex', height: 22, alignItems: 'center',
  ...(ownerState.active && { color: theme.palette.primary.main }),
  '& .QontoStepIcon-completedIcon': { color: theme.palette.primary.main, zIndex: 1, fontSize: 24 },
  '& .QontoStepIcon-circle': { width: 12, height: 12, borderRadius: '50%', backgroundColor: 'currentColor' },
}));
function QontoStepIcon(props) {
  const { active, completed } = props;
  return (<QontoStepIconRoot ownerState={{ active }}>{completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}</QontoStepIconRoot>);
}
// --- End of Styled Components ---

const steps = ['Banner Details', 'Targeting & Scheduling', 'Content & Configuration', 'Review & Submit'];
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'All India'];

const BannerUpload = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    client_id: '', pan_id: '', channel: '', language: 'en-US', device_type: '', geolocation: '',
    valid_from: '', valid_to: '', file: null, // MODIFIED: Renamed from html_file to generic 'file'
    priority: 5, segment_tag: '', status: 'draft', clickAction: '',
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState({ message: '', type: '' });

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!formData.client_id.trim()) newErrors.client_id = 'Client ID is required.';
        if (!formData.pan_id.trim()) newErrors.pan_id = 'PAN ID is required.';
        else if (!PAN_REGEX.test(formData.pan_id)) newErrors.pan_id = 'Invalid PAN ID format.';
        if (!formData.channel) newErrors.channel = 'Channel is required.';
        break;
      case 1:
        if (!formData.device_type) newErrors.device_type = 'Device type is required.';
        if (!formData.geolocation) newErrors.geolocation = 'Geolocation is required.';
        if (!formData.valid_from) newErrors.valid_from = 'Start date is required.';
        if (!formData.valid_to) newErrors.valid_to = 'End date is required.';
        else if (formData.valid_from && new Date(formData.valid_to) <= new Date(formData.valid_from)) newErrors.valid_to = 'End date must be after the start date.';
        break;
      case 2:
        // MODIFIED: Updated validation logic
        if (!formData.file) newErrors.file = 'A .zip file is required for upload.';
        if (!formData.clickAction.trim()) newErrors.clickAction = 'Click Action URL is required.';
        if (formData.priority === '' || formData.priority === null) newErrors.priority = 'Priority is required.';
        else if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1 and 10.';
        break;
      default: break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(activeStep)) { setActiveStep((prev) => prev + 1); } };
  const handleBack = () => { setSubmissionStatus({ message: '', type: '' }); setActiveStep((prev) => prev - 1); };
  const handleStepClick = (step) => { if (step < activeStep) { setSubmissionStatus({ message: '', type: '' }); setActiveStep(step); } };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) { setErrors({ ...errors, [name]: null }); }
  };
  const handleAutocompleteChange = (name, newValue) => {
    setFormData({ ...formData, [name]: newValue });
    if (errors[name]) { setErrors({ ...errors, [name]: null }); }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // MODIFIED: Check for .zip extension instead of mime type for reliability
      if (file.name.toLowerCase().endsWith('.zip')) {
        setFormData({...formData, file: file});
        if (errors.file) {
          setErrors({...errors, file: null});
        }
      } else {
        alert('Invalid file type. Please upload a .zip file.');
        event.target.value = null; // Clear the input
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionStatus({ message: '', type: '' });
    const token = localStorage.getItem('authToken');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const bannerMetadata = {
      clientId: formData.client_id, panId: formData.pan_id, channel: formData.channel,
      clickAction: formData.clickAction, priority: formData.priority, validFrom: formData.valid_from,
      validTo: formData.valid_to, language: formData.language, segmentTag: formData.segment_tag,
      deviceType: formData.device_type, geoLocation: formData.geolocation, status: formData.status
    };

    const finalUploadData = new FormData();
    finalUploadData.append('banner', new Blob([JSON.stringify(bannerMetadata)], { type: 'application/json' }));
    finalUploadData.append('file', formData.file); // MODIFIED: Uses the generic 'file' state
    
    console.log("%c--- Submitting Banner Data ---", "color: #1E90FF; font-size: 16px; font-weight: bold;");
    console.log("%c1. Metadata JSON part:", "font-weight: bold;"); console.log(bannerMetadata);
    console.log("%c2. Full FormData parts being sent:", "font-weight: bold;");
    for (let [key, value] of finalUploadData.entries()) { console.log(`   - Key: '${key}'`, " | Value:", value); }
    console.log("%c3. Target Endpoint:", "font-weight: bold;"); console.log(`${API_BASE_URL}/api/banners`);
    console.log("---------------------------------");
    
    try {
      await axios.post(`${API_BASE_URL}/api/banners`, finalUploadData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSubmissionStatus({ message: 'Banner has been uploaded successfully!', type: 'success' });
    } catch (error) {
      console.error("Submission failed:", error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred during the final submission.';
      setSubmissionStatus({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: return ( <Grid container spacing={4}><Grid item xs={12} sm={6}><TextField name="client_id" label="Client ID" value={formData.client_id} onChange={handleChange} fullWidth error={!!errors.client_id} helperText={errors.client_id || ' '}/></Grid><Grid item xs={12} sm={6}><TextField name="pan_id" label="PAN ID" value={formData.pan_id} onChange={handleChange} fullWidth error={!!errors.pan_id} helperText={errors.pan_id || ' '}/></Grid><Grid item xs={12}><FormControl fullWidth error={!!errors.channel}><InputLabel>Channel</InputLabel><Select name="channel" value={formData.channel} label="Channel" onChange={handleChange}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select><FormHelperText>{errors.channel || ' '}</FormHelperText></FormControl></Grid></Grid> );
      case 1: return ( <Grid container spacing={4} alignItems="flex-start"><Grid item xs={12} sm={6}><FormControl fullWidth error={!!errors.device_type}><InputLabel>Device Type</InputLabel><Select name="device_type" value={formData.device_type} label="Device Type" onChange={handleChange}><MenuItem value="desktop">Desktop</MenuItem><MenuItem value="mobile">Mobile</MenuItem><MenuItem value="tablet">Tablet</MenuItem></Select><FormHelperText>{errors.device_type || ' '}</FormHelperText></FormControl></Grid><Grid item xs={12} sm={6}><Autocomplete freeSolo options={locations} value={formData.geolocation} onChange={(event, newValue) => { handleAutocompleteChange('geolocation', newValue || ''); }} onInputChange={(event, newInputValue) => { handleAutocompleteChange('geolocation', newInputValue); }} renderInput={(params) => (<TextField {...params} label="Geolocation" error={!!errors.geolocation} helperText={errors.geolocation || ' '}/>)}/></Grid><Grid item xs={12} sm={6}><TextField name="language" label="Language (e.g., en-US)" value={formData.language} onChange={handleChange} fullWidth helperText=" "/></Grid><Grid item xs={12} sm={6}></Grid><Grid item xs={12} sm={6}><TextField name="valid_from" label="Valid From" type="datetime-local" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_from} helperText={errors.valid_from || ' '} /></Grid><Grid item xs={12} sm={6}><TextField name="valid_to" label="Valid To" type="datetime-local" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.valid_to} helperText={errors.valid_to || ' '} /></Grid></Grid> );
      case 2:
        return (
          <Grid container spacing={4}>
            {/* --- MODIFIED: File Input now accepts .zip --- */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.file}>
                <Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                  Upload .ZIP File
                  <input type="file" accept=".zip,application/zip,application/x-zip-compressed" hidden onChange={handleFileChange} />
                </Button>
                {formData.file && <Typography variant="body2" sx={{mt:1, ml: 2}}>Selected: {formData.file.name}</Typography>}
                <FormHelperText sx={{ml: 2}}>{errors.file || ' '}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField name="clickAction" label="Click Action URL" value={formData.clickAction} onChange={handleChange} fullWidth error={!!errors.clickAction} helperText={errors.clickAction || 'e.g., https://example.com/offer'}/></Grid>
            <Grid item xs={12} sm={6}><TextField name="priority" label="Priority (1-10)" type="number" value={formData.priority} onChange={handleChange} fullWidth error={!!errors.priority} helperText={errors.priority || ' '} /></Grid>
            <Grid item xs={12} sm={6}><TextField name="segment_tag" label="Segment Tag" value={formData.segment_tag} onChange={handleChange} fullWidth helperText=" "/></Grid>
            <Grid item xs={12}><FormControl fullWidth><InputLabel>Status</InputLabel><Select name="status" value={formData.status} label="Status" onChange={handleChange}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select><FormHelperText> </FormHelperText></FormControl></Grid>
          </Grid>
        );
      case 3: return ( <Box><Typography variant="h6" gutterBottom>Review Your Banner Details</Typography><Paper variant="outlined" sx={{p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>{Object.entries(formData).map(([key, value]) => {if (!value) return null;const displayValue = typeof value === 'object' && value !== null ? value.name : String(value);return ( <Typography key={key} sx={{mb: 1}}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}</Typography> );})}</Paper>{submissionStatus.message && (<Alert severity={submissionStatus.type} sx={{ mt: 3 }}><AlertTitle>{submissionStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>{submissionStatus.message}</Alert>)}</Box>);
      default: return 'Unknown step';
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>Create New Banner</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>Follow the simple 4 steps to complete your banner upload.</Typography>
      <Grid container spacing={{ xs: 2, md: 5 }}>
        <Grid item xs={12} md={4}>
          <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel onClick={() => handleStepClick(index)} StepIconComponent={QontoStepIcon} sx={{ p: 1, borderRadius: 2, cursor: index < activeStep ? 'pointer' : 'default', '&:hover': { backgroundColor: index < activeStep ? 'action.hover' : 'transparent' } }}>
                  <Typography variant="h6" sx={{fontWeight: activeStep === index ? 'bold' : 'normal'}}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>{getStepContent(activeStep)}</Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
              <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} disabled={isSubmitting || submissionStatus.type === 'success'}>
                {activeStep === steps.length - 1 ? (isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Finish') : 'Next'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BannerUpload;