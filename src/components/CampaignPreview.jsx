// src/components/CampaignPreview.js

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Link as MuiLink // Renaming to avoid conflict with react-router-dom Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import JSZip from 'jszip';

// This is the core logic to process a single banner from the API response
const processSingleBanner = async (bannerInfo) => {
  try {
    // 1. Fetch the banner's ZIP file from the provided URL
    const zipResponse = await fetch(bannerInfo.imageUrl);
    if (!zipResponse.ok) throw new Error(`Failed to download ZIP. Status: ${zipResponse.status}`);
    
    const zipBlob = await zipResponse.blob();
    const zip = await JSZip.loadAsync(zipBlob);
    const filesInZip = Object.keys(zip.files);
    
    // 2. Find the root HTML file (not in a sub-folder)
    const htmlFileName = filesInZip.find(name => !name.includes('/') && name.endsWith('.html'));
    if (!htmlFileName) throw new Error(`No root HTML file found in ZIP for bannerId ${bannerInfo.bannerId}`);
    
    let bannerHtml = await zip.file(htmlFileName).async('string');
    const imageFiles = filesInZip.filter(name => /\.(jpg|jpeg|png|gif|svg)$/i.test(name));

    // 3. Find all images, convert them to Base64, and embed them in the HTML
    for (const imagePath of imageFiles) {
      const imageFile = zip.file(imagePath);
      if (imageFile) {
        const imageBlob = await imageFile.async('blob');
        const dataUrl = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(imageBlob);
        });
        // Use a regular expression to replace the image path in the HTML
        const pathRegex = new RegExp(`['"]${imagePath}['"]`, 'g');
        bannerHtml = bannerHtml.replace(pathRegex, `"${dataUrl}"`);
      }
    }

    // 4. Return the fully processed banner data
    return {
      bannerId: bannerInfo.bannerId,
      clickAction: bannerInfo.clickAction,
      htmlContent: bannerHtml,
    };
  } catch (error) {
    console.error(`Error processing banner ${bannerInfo.bannerId}:`, error);
    return { bannerId: bannerInfo.bannerId, error: error.message };
  }
};

const CampaignPreview = () => {
  const [clientId, setClientId] = useState('8000');
  const [panId, setPanId] = useState('ABCDE1234F');
  const [channel, setChannel] = useState('netbanking');
  const [processedBanners, setProcessedBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setProcessedBanners([]);

    const API_BASE_URL = 'http://192.168.1.7:8080'; // IMPORTANT: Make sure this is correct
    const params = new URLSearchParams({ clientId, panId, channel });
    const fullApiUrl = `${API_BASE_URL}/api/banners?${params}`;

    try {
      const response = await fetch(fullApiUrl);
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
      const bannersFromApi = await response.json();
      if (!Array.isArray(bannersFromApi) || bannersFromApi.length === 0) {
        setError("No active banners were found for the provided details.");
        setIsLoading(false);
        return;
      }

      // Process all banners concurrently
      const allProcessedData = await Promise.all(
        bannersFromApi.map(bannerInfo => processSingleBanner(bannerInfo))
      );
      
      // Filter out any banners that had processing errors
      const successfulBanners = allProcessedData.filter(b => b && !b.error);
      const failedBanners = allProcessedData.filter(b => b && b.error);

      if (failedBanners.length > 0) {
         console.error("Some banners failed to process:", failedBanners);
         setError(`Successfully loaded ${successfulBanners.length} banners, but ${failedBanners.length} failed to process. Check console for details.`);
      }

      setProcessedBanners(successfulBanners);

    } catch (err) {
      setError(`Failed to fetch data: ${err.message}. Please check the API server and network connection.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Campaign Live Preview
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Enter campaign details to fetch and preview live banners.
      </Typography>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} sm={4} md={3}>
            <TextField fullWidth label="Client ID" variant="outlined" value={clientId} onChange={e => setClientId(e.target.value)} required />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField fullWidth label="PAN ID" variant="outlined" value={panId} onChange={e => setPanId(e.target.value)} required />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField fullWidth label="Channel" variant="outlined" value={channel} onChange={e => setChannel(e.target.value)} required />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              fullWidth
              disabled={isLoading} 
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            >
              {isLoading ? 'Fetching...' : 'Fetch Banners'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      
      {processedBanners.length > 0 && (
        <Grid container spacing={4}>
          {processedBanners.map((banner) => (
            <Grid item key={banner.bannerId} xs={12} sm={6} md={4}>
              <Card>
                {/* The MuiLink component acts as the clickable area */}
                <MuiLink href={banner.clickAction} target="_blank" rel="noopener noreferrer" underline="none">
                  <iframe
                    title={`Banner ${banner.bannerId}`}
                    srcDoc={banner.htmlContent}
                    scrolling="no"
                    sandbox="allow-scripts" // Security sandbox, allows scripts within the iframe
                    style={{ 
                      width: '100%', 
                      height: '250px', 
                      border: 0, 
                      display: 'block',
                      pointerEvents: 'none' // CRITICAL: This allows clicks to pass through to the parent Link
                    }}
                  />
                </MuiLink>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Banner ID: {banner.bannerId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CampaignPreview;