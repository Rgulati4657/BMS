// // src/components/BannerFrame.jsx

// import React, { useRef } from 'react';
// import { Card, Link as MuiLink, Typography, Box } from '@mui/material';

// const BannerFrame = ({ banner }) => {
//   const iframeRef = useRef(null);

//   const handleLoad = () => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     try {
//       const contentDoc = iframe.contentDocument || iframe.contentWindow.document;
//       const contentBody = contentDoc.body;
      
//       if (contentBody) {
//         const width = contentBody.scrollWidth;
//         const height = contentBody.scrollHeight;
        
//         if (width > 0 && height > 0) {
//           iframe.style.width = `${width}px`;
//           iframe.style.height = `${height}px`;
          
//           const card = iframe.closest('.MuiCard-root');
//           if (card) {
//             card.style.width = `${width}px`;
//             card.style.height = `${height}px`;
//           }
//         }
//       }
//     } catch (e) {
//       console.error("Could not access iframe content for resizing:", e);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <Card sx={{ 
//         width: '300px', 
//         height: '250px',
//         maxWidth: '100%',
//         overflow: 'hidden',
//         transition: 'width 0.3s, height 0.3s',
//       }}>
//         <MuiLink href={banner.clickAction} target="_blank" rel="noopener noreferrer" underline="none">
//           <iframe
//             ref={iframeRef}
//             title={`Banner ${banner.bannerId}`}
//             srcDoc={banner.htmlContent}
//             onLoad={handleLoad}
//             scrolling="no"
//             sandbox="allow-scripts"
//             style={{
//               width: '100%',
//               height: '100%',
//               border: 0,
//               display: 'block',
//               pointerEvents: 'none',
//             }}
//           />
//         </MuiLink>
//       </Card>
//       <Typography variant="caption" color="text.secondary" align="center" component="div" sx={{ mt: 1 }}>
//         Banner ID: {banner.bannerId}
//       </Typography>
//     </Box>
//   );
// };

// export default BannerFrame;

// src/components/BannerFrame.jsx





// src/components/BannerFrame.jsx

// better but still squeezed 
// import React, { useRef, useState, useLayoutEffect } from 'react';
// import { Card, Link as MuiLink, Typography, Box, CardContent } from '@mui/material';

// const BannerFrame = ({ banner }) => {
//   const iframeRef = useRef(null);
//   const cardContentRef = useRef(null); // Ref for the container area

//   const [style, setStyle] = useState({
//     transform: 'scale(1)',
//     width: '100%',
//     height: '100%',
//     opacity: 0,
//   });

//   // useLayoutEffect is better for DOM measurements to prevent flicker
//   useLayoutEffect(() => {
//     const iframe = iframeRef.current;
//     const container = cardContentRef.current;
//     if (!iframe || !container) return;

//     const handleLoad = () => {
//       try {
//         const contentDoc = iframe.contentDocument || iframe.contentWindow.document;
//         const contentBody = contentDoc.body;
        
//         contentBody.style.margin = '0'; // Crucial for accurate measurement

//         const bannerWidth = contentBody.scrollWidth;
//         const bannerHeight = contentBody.scrollHeight;

//         const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

//         if (bannerWidth > 0 && bannerHeight > 0) {
//           // Calculate the correct scale factor to fit the banner inside the container
//           const scale = Math.min(
//             containerWidth / bannerWidth,
//             containerHeight / bannerHeight
//           );
          
//           setStyle({
//             // Set the iframe to the banner's true size
//             width: `${bannerWidth}px`,
//             height: `${height}bannerHeight}px`,
//             // Scale it down to fit, transforming from the top-left corner
//             transform: `scale(${scale})`,
//             transformOrigin: 'top left',
//             opacity: 1, // Fade it in
//           });
//         }
//       } catch (e) {
//         console.error("Banner processing error:", e);
//         setStyle(s => ({...s, opacity: 1})); // At least show something if it errors
//       }
//     };

//     // The iframe might already be loaded by the time this effect runs
//     if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
//       handleLoad();
//     } else {
//       iframe.addEventListener('load', handleLoad);
//     }
    
//     return () => iframe.removeEventListener('load', handleLoad);
//   }, [banner.htmlContent]); // Re-run if the banner content changes

//   return (
//     <>
//       <Card sx={{ 
//         width: '100%', 
//         aspectRatio: '16 / 9', // Enforces a uniform, rectangular shape for all cards
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         overflow: 'hidden', // Hides any part of the scaled iframe that's outside the box
//         backgroundColor: '#f5f5f5' // A neutral background for the empty space
//       }}>
//         <CardContent ref={cardContentRef} sx={{ p: 1, width: '100%', height: '100%' }}>
//             {/* This Box is the one that gets scaled */}
//             <Box style={style} sx={{ transition: 'opacity 0.4s ease-in-out' }}>
//               {/* --- THIS IS THE FIXED LINE --- */}
//               <MuiLink href={banner.clickAction} target="_blank" rel="noopener noreferrer" underline="none">
//                 <iframe
//                   ref={iframeRef}
//                   title={`Banner ${banner.bannerId}`}
//                   srcDoc={banner.htmlContent}
//                   scrolling="no"
//                   sandbox="allow-scripts"
//                   style={{
//                     width: '100%', // Fills the scaled Box
//                     height: '100%',
//                     border: 0,
//                     display: 'block',
//                     pointerEvents: 'none',
//                   }}
//                 />
//               </MuiLink>
//             </Box>
//         </CardContent>
//       </Card>
//       <Typography variant="caption" color="text.secondary" align="center" component="div" sx={{ mt: 0.5 }}>
//         Banner ID: {banner.bannerId}
//       </Typography>
//     </>
//   );
// };

// export default BannerFrame;



// src/components/BannerFrame.jsx
// // src/components/BannerFrame.jsx
// import React, { useRef, useState, useLayoutEffect } from 'react';
// import { Card, Link as MuiLink, Typography, Box, CircularProgress } from '@mui/material';

// const BannerFrame = ({ banner }) => {
//   const iframeRef = useRef(null);
//   const [dimensions, setDimensions] = useState({
//     width: 'auto',
//     height: '250px',
//     isLoaded: false
//   });
//   const [isHovered, setIsHovered] = useState(false);

//   useLayoutEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     const handleLoad = () => {
//       try {
//         const contentDoc = iframe.contentDocument || iframe.contentWindow.document;
//         const contentBody = contentDoc.body;
//         const contentHtml = contentDoc.documentElement;
        
//         // Reset styles to get accurate measurements
//         contentBody.style.margin = '0';
//         contentBody.style.padding = '0';
//         contentBody.style.overflow = 'visible';
//         contentHtml.style.overflow = 'visible';
        
//         // Force the iframe to show all content
//         contentBody.style.height = 'auto';
//         contentBody.style.minHeight = 'auto';
        
//         // Wait a bit for content to render, then measure
//         setTimeout(() => {
//           // Try multiple methods to get accurate dimensions
//           const methods = [
//             () => ({ w: contentBody.scrollWidth, h: contentBody.scrollHeight }),
//             () => ({ w: contentBody.offsetWidth, h: contentBody.offsetHeight }),
//             () => ({ w: contentHtml.scrollWidth, h: contentHtml.scrollHeight }),
//             () => ({ w: contentHtml.offsetWidth, h: contentHtml.offsetHeight }),
//           ];
          
//           let bannerWidth = 0;
//           let bannerHeight = 0;
          
//           // Try each method and use the largest dimensions found
//           for (const method of methods) {
//             try {
//               const { w, h } = method();
//               if (w > bannerWidth) bannerWidth = w;
//               if (h > bannerHeight) bannerHeight = h;
//             } catch (e) {
//               console.warn('Dimension measurement method failed:', e);
//             }
//           }
          
//           // Additional check for elements that might define the banner size
//           const allElements = contentDoc.querySelectorAll('*');
//           for (const element of allElements) {
//             try {
//               const rect = element.getBoundingClientRect();
//               const rightEdge = rect.left + rect.width;
//               const bottomEdge = rect.top + rect.height;
//               if (rightEdge > bannerWidth) bannerWidth = rightEdge;
//               if (bottomEdge > bannerHeight) bannerHeight = bottomEdge;
//             } catch (e) {
//               // Skip elements that can't be measured
//             }
//           }
          
//           console.log('Measured banner dimensions:', { bannerWidth, bannerHeight });
          
//           if (bannerWidth > 0 && bannerHeight > 0) {
//             setDimensions({
//               width: `${Math.ceil(bannerWidth)}px`,
//               height: `${Math.ceil(bannerHeight)}px`,
//               isLoaded: true
//             });
//           } else {
//             // Fallback dimensions based on common banner sizes
//             setDimensions({
//               width: '728px', // Standard leaderboard width
//               height: '90px',  // Standard leaderboard height
//               isLoaded: true
//             });
//           }
//         }, 100); // Small delay to ensure content is fully rendered
        
//       } catch (e) {
//         console.error("Banner processing error:", e);
//         // Fallback dimensions on error
//         setDimensions({
//           width: '728px',
//           height: '90px',
//           isLoaded: true
//         });
//       }
//     };

//     // Check if already loaded
//     if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
//       handleLoad();
//     } else {
//       iframe.addEventListener('load', handleLoad);
//     }
    
//     return () => iframe.removeEventListener('load', handleLoad);
//   }, [banner.htmlContent]);

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column', 
//         alignItems: 'center',
//         p: 3,
//         borderRadius: 3,
//         backgroundColor: 'rgba(255, 255, 255, 0.8)',
//         backdropFilter: 'blur(10px)',
//         border: '1px solid rgba(255, 255, 255, 0.2)',
//         boxShadow: isHovered 
//           ? '0 20px 40px rgba(0,0,0,0.15)' 
//           : '0 8px 25px rgba(0,0,0,0.08)',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
//         '&:hover': {
//           boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
//         }
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Banner Header */}
//       <Box sx={{ 
//         width: '100%', 
//         textAlign: 'center', 
//         mb: 2,
//         pb: 1,
//         borderBottom: '2px solid rgba(25, 118, 210, 0.1)'
//       }}>
//         <Typography 
//           variant="overline" 
//           sx={{ 
//             color: 'primary.main',
//             fontWeight: 700,
//             letterSpacing: 1.2,
//             fontSize: '0.75rem'
//           }}
//         >
//           Active Campaign Banner
//         </Typography>
//       </Box>

//       {/* Banner Container */}
//       <Box sx={{
//         position: 'relative',
//         borderRadius: 2,
//         overflow: 'hidden',
//         backgroundColor: '#ffffff',
//         border: '2px solid rgba(0,0,0,0.06)',
//         boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
//       }}>
//         <Card sx={{
//           width: dimensions.width,
//           height: dimensions.height,
//           minHeight: dimensions.height,
//           display: 'flex',
//           alignItems: 'stretch',
//           justifyContent: 'stretch',
//           overflow: 'hidden',
//           backgroundColor: 'transparent',
//           boxShadow: 'none',
//           border: 'none',
//           borderRadius: 0,
//           opacity: dimensions.isLoaded ? 1 : 0,
//           transition: 'opacity 0.4s ease-in-out',
//           '& iframe': {
//             minHeight: '100% !important',
//           }
//         }}>
//           <MuiLink 
//             href={banner.clickAction} 
//             target="_blank" 
//             rel="noopener noreferrer" 
//             underline="none"
//             sx={{ 
//               width: '100%', 
//               height: '100%',
//               display: 'block',
//               '&:hover': {
//                 opacity: 0.95
//               }
//             }}
//           >
//             <iframe
//               ref={iframeRef}
//               title={`Banner ${banner.bannerId}`}
//               srcDoc={banner.htmlContent}
//               scrolling="no"
//               sandbox="allow-scripts"
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 minHeight: '100%',
//                 border: 0,
//                 display: 'block',
//                 pointerEvents: 'auto',
//               }}
//             />
//           </MuiLink>
//         </Card>

//         {/* Loading Overlay */}
//         {!dimensions.isLoaded && (
//           <Box sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//             zIndex: 10
//           }}>
//             <CircularProgress size={24} />
//           </Box>
//         )}
//       </Box>
      
//       {/* Banner Info Footer */}
//       <Box sx={{ 
//         width: '100%', 
//         mt: 2,
//         pt: 1,
//         borderTop: '1px solid rgba(0,0,0,0.06)'
//       }}>
//         <Typography 
//           variant="caption" 
//           color="text.secondary" 
//           align="center" 
//           component="div" 
//           sx={{ 
//             fontWeight: 500,
//             fontSize: '0.7rem',
//             opacity: 0.8
//           }}
//         >
//           ID: {banner.bannerId}
//         </Typography>
//         {dimensions.isLoaded && (
//           <Typography 
//             variant="caption" 
//             color="primary.main" 
//             align="center" 
//             component="div" 
//             sx={{ 
//               fontWeight: 600,
//               fontSize: '0.65rem',
//               mt: 0.5
//             }}
//           >
//             {dimensions.width} × {dimensions.height}
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default BannerFrame;





// src/components/BannerFrame.jsx

import React, { useRef, useState, useLayoutEffect } from 'react';
import { Card, Link as MuiLink, Typography, Box, CircularProgress } from '@mui/material';

const BannerFrame = ({ banner }) => {
  const iframeRef = useRef(null);
  
  // This state now only stores the banner's natural dimensions and a loading flag.
  const [bannerSize, setBannerSize] = useState({
    width: 728,    // A sensible default width for aspect ratio fallback
    height: 90,     // A sensible default height
    isLoaded: false
  });
  const [isHovered, setIsHovered] = useState(false);

  useLayoutEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const contentDoc = iframe.contentDocument || iframe.contentWindow.document;
        const contentBody = contentDoc.body;
        
        // Simple, robust measurement
        contentBody.style.margin = '0';
        const bannerWidth = contentBody.scrollWidth;
        const bannerHeight = contentBody.scrollHeight;
        
        if (bannerWidth > 0 && bannerHeight > 0) {
          setBannerSize({
            width: bannerWidth,
            height: bannerHeight,
            isLoaded: true
          });
        } else {
          // If measurement fails, just mark as loaded with defaults
          setBannerSize(prev => ({ ...prev, isLoaded: true }));
        }
      } catch (e) {
        console.error("Banner processing error:", e);
        setBannerSize(prev => ({ ...prev, isLoaded: true }));
      }
    };

    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      handleLoad();
    } else {
      iframe.addEventListener('load', handleLoad);
    }
    
    return () => iframe.removeEventListener('load', handleLoad);
  }, [banner.htmlContent]);

  return (
    // We keep your excellent outer card design with the hover effects
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        p: 3,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.15)' : '0 8px 25px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Your Banner Header */}
      <Box sx={{ width: '100%', textAlign: 'center', mb: 2, pb: 1, borderBottom: '2px solid rgba(25, 118, 210, 0.1)' }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2, fontSize: '0.75rem' }}>
          Active Campaign Banner
        </Typography>
      </Box>

      {/* Banner Container - This is where the fix is applied */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Card sx={{
          // --- THIS IS THE KEY FIX FOR RESPONSIVE SIZING ---
          width: '100%', // Always take the full width of the container
          maxWidth: `${bannerSize.width}px`, // But don't grow larger than the banner's natural width
          height: 'auto', // Let aspect ratio control the height
          aspectRatio: `${bannerSize.width} / ${bannerSize.height}`, // Enforce the correct shape
          mx: 'auto', // Center the card if it's not full-width
          // ---------------------------------------------------
          
          display: 'flex',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: 2,
          opacity: bannerSize.isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
        }}>
          <MuiLink 
            href={banner.clickAction} 
            target="_blank" 
            rel="noopener noreferrer" 
            underline="none"
            sx={{ width: '100%', height: '100%', display: 'block' }}
          >
            <iframe
              ref={iframeRef}
              title={`Banner ${banner.bannerId}`}
              srcDoc={banner.htmlContent}
              scrolling="no"
              sandbox="allow-scripts"
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                display: 'block',
                pointerEvents: 'none', // Let parent Link handle clicks
              }}
            />
          </MuiLink>
        </Card>

        {/* Your Loading Overlay */}
        {!bannerSize.isLoaded && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
      
      {/* Your Banner Info Footer */}
      <Box sx={{ width: '100%', mt: 2, pt: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="caption" color="text.secondary" align="center" component="div" sx={{ fontWeight: 500, fontSize: '0.7rem', opacity: 0.8 }}>
          ID: {banner.bannerId}
        </Typography>
        {bannerSize.isLoaded && (
          <Typography variant="caption" color="primary.main" align="center" component="div" sx={{ fontWeight: 600, fontSize: '0.65rem', mt: 0.5 }}>
            {bannerSize.width}px × {bannerSize.height}px
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BannerFrame;
// src/components/BannerFrame.jsx

// claude  better
// import React, { useRef, useState, useLayoutEffect } from 'react';
// import { Card, Link as MuiLink, Typography, Box } from '@mui/material';

// const BannerFrame = ({ banner }) => {
//   const iframeRef = useRef(null);
//   const [dimensions, setDimensions] = useState({
//     width: 'auto',
//     height: '250px',
//     isLoaded: false
//   });

//   useLayoutEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     const handleLoad = () => {
//       try {
//         const contentDoc = iframe.contentDocument || iframe.contentWindow.document;
//         const contentBody = contentDoc.body;
        
//         // Reset styles to get accurate measurements
//         contentBody.style.margin = '0';
//         contentBody.style.padding = '0';
//         contentBody.style.overflow = 'hidden';
        
//         // Get the actual banner dimensions
//         const bannerWidth = contentBody.scrollWidth;
//         const bannerHeight = contentBody.scrollHeight;
        
//         if (bannerWidth > 0 && bannerHeight > 0) {
//           setDimensions({
//             width: `${bannerWidth}px`,
//             height: `${bannerHeight}px`,
//             isLoaded: true
//           });
//         } else {
//           // Fallback dimensions
//           setDimensions({
//             width: '728px', // Standard leaderboard width
//             height: '90px',  // Standard leaderboard height
//             isLoaded: true
//           });
//         }
//       } catch (e) {
//         console.error("Banner processing error:", e);
//         // Fallback dimensions on error
//         setDimensions({
//           width: '728px',
//           height: '90px',
//           isLoaded: true
//         });
//       }
//     };

//     // Check if already loaded
//     if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
//       handleLoad();
//     } else {
//       iframe.addEventListener('load', handleLoad);
//     }
    
//     return () => iframe.removeEventListener('load', handleLoad);
//   }, [banner.htmlContent]);

//   return (
//     <>
//       <Card sx={{
//         width: dimensions.width,
//         height: dimensions.height,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         overflow: 'hidden',
//         backgroundColor: '#ffffff',
//         boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//         borderRadius: '8px',
//         border: '1px solid #e0e0e0',
//         opacity: dimensions.isLoaded ? 1 : 0,
//         transition: 'opacity 0.3s ease-in-out',
//         mx: 'auto', // Center the card horizontally
//       }}>
//         <MuiLink 
//           href={banner.clickAction} 
//           target="_blank" 
//           rel="noopener noreferrer" 
//           underline="none"
//           sx={{ 
//             width: '100%', 
//             height: '100%',
//             display: 'block'
//           }}
//         >
//           <iframe
//             ref={iframeRef}
//             title={`Banner ${banner.bannerId}`}
//             srcDoc={banner.htmlContent}
//             scrolling="no"
//             sandbox="allow-scripts"
//             style={{
//               width: '100%',
//               height: '100%',
//               border: 0,
//               display: 'block',
//               pointerEvents: 'auto', // Enable clicks
//             }}
//           />
//         </MuiLink>
//       </Card>
      
//       <Typography 
//         variant="caption" 
//         color="text.secondary" 
//         align="center" 
//         component="div" 
//         sx={{ 
//           mt: 1, 
//           fontWeight: 500,
//           fontSize: '0.75rem'
//         }}
//       >
//         Banner ID: {banner.bannerId} | Size: {dimensions.width} × {dimensions.height}
//       </Typography>
//     </>
//   );
// };

// export default BannerFrame;










// src/components/BannerFrame.jsx




// can reffer 
// import React, { useRef, useState } from 'react';
// import { Card, Link as MuiLink, Typography, Box } from '@mui/material';

// const BannerFrame = ({ banner }) => {
//   const iframeRef = useRef(null);

//   // This state will hold the final, correct dimensions.
//   const [dimensions, setDimensions] = useState({
//     width: 'auto', // Start with auto to let the content define its size
//     height: 'auto',
//     opacity: 0, // Start invisible to prevent any flicker
//   });

//   const handleLoad = () => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     try {
//       const contentDoc = iframe.contentDocument || iframe.contentWindow.document;
//       const contentBody = contentDoc.body;
      
//       // Crucial: Remove any default margin/padding from the iframe's content
//       // This ensures the measurement is of the creative itself.
//       contentDoc.documentElement.style.margin = '0';
//       contentDoc.documentElement.style.padding = '0';
//       contentBody.style.margin = '0';
//       contentBody.style.padding = '0';

//       if (contentBody) {
//         // This now measures the TRUE, UNCONSTRAINED size of the banner content.
//         const width = contentBody.scrollWidth;
//         const height = contentBody.scrollHeight;
        
//         // Update the state with the real dimensions, which triggers a re-render
//         if (width > 0 && height > 0) {
//           setDimensions({
//             width: `${width}px`,
//             height: `${height}px`,
//             opacity: 1, // Fade the correctly sized banner in
//           });
//         } else {
//           // If measurement fails, fall back to a default and make it visible
//            setDimensions({ width: '300px', height: '250px', opacity: 1 });
//         }
//       }
//     } catch (e) {
//       console.error("Could not access iframe content for resizing:", e);
//       setDimensions({ width: '300px', height: '250px', opacity: 1 });
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       {/* 
//         The Card now gets its dimensions from our state. 
//         It will be perfectly sized to the banner's true rectangular shape.
//       */}
//       <Card sx={{
//         width: dimensions.width,
//         height: dimensions.height,
//         opacity: dimensions.opacity,
//         maxWidth: '100%',
//         overflow: 'hidden',
//         transition: 'opacity 0.4s ease-in, width 0s, height 0s', // Only transition opacity
//         lineHeight: 0, // Prevents extra space in the card
//       }}>
//         <MuiLink href={banner.clickAction} target="_blank" rel="noopener noreferrer" underline="none" sx={{ display: 'block' }}>
//           <iframe
//             ref={iframeRef}
//             title={`Banner ${banner.bannerId}`}
//             srcDoc={banner.htmlContent}
//             onLoad={handleLoad}
//             scrolling="no"
//             sandbox="allow-scripts"
//             style={{
//               width: '100%',
//               height: '100%',
//               border: 0,
//               display: 'block',
//             }}
//           />
//         </MuiLink>
//       </Card>
//       <Typography variant="caption" color="text.secondary" align="center" component="div" sx={{ mt: 1, width: dimensions.width }}>
//         Banner ID: {banner.bannerId}
//       </Typography>
//     </Box>
//   );
// };

// export default BannerFrame;














// import React, { useRef, useState } from 'react';
// import { Card, Link as MuiLink, Typography, Box } from '@mui/material';

// const BannerFrame = ({ banner }) => {
//   const iframeRef = useRef(null);
  
//   // Use React state to manage dimensions and visibility. This is the key fix.
//   const [dimensions, setDimensions] = useState({
//     width: '300px', // A default starting width
//     height: '250px', // A default starting height
//     opacity: 0, // Start invisible to prevent flicker
//   });

//   const handleLoad = () => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     try {
//       const contentDoc = iframe.contentDocument || iframe.contentWindow.document;
//       const contentBody = contentDoc.body;
      
//       // Resetting body/html margin is crucial for accurate measurement
//       contentDoc.documentElement.style.margin = '0';
//       contentDoc.documentElement.style.padding = '0';
//       contentBody.style.margin = '0';
//       contentBody.style.padding = '0';
      
//       if (contentBody) {
//         // Measure the true, unconstrained size of the content
//         const width = contentBody.scrollWidth;
//         const height = contentBody.scrollHeight;
        
//         if (width > 0 && height > 0) {
//           // Update the state. React will re-render the component at the correct size.
//           setDimensions({
//             width: `${width}px`,
//             height: `${height}px`,
//             opacity: 1, // Make it visible now that it's correctly sized
//           });
//         }
//       }
//     } catch (e) {
//       console.error("Could not access iframe content for resizing:", e);
//       // If we fail, at least show the banner at the default size
//       setDimensions(prev => ({ ...prev, opacity: 1 }));
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <Card sx={{
//         // The card's size is now controlled by our state
//         width: dimensions.width,
//         height: dimensions.height,
//         opacity: dimensions.opacity, // Controlled by state
//         overflow: 'hidden',
//         maxWidth: '100%',
//         transition: 'opacity 0.4s ease-in-out, width 0.3s, height 0.3s', // Smooth fade-in
//       }}>
//         <MuiLink href={banner.clickAction} target="_blank" rel="noopener noreferrer" underline="none">
//           <iframe
//             ref={iframeRef}
//             title={`Banner ${banner.bannerId}`}
//             srcDoc={banner.htmlContent}
//             onLoad={handleLoad}
//             scrolling="no"
//             sandbox="allow-scripts"
//             style={{
//               width: '100%',
//               height: '100%',
//               border: 0,
//               display: 'block',
//               pointerEvents: 'none',
//             }}
//           />
//         </MuiLink>
//       </Card>
//       <Typography variant="caption" color="text.secondary" align="center" component="div" sx={{ mt: 1 }}>
//         Banner ID: {banner.bannerId}
//       </Typography>
//     </Box>
//   );
// };

// export default BannerFrame;