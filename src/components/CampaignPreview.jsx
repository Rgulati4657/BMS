
// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import JSZip from 'jszip';
// import BannerFrame from './BannerFrame'; // <-- Import our new component

// // --- FINAL and MOST ROBUST image processing logic ---
// const processSingleBanner = async (bannerInfo) => {
//   try {
//     const zipResponse = await fetch(bannerInfo.imageUrl);
//     if (!zipResponse.ok) throw new Error(`Failed to download ZIP. Status: ${zipResponse.status}`);

//     const zipBlob = await zipResponse.blob();
//     const zip = await JSZip.loadAsync(zipBlob);

//     // Find HTML file, same as before
//     const htmlFileName = Object.keys(zip.files).find(name => name.endsWith('.html') && !zip.files[name].dir);
//     if (!htmlFileName) throw new Error(`No .html file found in the ZIP.`);

//     const bannerHtml = await zip.file(htmlFileName).async('string');
//     const htmlDir = htmlFileName.includes('/') ? htmlFileName.substring(0, htmlFileName.lastIndexOf('/') + 1) : '';

//     // --- NEW RELIABLE METHOD: Use DOM Parsing, not Regex ---
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = bannerHtml;
    
//     const imageTags = tempDiv.querySelectorAll('img');
//     const filesInZip = zip.files;

//     for (const imgTag of imageTags) {
//       let src = imgTag.getAttribute('src');
//       if (!src) continue;

//       // The 'src' from the HTML, e.g., "images/logo.png" or "./images/logo.png"
//       let decodedSrc = decodeURIComponent(src);
//       if (decodedSrc.startsWith('./')) {
//         decodedSrc = decodedSrc.substring(2);
//       }
//       const fullPathInZip = htmlDir + decodedSrc;

//       // Find the file in the zip, case-insensitively for robustness
//       const zipEntryKey = Object.keys(filesInZip).find(
//         key => key.toLowerCase() === fullPathInZip.toLowerCase()
//       );

//       const imageFile = zipEntryKey ? filesInZip[zipEntryKey] : null;

//       if (imageFile) {
//         const mimeType = `image/${zipEntryKey.split('.').pop().toLowerCase()}`;
//         const base64Data = await imageFile.async('base64');
//         imgTag.src = `data:${mimeType};base64,${base64Data}`;
//       } else {
//         console.warn(`Image not found in ZIP: ${fullPathInZip}`);
//       }
//     }

//     return {
//       bannerId: bannerInfo.bannerId,
//       clickAction: bannerInfo.clickAction,
//       htmlContent: tempDiv.innerHTML, // Return the modified HTML with embedded images
//     };

//   } catch (error) {
//     console.error(`Error processing banner ${bannerInfo.bannerId}:`, error);
//     return { bannerId: bannerInfo.bannerId, error: error.message };
//   }
// };


// const CampaignPreview = () => {
//   const [clientId, setClientId] = useState('6000');
//   const [panId, setPanId] = useState('ABCDE1234F');
//   const [channel, setChannel] = useState('netbanking');
//   const [processedBanners, setProcessedBanners] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setProcessedBanners([]);

//     const API_BASE_URL = 'http://192.168.1.7:8080';
//     const params = new URLSearchParams({ clientId, panId, channel });
//     const fullApiUrl = `${API_BASE_URL}/api/banners?${params}`;

//     try {
//       const response = await fetch(fullApiUrl);
//       if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
//       const bannersFromApi = await response.json();
//       if (!Array.isArray(bannersFromApi) || bannersFromApi.length === 0) {
//         setError("No active banners were found for the provided details.");
//         return;
//       }

//       const allProcessedData = await Promise.all(
//         bannersFromApi.map(bannerInfo => processSingleBanner(bannerInfo))
//       );
      
//       setProcessedBanners(allProcessedData.filter(b => b && !b.error));
//       const failedCount = allProcessedData.filter(b => b && b.error).length;
//       if (failedCount > 0) {
//         setError(`${failedCount} banner(s) failed to process. Check the console for details.`);
//       }

//     } catch (err) {
//       setError(`Failed to fetch data: ${err.message}.`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // return (
//   //   <Container maxWidth="lg">
//   //     <Typography variant="h4" gutterBottom>Campaign Live Preview</Typography>
//   //     <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//   //       Enter campaign details to fetch and preview live banners.
//   //     </Typography>

//   //     <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
//   //       <Grid container spacing={3} alignItems="flex-end">
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="Client ID" variant="outlined" value={clientId} onChange={e => setClientId(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="PAN ID" variant="outlined" value={panId} onChange={e => setPanId(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="Channel" variant="outlined" value={channel} onChange={e => setChannel(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} md={3}>
//   //           <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}>
//   //             {isLoading ? 'Fetching...' : 'Fetch Banners'}
//   //           </Button>
//   //         </Grid>
//   //       </Grid>
//   //     </Paper>

//   //     {error && <Alert severity="warning" sx={{ mb: 4 }}>{error}</Alert>}
      
//   //     {processedBanners.length > 0 && (
//   //       <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
//   //         {processedBanners.map((banner) => (
//   //           <Grid item key={banner.bannerId}>
//   //             {/* Use the new intelligent BannerFrame component */}
//   //             <BannerFrame banner={banner} />
//   //           </Grid>
//   //         ))}
//   //       </Grid>
//   //     )}
//   //   </Container>
//   // );
// // In src/components/CampaignPreview.jsx

//   // ... (all the code above the return statement is perfect and stays the same)

//   // return (
//   //   <Container maxWidth="lg">
//   //     <Typography variant="h4" gutterBottom>Campaign Live Preview</Typography>
//   //     <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//   //       Enter campaign details to fetch and preview live banners.
//   //     </Typography>

//   //     <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
//   //       {/* The form part is perfect, no changes here */}
//   //       <Grid container spacing={3} alignItems="flex-end">
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="Client ID" variant="outlined" value={clientId} onChange={e => setClientId(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="PAN ID" variant="outlined" value={panId} onChange={e => setPanId(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="Channel" variant="outlined" value={channel} onChange={e => setChannel(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} md={3}>
//   //           <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}>
//   //             {isLoading ? 'Fetching...' : 'Fetch Banners'}
//   //           </Button>
//   //         </Grid>
//   //       </Grid>
//   //     </Paper>

//   //     {error && <Alert severity="warning" sx={{ mb: 4 }}>{error}</Alert>}
      
//   //     {processedBanners.length > 0 && (
//   //       // --- THIS IS THE KEY CHANGE FOR A CLEAN GRID ---
//   //       <Grid container spacing={4}>
//   //         {processedBanners.map((banner) => (
//   //           // We now define the columns for a responsive, uniform grid
//   //           <Grid item key={banner.bannerId} xs={12} sm={6} md={4}>
//   //             <BannerFrame banner={banner} />
//   //           </Grid>
//   //         ))}
//   //       </Grid>
//   //     )}
//   //   </Container>
//   // );

// // In src/components/CampaignPreview.jsx

//   // ... (all the code above the return statement is perfect and stays the same)

//   // return (
//   //   <Container maxWidth="lg">
//   //     <Typography variant="h4" gutterBottom>Campaign Live Preview</Typography>
//   //     <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//   //       Enter campaign details to fetch and preview live banners.
//   //     </Typography>

//   //     <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
//   //       <Grid container spacing={3} alignItems="flex-end">
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="Client ID" variant="outlined" value={clientId} onChange={e => setClientId(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="PAN ID" variant="outlined" value={panId} onChange={e => setPanId(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="Channel" variant="outlined" value={channel} onChange={e => setChannel(e.target.value)} required /></Grid>
//   //         <Grid item xs={12} md={3}>
//   //           <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}>
//   //             {isLoading ? 'Fetching...' : 'Fetch Banners'}
//   //           </Button>
//   //         </Grid>
//   //       </Grid>
//   //     </Paper>

//   //     {error && <Alert severity="warning" sx={{ mb: 4 }}>{error}</Alert>}
      
//   //     {processedBanners.length > 0 && (
//   //       // --- THIS IS THE KEY LAYOUT CHANGE ---
//   //       // This creates a flexible row that wraps banners and centers them.
//   //       <Grid container spacing={5} justifyContent="center" alignItems="flex-start">
//   //         {processedBanners.map((banner) => (
//   //           // The Grid item no longer has xs/sm/md. It will be as big as its content.
//   //           <Grid item key={banner.bannerId}>
//   //             <BannerFrame banner={banner} />
//   //           </Grid>
//   //         ))}
//   //       </Grid>
//   //     )}
//   //   </Container>
//   // );  


//   // In src/components/CampaignPreview.jsx

//   // ... (all the code above the return statement is perfect and stays the same)

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" gutterBottom>Campaign Live Preview</Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//         Enter campaign details to fetch and preview live banners.
//       </Typography>

//       <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
//         {/* The form part is perfect, no changes here */}
//         <Grid container spacing={3} alignItems="flex-end">
//           <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="Client ID" variant="outlined" value={clientId} onChange={e => setClientId(e.target.value)} required /></Grid>
//           <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="PAN ID" variant="outlined" value={panId} onChange={e => setPanId(e.target.value)} required /></Grid>
//           <Grid item xs={12} sm={4} md={3}><TextField fullWidth label="Channel" variant="outlined" value={channel} onChange={e => setChannel(e.target.value)} required /></Grid>
//           <Grid item xs={12} md={3}>
//             <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}>
//               {isLoading ? 'Fetching...' : 'Fetch Banners'}
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {error && <Alert severity="warning" sx={{ mb: 4 }}>{error}</Alert>}
      
//       {processedBanners.length > 0 && (
//         // --- THIS IS THE KEY LAYOUT CHANGE ---
//         <Grid container spacing={4}>
//           {processedBanners.map((banner) => (
//             // Each banner now gets its own full-width row (12 columns)
//             <Grid item key={banner.bannerId} xs={12}>
//               <BannerFrame banner={banner} />
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Container>
//   );
// };


// export default CampaignPreview;


// claude better 
// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import JSZip from 'jszip';
// import BannerFrame from './BannerFrame'; // <-- Import our new component

// // --- FINAL and MOST ROBUST image processing logic ---
// const processSingleBanner = async (bannerInfo) => {
//   try {
//     const zipResponse = await fetch(bannerInfo.imageUrl);
//     if (!zipResponse.ok) throw new Error(`Failed to download ZIP. Status: ${zipResponse.status}`);

//     const zipBlob = await zipResponse.blob();
//     const zip = await JSZip.loadAsync(zipBlob);

//     // Find HTML file, same as before
//     const htmlFileName = Object.keys(zip.files).find(name => name.endsWith('.html') && !zip.files[name].dir);
//     if (!htmlFileName) throw new Error(`No .html file found in the ZIP.`);

//     const bannerHtml = await zip.file(htmlFileName).async('string');
//     const htmlDir = htmlFileName.includes('/') ? htmlFileName.substring(0, htmlFileName.lastIndexOf('/') + 1) : '';

//     // --- NEW RELIABLE METHOD: Use DOM Parsing, not Regex ---
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = bannerHtml;
    
//     const imageTags = tempDiv.querySelectorAll('img');
//     const filesInZip = zip.files;

//     for (const imgTag of imageTags) {
//       let src = imgTag.getAttribute('src');
//       if (!src) continue;

//       // The 'src' from the HTML, e.g., "images/logo.png" or "./images/logo.png"
//       let decodedSrc = decodeURIComponent(src);
//       if (decodedSrc.startsWith('./')) {
//         decodedSrc = decodedSrc.substring(2);
//       }
//       const fullPathInZip = htmlDir + decodedSrc;

//       // Find the file in the zip, case-insensitively for robustness
//       const zipEntryKey = Object.keys(filesInZip).find(
//         key => key.toLowerCase() === fullPathInZip.toLowerCase()
//       );

//       const imageFile = zipEntryKey ? filesInZip[zipEntryKey] : null;

//       if (imageFile) {
//         const mimeType = `image/${zipEntryKey.split('.').pop().toLowerCase()}`;
//         const base64Data = await imageFile.async('base64');
//         imgTag.src = `data:${mimeType};base64,${base64Data}`;
//       } else {
//         console.warn(`Image not found in ZIP: ${fullPathInZip}`);
//       }
//     }

//     return {
//       bannerId: bannerInfo.bannerId,
//       clickAction: bannerInfo.clickAction,
//       htmlContent: tempDiv.innerHTML, // Return the modified HTML with embedded images
//     };

//   } catch (error) {
//     console.error(`Error processing banner ${bannerInfo.bannerId}:`, error);
//     return { bannerId: bannerInfo.bannerId, error: error.message };
//   }
// };

// const CampaignPreview = () => {
//   const [clientId, setClientId] = useState('6000');
//   const [panId, setPanId] = useState('ABCDE1234F');
//   const [channel, setChannel] = useState('netbanking');
//   const [processedBanners, setProcessedBanners] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setProcessedBanners([]);

//     const API_BASE_URL = 'http://192.168.1.7:8080';
//     const params = new URLSearchParams({ clientId, panId, channel });
//     const fullApiUrl = `${API_BASE_URL}/api/banners?${params}`;

//     try {
//       const response = await fetch(fullApiUrl);
//       if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
//       const bannersFromApi = await response.json();
//       if (!Array.isArray(bannersFromApi) || bannersFromApi.length === 0) {
//         setError("No active banners were found for the provided details.");
//         return;
//       }

//       const allProcessedData = await Promise.all(
//         bannersFromApi.map(bannerInfo => processSingleBanner(bannerInfo))
//       );
      
//       setProcessedBanners(allProcessedData.filter(b => b && !b.error));
//       const failedCount = allProcessedData.filter(b => b && b.error).length;
//       if (failedCount > 0) {
//         setError(`${failedCount} banner(s) failed to process. Check the console for details.`);
//       }

//     } catch (err) {
//       setError(`Failed to fetch data: ${err.message}.`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       <Box textAlign="center" mb={4}>
//         <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//           Campaign Live Preview
//         </Typography>
//         <Typography variant="h6" color="text.secondary">
//           Enter campaign details to fetch and preview live banners in their original size
//         </Typography>
//       </Box>

//       <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3} alignItems="flex-end">
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField 
//                 fullWidth 
//                 label="Client ID" 
//                 variant="outlined" 
//                 value={clientId} 
//                 onChange={e => setClientId(e.target.value)} 
//                 required 
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField 
//                 fullWidth 
//                 label="PAN ID" 
//                 variant="outlined" 
//                 value={panId} 
//                 onChange={e => setPanId(e.target.value)} 
//                 required 
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField 
//                 fullWidth 
//                 label="Channel" 
//                 variant="outlined" 
//                 value={channel} 
//                 onChange={e => setChannel(e.target.value)} 
//                 required 
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Button 
//                 type="submit" 
//                 variant="contained" 
//                 size="large" 
//                 fullWidth 
//                 disabled={isLoading} 
//                 startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
//                 sx={{ py: 1.5 }}
//               >
//                 {isLoading ? 'Fetching...' : 'Fetch Banners'}
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>

//       {error && (
//         <Alert severity="warning" sx={{ mb: 4 }}>
//           {error}
//         </Alert>
//       )}
      
//       {processedBanners.length > 0 && (
//         <Box>
//           <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
//             Found {processedBanners.length} Active Banner{processedBanners.length > 1 ? 's' : ''}
//           </Typography>
          
//           {/* Display banners in a centered, stacked layout */}
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center', 
//             gap: 4,
//             '& > *': {
//               flexShrink: 0 // Prevent banners from shrinking
//             }
//           }}>
//             {processedBanners.map((banner) => (
//               <Box key={banner.bannerId}>
//                 <BannerFrame banner={banner} />
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default CampaignPreview;

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
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import JSZip from 'jszip';
import BannerFrame from './BannerFrame'; // <-- Import our new component

// --- FINAL and MOST ROBUST image processing logic ---
const processSingleBanner = async (bannerInfo) => {
  try {
    const zipResponse = await fetch(bannerInfo.imageUrl);
    if (!zipResponse.ok) throw new Error(`Failed to download ZIP. Status: ${zipResponse.status}`);

    const zipBlob = await zipResponse.blob();
    const zip = await JSZip.loadAsync(zipBlob);

    // Find HTML file, same as before
    const htmlFileName = Object.keys(zip.files).find(name => name.endsWith('.html') && !zip.files[name].dir);
    if (!htmlFileName) throw new Error(`No .html file found in the ZIP.`);

    const bannerHtml = await zip.file(htmlFileName).async('string');
    const htmlDir = htmlFileName.includes('/') ? htmlFileName.substring(0, htmlFileName.lastIndexOf('/') + 1) : '';

    // --- NEW RELIABLE METHOD: Use DOM Parsing, not Regex ---
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bannerHtml;
    
    const imageTags = tempDiv.querySelectorAll('img');
    const filesInZip = zip.files;

    for (const imgTag of imageTags) {
      let src = imgTag.getAttribute('src');
      if (!src) continue;

      // The 'src' from the HTML, e.g., "images/logo.png" or "./images/logo.png"
      let decodedSrc = decodeURIComponent(src);
      if (decodedSrc.startsWith('./')) {
        decodedSrc = decodedSrc.substring(2);
      }
      const fullPathInZip = htmlDir + decodedSrc;

      // Find the file in the zip, case-insensitively for robustness
      const zipEntryKey = Object.keys(filesInZip).find(
        key => key.toLowerCase() === fullPathInZip.toLowerCase()
      );

      const imageFile = zipEntryKey ? filesInZip[zipEntryKey] : null;

      if (imageFile) {
        const mimeType = `image/${zipEntryKey.split('.').pop().toLowerCase()}`;
        const base64Data = await imageFile.async('base64');
        imgTag.src = `data:${mimeType};base64,${base64Data}`;
      } else {
        console.warn(`Image not found in ZIP: ${fullPathInZip}`);
      }
    }

    return {
      bannerId: bannerInfo.bannerId,
      clickAction: bannerInfo.clickAction,
      htmlContent: tempDiv.innerHTML, // Return the modified HTML with embedded images
    };

  } catch (error) {
    console.error(`Error processing banner ${bannerInfo.bannerId}:`, error);
    return { bannerId: bannerInfo.bannerId, error: error.message };
  }
};

const CampaignPreview = () => {
  const [clientId, setClientId] = useState('6000');
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

    const API_BASE_URL = 'http://192.168.1.7:8080';
    const params = new URLSearchParams({ clientId, panId, channel });
    const fullApiUrl = `${API_BASE_URL}/api/banners?${params}`;

    try {
      const response = await fetch(fullApiUrl);
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
      const bannersFromApi = await response.json();
      if (!Array.isArray(bannersFromApi) || bannersFromApi.length === 0) {
        setError("No active banners were found for the provided details.");
        return;
      }

      const allProcessedData = await Promise.all(
        bannersFromApi.map(bannerInfo => processSingleBanner(bannerInfo))
      );
      
      setProcessedBanners(allProcessedData.filter(b => b && !b.error));
      const failedCount = allProcessedData.filter(b => b && b.error).length;
      if (failedCount > 0) {
        setError(`${failedCount} banner(s) failed to process. Check the console for details.`);
      }

    } catch (err) {
      setError(`Failed to fetch data: ${err.message}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Campaign Live Preview
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Enter campaign details to fetch and preview live banners in their original size
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <TextField 
                fullWidth 
                label="Client ID" 
                variant="outlined" 
                value={clientId} 
                onChange={e => setClientId(e.target.value)} 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField 
                fullWidth 
                label="PAN ID" 
                variant="outlined" 
                value={panId} 
                onChange={e => setPanId(e.target.value)} 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField 
                fullWidth 
                label="Channel" 
                variant="outlined" 
                value={channel} 
                onChange={e => setChannel(e.target.value)} 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth 
                disabled={isLoading} 
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                sx={{ py: 1.5 }}
              >
                {isLoading ? 'Fetching...' : 'Fetch Banners'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {processedBanners.length > 0 && (
        <Box>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4, 
            p: 3, 
            borderRadius: 2, 
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            border: '1px solid rgba(25, 118, 210, 0.1)'
          }}>
            <Typography variant="h4" component="h2" sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mb: 1
            }}>
              🎯 Campaign Results
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Found {processedBanners.length} Active Banner{processedBanners.length > 1 ? 's' : ''} Ready for Display
            </Typography>
          </Box>
          
          {/* Display banners in a clean grid layout */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 4,
            justifyItems: 'center',
            alignItems: 'start',
            '& > *': {
              width: '100%',
              maxWidth: '800px'
            }
          }}>
            {processedBanners.map((banner, index) => (
              <Box 
                key={banner.bannerId}
                sx={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  '@keyframes fadeInUp': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(30px)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                <BannerFrame banner={banner} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CampaignPreview;