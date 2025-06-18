import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Typography, 
  Avatar,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  // UPDATED: Import Dialog components
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// UPDATED: Import the warning icon
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import styles from './Login.module.css';

// --- Validation Regex ---
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  
  // UPDATED: State is now for the dialog, not the snackbar
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });

  // ... (No changes to handleInputChange or validateForm)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    // ... same validation logic
    let tempErrors = { email: '', password: '' };
    let isValid = true;
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!formData.password.trim() || !PASSWORD_REGEX.test(formData.password)) {
      tempErrors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character.';
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  // UPDATED: These functions now control the Dialog
  const handleDialogClose = () => {
    setErrorDialog({ open: false, message: '' });
  };
  
  const showApiError = (message) => {
    const defaultMessage = "An unexpected error has occurred. Please try again later. Contact support if the error persists.";
    setErrorDialog({ open: true, message: message || defaultMessage });
  };

  // UPDATED: handleSubmit now calls the new showApiError
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
        showApiError('API URL is not configured. Please check your .env file.');
        setIsLoading(false);
        return;
    }

    const requestBody = {
      username: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.jwt);
        window.location.href = '/dashboard';
      } else {
        showApiError(data.message);
      }
    } catch (error) {
      console.error('Login request error:', error);
      showApiError('Could not connect to the server. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

// Find the 'return (' line in your Login.jsx file.
// Replace everything from there to the closing ');' with this code.

return (
    <div className={styles.loginPage}>
      <Paper 
        elevation={8}
        sx={{
          position: 'relative',
          maxWidth: 400, 
          width: '90%',
          borderRadius: '20px',
          background: '#ffffff',
          padding: '80px 40px 40px 40px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Avatar
          sx={{
            width: 90,
            height: 90,
            background: '#2d3748', 
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '4px solid #ffffff'
          }}
        >
          <PersonOutlineIcon sx={{ fontSize: 50, color: '#ffffff' }} />
        </Avatar>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email ID"
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: '#718096' }}/>
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />
          
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#718096' }}/>
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 2 }}>
            <FormControlLabel
              control={<Checkbox value="remember" sx={{ color: '#2d3748' }} />}
              label={<Typography sx={{ color: '#4a5568', fontSize: '0.9rem' }}>Remember me</Typography>}
            />
          </Box>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={isLoading}
            sx={{
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              textTransform: 'none',
              background: '#2d3748', 
              '&:hover': {
                background: '#1a202c',
              },
            }}
          >
            LOGIN
          </LoadingButton>
        </Box>
      </Paper>

      {/* The Dialog for showing errors */}
      <Dialog
        open={errorDialog.open}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '420px',
            padding: { xs: '1rem', sm: '1.5rem' },
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', padding: '0 !important' }}>
          <WarningAmberIcon sx={{ fontSize: 60, color: '#ef5350' }} />
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', p: '12px 0 4px 0' }}>
            Something went wrong
          </DialogTitle>
          <DialogContentText sx={{ color: 'text.secondary', mb: 3 }}>
            {errorDialog.message}
          </DialogContentText>
          <Button 
            onClick={handleDialogClose} 
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#f9a825',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '1rem',
              padding: '10px 0',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#f57f17'
              }
            }}
          >
            Go Back
          </Button>
        </DialogContent>
      </Dialog>
    </div>
);
};

// ... (textFieldStyles constant remains the same) ...
// Paste this code block right before the export default line
const textFieldStyles = {
  '& .MuiInputBase-root': {
    color: '#2d3748', // Dark text
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#e2e8f0', // Light grey border
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1', // Slightly darker border on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2d3748', // Dark slate border on focus
    },
  },
  '& label': {
    color: '#718096', // Medium grey label
  },
  '& label.Mui-focused': {
    color: '#2d3748', // Dark label on focus
  },
  '& .MuiFormHelperText-root': {
    color: '#d32f2f', // Standard MUI error red
  }
};

export default LoginPage;