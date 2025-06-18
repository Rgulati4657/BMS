
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