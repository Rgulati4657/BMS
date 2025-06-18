// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import Papa from 'papaparse';
// import {
//   Box, Paper, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip,
//   IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Alert,
//   styled
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
// import ClearAllIcon from '@mui/icons-material/ClearAll';

// // Styled component for alternating row colors
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// // Helper function to format dates
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     return new Date(dateString).toLocaleString();
//   } catch (error) {
//     return 'Invalid Date';
//   }
// };

// const BannerList = () => {
//   const [banners, setBanners] = useState([]);
//   const [isSearchMode, setIsSearchMode] = useState(false);
//   const [filters, setFilters] = useState({ clientId: '', panId: '', channel: '', segmentTag: '' });
  
//   const [page, setPage] = useState(0); // For MUI TablePagination (zero-based)
//   const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const [editingBanner, setEditingBanner] = useState(null);
//   const [deleteCandidate, setDeleteCandidate] = useState(null); // For delete confirmation

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const CSV_EXPORT_URL = import.meta.env.VITE_CSV_EXPORT_URL;

//   // --- DATA FETCHING LOGIC ---

//   // Fetches data for browsing (paginated from CSV)
//   const fetchBannersByChunk = useCallback(async () => {
//     if (isSearchMode) return;
//     setLoading(true);
//     setError(null);
//     try {
//       // Note: CSV fetching doesn't align well with MUI's page/rowsPerPage.
//       // We'll fetch a larger "chunk" and let the user paginate through that on the client.
//       // A more advanced solution would use a paginated JSON API.
//       const res = await fetch(`${CSV_EXPORT_URL}?chunk=1`); // Fetching a single large chunk for this example
//       if (!res.ok) throw new Error("Could not fetch banner data.");
//       const text = await res.text();
//       const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
//       setBanners(parsed.data.filter(row => row.banner_id?.trim()));
//     } catch (err) {
//       setError(err.message);
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [isSearchMode, CSV_EXPORT_URL]);

//   // Fetches data by searching the database
//   const handleApplyFilters = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setIsSearchMode(true);
//     try {
//       const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
//         if (value) acc[key] = value;
//         return acc;
//       }, {});
      
//       const query = new URLSearchParams(activeFilters).toString();
//       const token = localStorage.getItem("authToken");
//       const { data } = await axios.get(`${API_BASE_URL}/api/banners?${query}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(data);
//     } catch (err) {
//       setError("Failed to load filtered banners. Please try again.");
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters, API_BASE_URL]);

//   useEffect(() => {
//     if (!isSearchMode) {
//       fetchBannersByChunk();
//     }
//   }, [isSearchMode, fetchBannersByChunk]);

//   // --- HANDLER FUNCTIONS ---

//   const handleFilterChange = (event) => {
//     const { name, value } = event.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleClearFilters = () => {
//     setFilters({ clientId: '', panId: '', channel: '', segmentTag: '' });
//     if (isSearchMode) {
//       setIsSearchMode(false); // This will trigger the useEffect to re-fetch CSV data
//     }
//   };

//   const handleEditClick = (banner) => setEditingBanner({ ...banner });
//   const handleEditClose = () => setEditingBanner(null);
  
//   const handleEditSave = async () => {
//     if (!editingBanner) return;
//     const token = localStorage.getItem("authToken");
//     const { banner_id, ...payload } = editingBanner;
    
//     try {
//       const { data: updatedBanner } = await axios.put(`${API_BASE_URL}/api/banners/${banner_id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Optimistically update the UI
//       setBanners(prev => prev.map(b => b.banner_id === banner_id ? updatedBanner : b));
//       handleEditClose();
//     } catch (err) {
//       console.error("Error updating banner:", err);
//       alert("Failed to update banner.");
//     }
//   };

//   const handleDeleteClick = (banner) => setDeleteCandidate(banner);
//   const handleDeleteClose = () => setDeleteCandidate(null);

//   const handleDeleteConfirm = async () => {
//     if (!deleteCandidate) return;
//     const token = localStorage.getItem("authToken");
//     try {
//       await axios.delete(`${API_BASE_URL}/api/banners/${deleteCandidate.banner_id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(prev => prev.filter(b => b.banner_id !== deleteCandidate.banner_id));
//       handleDeleteClose();
//     } catch (err) {
//       console.error("Error deleting banner:", err);
//       alert("Failed to delete banner.");
//     }
//   };

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
  
//   // Slice banners for client-side pagination
//   const paginatedBanners = banners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
//       <Typography variant="h4" gutterBottom>Banner Management</Typography>
      
//       {/* --- Filter Section --- */}
//       <Paper variant="outlined" sx={{ p: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Client ID" name="clientId" value={filters.clientId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="PAN ID" name="panId" value={filters.panId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <FormControl fullWidth size="small">
//               <InputLabel>Channel</InputLabel>
//               <Select name="channel" value={filters.channel} label="Channel" onChange={handleFilterChange}>
//                 <MenuItem value=""><em>Any</em></MenuItem>
//                 <MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="Segment Tag" name="segmentTag" value={filters.segmentTag} onChange={handleFilterChange} size="small"/></Grid>
//           <Grid item xs={12} md={2} display="flex" gap={1}>
//             <Button fullWidth variant="contained" onClick={handleApplyFilters} startIcon={<SearchIcon />} disabled={loading}>Apply</Button>
//             <Button fullWidth variant="outlined" onClick={handleClearFilters} startIcon={<ClearAllIcon />} disabled={loading}>Clear</Button>
//           </Grid>
//         </Grid>
//       </Paper>
      
//       {error && <Alert severity="error">{error}</Alert>}
      
//       {/* --- Table Section --- */}
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="banner list table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Client ID</TableCell>
//               <TableCell>Channel</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Valid From</TableCell>
//               <TableCell>Valid To</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
//             ) : paginatedBanners.length === 0 ? (
//               <TableRow><TableCell colSpan={6} align="center">No Banners Found</TableCell></TableRow>
//             ) : (
//               paginatedBanners.map((banner) => (
//                 <StyledTableRow key={banner.banner_id}>
//                   <TableCell>{banner.client_id}</TableCell>
//                   <TableCell>{banner.channel}</TableCell>
//                   <TableCell>
//                     <Chip label={banner.status} color={banner.status === 'active' ? 'success' : 'default'} size="small" />
//                   </TableCell>
//                   <TableCell>{formatDate(banner.valid_from)}</TableCell>
//                   <TableCell>{formatDate(banner.valid_to)}</TableCell>
//                   <TableCell align="right">
//                     <IconButton onClick={() => handleEditClick(banner)} color="primary"><EditIcon /></IconButton>
//                     <IconButton onClick={() => handleDeleteClick(banner)} color="error"><DeleteIcon /></IconButton>
//                   </TableCell>
//                 </StyledTableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       {!isSearchMode && (
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={banners.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       )}

//       {/* --- Edit Dialog --- */}
//       <Dialog open={!!editingBanner} onClose={handleEditClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Banner</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ pt: 1 }}>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="Banner ID" value={editingBanner?.banner_id || ''} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="Client ID" value={editingBanner?.client_id || ''} size="small"/></Grid>
//             <Grid item xs={12}><FormControl fullWidth><InputLabel>Status</InputLabel><Select label="Status" value={editingBanner?.status || 'inactive'} onChange={(e) => setEditingBanner(p => ({...p, status: e.target.value}))}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select></FormControl></Grid>
//             {/* Add more editable fields here as needed */}
//           </Grid>
//         </DialogContent>
//         <DialogActions><Button onClick={handleEditClose}>Cancel</Button><Button onClick={handleEditSave} variant="contained">Save</Button></DialogActions>
//       </Dialog>
      
//       {/* --- Delete Confirmation Dialog --- */}
//       <Dialog open={!!deleteCandidate} onClose={handleDeleteClose}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent><DialogContentText>Are you sure you want to delete banner for client "{deleteCandidate?.client_id}"?</DialogContentText></DialogContent>
//         <DialogActions><Button onClick={handleDeleteClose}>Cancel</Button><Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button></DialogActions>
//       </Dialog>
//     </Paper>
//   );
// };

// export default BannerList;




// // works well 
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import Papa from 'papaparse';
// import {
//   Box, Paper, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip,
//   IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Alert,
//   Link, Tooltip, styled
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
// import ClearAllIcon from '@mui/icons-material/ClearAll';
// import LinkIcon from '@mui/icons-material/Link';
// import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// // Styled component for alternating row colors
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// // Helper function to format dates
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     return new Date(dateString).toLocaleString();
//   } catch (error) {
//     return 'Invalid Date';
//   }
// };

// const BannerList = () => {
//   const [banners, setBanners] = useState([]);
//   const [isSearchMode, setIsSearchMode] = useState(false);
//   const [filters, setFilters] = useState({ clientId: '', panId: '', channel: '', segmentTag: '' });
  
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const [editingBanner, setEditingBanner] = useState(null);
//   const [deleteCandidate, setDeleteCandidate] = useState(null);

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const CSV_EXPORT_URL = import.meta.env.VITE_CSV_EXPORT_URL;

//   // --- DATA FETCHING LOGIC ---
  
//   const fetchBannersByChunk = useCallback(async () => {
//     if (isSearchMode) return;
//     setLoading(true);
//     setError(null);
//     try {
//       // For this example, we fetch a large "master" list from the CSV endpoint.
//       // A more robust solution for very large datasets would use a paginated JSON API.
//       const res = await fetch(`${CSV_EXPORT_URL}?chunk=1`);
//       if (!res.ok) throw new Error("Could not fetch initial banner data.");
//       const text = await res.text();
//       const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
//       const cleanedData = parsed.data.filter(row => row.banner_id?.trim());
//       setBanners(cleanedData);
//     } catch (err) {
//       setError(err.message || "An error occurred while fetching data.");
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [isSearchMode, CSV_EXPORT_URL]);

//   const handleApplyFilters = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setIsSearchMode(true);
//     setPage(0); // Reset to first page on new search
//     try {
//       const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value));
//       const query = new URLSearchParams(activeFilters).toString();
//       const token = localStorage.getItem("authToken");
//       const { data } = await axios.get(`${API_BASE_URL}/api/banners?${query}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(data);
//     } catch (err) {
//       setError("Failed to load filtered banners. Please try again.");
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters, API_BASE_URL]);

//   useEffect(() => {
//     if (!isSearchMode) {
//       fetchBannersByChunk();
//     }
//   }, [isSearchMode, fetchBannersByChunk]);

//   // --- HANDLER FUNCTIONS ---

//   const handleFilterChange = (event) => {
//     const { name, value } = event.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleClearFilters = () => {
//     setFilters({ clientId: '', panId: '', channel: '', segmentTag: '' });
//     if (isSearchMode) {
//       setIsSearchMode(false);
//     }
//   };

//   const handleEditClick = (banner) => setEditingBanner({ ...banner });
//   const handleEditClose = () => setEditingBanner(null);
  
//   const handleEditSave = async () => {
//     if (!editingBanner) return;
//     const token = localStorage.getItem("authToken");
//     const { banner_id, ...payload } = editingBanner;
    
//     try {
//       const { data: updatedBanner } = await axios.put(`${API_BASE_URL}/api/banners/${banner_id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(prev => prev.map(b => b.banner_id === banner_id ? updatedBanner : b));
//       handleEditClose();
//     } catch (err) {
//       console.error("Error updating banner:", err);
//       alert("Failed to update banner.");
//     }
//   };

//   const handleDeleteClick = (banner) => setDeleteCandidate(banner);
//   const handleDeleteClose = () => setDeleteCandidate(null);

//   const handleDeleteConfirm = async () => {
//     if (!deleteCandidate) return;
//     const token = localStorage.getItem("authToken");
//     try {
//       await axios.delete(`${API_BASE_URL}/api/banners/${deleteCandidate.banner_id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(prev => prev.filter(b => b.banner_id !== deleteCandidate.banner_id));
//       handleDeleteClose();
//     } catch (err) {
//       console.error("Error deleting banner:", err);
//       alert("Failed to delete banner.");
//     }
//   };

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
  
//   const paginatedBanners = banners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
//       <Typography variant="h4" gutterBottom>Banner Management</Typography>
      
//       {/* Filter Section (Unchanged) */}
//       <Paper variant="outlined" sx={{ p: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Client ID" name="clientId" value={filters.clientId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="PAN ID" name="panId" value={filters.panId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select name="channel" value={filters.channel} label="Channel" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="Segment Tag" name="segmentTag" value={filters.segmentTag} onChange={handleFilterChange} size="small"/></Grid>
//           <Grid item xs={12} md={3} display="flex" gap={1}>
//             <Button fullWidth variant="contained" onClick={handleApplyFilters} startIcon={<SearchIcon />} disabled={loading}>Apply</Button>
//             <Button fullWidth variant="outlined" onClick={handleClearFilters} startIcon={<ClearAllIcon />} disabled={loading}>Clear</Button>
//           </Grid>
//         </Grid>
//       </Paper>
      
//       {error && <Alert severity="error">{error}</Alert>}
      
//       {/* --- MODIFIED Table Section with More Fields --- */}
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 900 }} aria-label="banner list table">
//           <TableHead>
//             <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
//               <TableCell>Client ID</TableCell>
//               <TableCell>Channel</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Segment</TableCell>
//               <TableCell align="center">Priority</TableCell>
//               <TableCell>Links</TableCell>
//               <TableCell>Valid From</TableCell>
//               <TableCell>Valid To</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow><TableCell colSpan={9} align="center"><CircularProgress /></TableCell></TableRow>
//             ) : paginatedBanners.length === 0 ? (
//               <TableRow><TableCell colSpan={9} align="center">No Banners Found</TableCell></TableRow>
//             ) : (
//               paginatedBanners.map((banner) => (
//                 <StyledTableRow key={banner.banner_id}>
//                   <TableCell>{banner.client_id}</TableCell>
//                   <TableCell>{banner.channel}</TableCell>
//                   <TableCell>
//                     <Chip label={banner.status} color={banner.status === 'active' ? 'success' : 'default'} size="small" />
//                   </TableCell>
//                   <TableCell>{banner.segment_tag || 'N/A'}</TableCell>
//                   <TableCell align="center">{banner.priority}</TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <Tooltip title="Click Action URL">
//                         <Link href={banner.click_action} target="_blank" rel="noopener noreferrer" aria-label="click action">
//                           <LinkIcon />
//                         </Link>
//                       </Tooltip>
//                       <Tooltip title="Image URL">
//                         <Link href={banner.image_url} target="_blank" rel="noopener noreferrer" aria-label="image url">
//                           <PhotoCameraIcon />
//                         </Link>
//                       </Tooltip>
//                     </Box>
//                   </TableCell>
//                   <TableCell>{formatDate(banner.valid_from)}</TableCell>
//                   <TableCell>{formatDate(banner.valid_to)}</TableCell>
//                   <TableCell align="right">
//                     <IconButton onClick={() => handleEditClick(banner)} color="primary" size="small"><EditIcon /></IconButton>
//                     <IconButton onClick={() => handleDeleteClick(banner)} color="error" size="small"><DeleteIcon /></IconButton>
//                   </TableCell>
//                 </StyledTableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25, 50]}
//         component="div"
//         count={banners.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       {/* Edit Dialog (Unchanged) */}
//       <Dialog open={!!editingBanner} onClose={handleEditClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Banner</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ pt: 1 }}>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="Banner ID" value={editingBanner?.banner_id || ''} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="Client ID" value={editingBanner?.client_id || ''} size="small"/></Grid>
//             <Grid item xs={12}><FormControl fullWidth><InputLabel>Status</InputLabel><Select label="Status" value={editingBanner?.status || 'inactive'} onChange={(e) => setEditingBanner(p => ({...p, status: e.target.value}))}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select></FormControl></Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions><Button onClick={handleEditClose}>Cancel</Button><Button onClick={handleEditSave} variant="contained">Save</Button></DialogActions>
//       </Dialog>
      
//       {/* Delete Confirmation Dialog (Unchanged) */}
//       <Dialog open={!!deleteCandidate} onClose={handleDeleteClose}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent><DialogContentText>Are you sure you want to delete banner for client "{deleteCandidate?.client_id}"?</DialogContentText></DialogContent>
//         <DialogActions><Button onClick={handleDeleteClose}>Cancel</Button><Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button></DialogActions>
//       </Dialog>
//     </Paper>
//   );
// };

// export default BannerList;



// better than the previous one
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import Papa from 'papaparse';
// import {
//   Box, Paper, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip,
//   IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Alert,
//   Link, Tooltip, styled
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
// import ClearAllIcon from '@mui/icons-material/ClearAll';
// import LinkIcon from '@mui/icons-material/Link';
// import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// // Styled component for alternating row colors
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// // --- NEW: A robust helper to handle both camelCase and snake_case data from APIs ---
// const normalizeBanner = (banner) => {
//   return {
//     banner_id: banner.bannerId || banner.banner_id,
//     client_id: banner.clientId || banner.client_id,
//     pan_id: banner.panId || banner.pan_id,
//     channel: banner.channel,
//     status: banner.status,
//     segment_tag: banner.segmentTag || banner.segment_tag,
//     priority: banner.priority,
//     click_action: banner.clickAction || banner.click_action,
//     image_url: banner.imageUrl || banner.image_url,
//     valid_from: banner.validFrom || banner.valid_from,
//     valid_to: banner.validTo || banner.valid_to,
//   };
// };

// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     return new Date(dateString).toLocaleString();
//   } catch (error) {
//     return 'Invalid Date';
//   }
// };

// const BannerList = () => {
//   const [banners, setBanners] = useState([]);
//   const [isSearchMode, setIsSearchMode] = useState(false);
//   const [filters, setFilters] = useState({ clientId: '', panId: '', channel: '', segmentTag: '' });
  
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const [editingBanner, setEditingBanner] = useState(null);
//   const [deleteCandidate, setDeleteCandidate] = useState(null);

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const CSV_EXPORT_URL = import.meta.env.VITE_CSV_EXPORT_URL;

//   const fetchBanners = useCallback(async (isSearch = false, searchFilters = {}) => {
//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem("authToken");

//     try {
//       let data;
//       if (isSearch) {
//         // --- API Search Logic ---
//         const activeFilters = Object.fromEntries(Object.entries(searchFilters).filter(([_, value]) => value));
//         const query = new URLSearchParams(activeFilters).toString();
//         const response = await axios.get(`${API_BASE_URL}/api/banners?${query}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         data = response.data;
//       } else {
//         // --- Default Paginated CSV Fetch Logic ---
//         const res = await fetch(`${CSV_EXPORT_URL}?chunk=1`); // Fetching one large chunk
//         if (!res.ok) throw new Error("Could not fetch initial banner data.");
//         const text = await res.text();
//         const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
//         data = parsed.data.filter(row => row.banner_id?.trim());
//       }
//       // Normalize all incoming data to a consistent format
//       setBanners(data.map(normalizeBanner));
//     } catch (err) {
//       setError(err.message || "An error occurred while fetching data.");
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL, CSV_EXPORT_URL]);

//   // --- FIXED: useEffect now fetches data on initial load ---
//   useEffect(() => {
//     fetchBanners(isSearchMode, filters);
//   }, [isSearchMode]); // Re-fetches when switching between search and browse mode

//   const handleApplyFilters = () => {
//     setIsSearchMode(true);
//     fetchBanners(true, filters); // Explicitly call fetch with search parameters
//   };
  
//   const handleClearFilters = () => {
//     setFilters({ clientId: '', panId: '', channel: '', segmentTag: '' });
//     if (isSearchMode) {
//       setIsSearchMode(false); // This will trigger the useEffect to refetch the default list
//     }
//   };
  
//   const handleFilterChange = (event) => { setFilters(prev => ({ ...prev, [event.target.name]: event.target.value })); };
//   const handleEditClick = (banner) => setEditingBanner({ ...banner });
//   const handleEditClose = () => setEditingBanner(null);
  
//   const handleEditSave = async () => {
//     if (!editingBanner) return;
//     const token = localStorage.getItem("authToken");
//     // Destructure all editable fields from the state
//     const { banner_id, channel, status, priority, segment_tag, click_action } = editingBanner;
    
//     // Create payload with only the fields that can be edited
//     const payload = { channel, status, priority, segment_tag, clickAction: click_action };

//     try {
//       const { data } = await axios.put(`${API_BASE_URL}/api/banners/${banner_id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Normalize the response from the server before updating the state
//       const updatedBanner = normalizeBanner(data);
//       setBanners(prev => prev.map(b => b.banner_id === banner_id ? updatedBanner : b));
//       handleEditClose();
//     } catch (err) {
//       console.error("Error updating banner:", err);
//       alert("Failed to update banner.");
//     }
//   };

//   const handleDeleteClick = (banner) => setDeleteCandidate(banner);
//   const handleDeleteClose = () => setDeleteCandidate(null);

//   const handleDeleteConfirm = async () => {
//     if (!deleteCandidate) return;
//     const token = localStorage.getItem("authToken");
//     try {
//       await axios.delete(`${API_BASE_URL}/api/banners/${deleteCandidate.banner_id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(prev => prev.filter(b => b.banner_id !== deleteCandidate.banner_id));
//       handleDeleteClose();
//     } catch (err) {
//       console.error("Error deleting banner:", err);
//       alert("Failed to delete banner.");
//     }
//   };

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
  
//   const paginatedBanners = banners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
//       <Typography variant="h4" gutterBottom>Banner Management</Typography>
      
//       <Paper variant="outlined" sx={{ p: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Client ID" name="clientId" value={filters.clientId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="PAN ID" name="panId" value={filters.panId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select name="channel" value={filters.channel} label="Channel" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="Segment Tag" name="segmentTag" value={filters.segmentTag} onChange={handleFilterChange} size="small"/></Grid>
//           <Grid item xs={12} md={3} display="flex" gap={1}>
//             <Button fullWidth variant="contained" onClick={handleApplyFilters} startIcon={<SearchIcon />} disabled={loading}>Apply</Button>
//             <Button fullWidth variant="outlined" onClick={handleClearFilters} startIcon={<ClearAllIcon />} disabled={loading}>Clear</Button>
//           </Grid>
//         </Grid>
//       </Paper>
      
//       {error && <Alert severity="error">{error}</Alert>}
      
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 900 }} aria-label="banner list table">
//           <TableHead><TableRow sx={{ '& th': { fontWeight: 'bold' } }}><TableCell>Client ID</TableCell><TableCell>Channel</TableCell><TableCell>Status</TableCell><TableCell>Segment</TableCell><TableCell align="center">Priority</TableCell><TableCell>Links</TableCell><TableCell>Valid From</TableCell><TableCell>Valid To</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
//           <TableBody>
//             {loading ? (<TableRow><TableCell colSpan={9} align="center"><CircularProgress /></TableCell></TableRow>) : paginatedBanners.length === 0 ? (<TableRow><TableCell colSpan={9} align="center">No Banners Found</TableCell></TableRow>) : (
//               paginatedBanners.map((banner) => (
//                 <StyledTableRow key={banner.banner_id}>
//                   <TableCell>{banner.client_id || 'N/A'}</TableCell>
//                   <TableCell>{banner.channel || 'N/A'}</TableCell>
//                   <TableCell><Chip label={banner.status || 'unknown'} color={banner.status === 'active' ? 'success' : 'default'} size="small" /></TableCell>
//                   <TableCell>{banner.segment_tag || 'N/A'}</TableCell>
//                   <TableCell align="center">{banner.priority || 'N/A'}</TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <Tooltip title="Click Action URL"><Link href={banner.click_action} target="_blank" rel="noopener noreferrer" aria-label="click action" sx={{ color: banner.click_action ? 'primary.main' : 'text.disabled' }}><LinkIcon /></Link></Tooltip>
//                       <Tooltip title="Image URL"><Link href={banner.image_url} target="_blank" rel="noopener noreferrer" aria-label="image url" sx={{ color: banner.image_url ? 'primary.main' : 'text.disabled' }}><PhotoCameraIcon /></Link></Tooltip>
//                     </Box>
//                   </TableCell>
//                   <TableCell>{formatDate(banner.valid_from)}</TableCell>
//                   <TableCell>{formatDate(banner.valid_to)}</TableCell>
//                   <TableCell align="right">
//                     <IconButton onClick={() => handleEditClick(banner)} color="primary" size="small"><EditIcon /></IconButton>
//                     <IconButton onClick={() => handleDeleteClick(banner)} color="error" size="small"><DeleteIcon /></IconButton>
//                   </TableCell>
//                 </StyledTableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={banners.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>

//       {/* --- FIXED: Enhanced Edit Dialog with more fields --- */}
//       <Dialog open={!!editingBanner} onClose={handleEditClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Banner: {editingBanner?.banner_id}</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ pt: 1 }}>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="Client ID" value={editingBanner?.client_id || ''} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="PAN ID" value={editingBanner?.pan_id || ''} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select label="Channel" value={editingBanner?.channel || ''} onChange={(e) => setEditingBanner(p => ({...p, channel: e.target.value}))}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
//             <Grid item xs={12} sm={6}><FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select label="Status" value={editingBanner?.status || 'inactive'} onChange={(e) => setEditingBanner(p => ({...p, status: e.target.value}))}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem><MenuItem value="draft">Draft</MenuItem></Select></FormControl></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Priority" type="number" value={editingBanner?.priority || ''} onChange={(e) => setEditingBanner(p => ({...p, priority: e.target.value}))} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Segment Tag" value={editingBanner?.segment_tag || ''} onChange={(e) => setEditingBanner(p => ({...p, segment_tag: e.target.value}))} size="small"/></Grid>
//             <Grid item xs={12}><TextField fullWidth label="Click Action URL" value={editingBanner?.click_action || ''} onChange={(e) => setEditingBanner(p => ({...p, click_action: e.target.value}))} size="small"/></Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions><Button onClick={handleEditClose}>Cancel</Button><Button onClick={handleEditSave} variant="contained">Save Changes</Button></DialogActions>
//       </Dialog>
      
//       <Dialog open={!!deleteCandidate} onClose={handleDeleteClose}><DialogTitle>Confirm Deletion</DialogTitle><DialogContent><DialogContentText>Are you sure you want to delete banner for client "{deleteCandidate?.client_id}"?</DialogContentText></DialogContent><DialogActions><Button onClick={handleDeleteClose}>Cancel</Button><Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button></DialogActions></Dialog>
//     </Paper>
//   );
// };

// export default BannerList;


// best till now 

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import Papa from 'papaparse';
// import {
//   Box, Paper, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip,
//   IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Alert,
//   Link, Tooltip, styled
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
// import ClearAllIcon from '@mui/icons-material/ClearAll';
// import LinkIcon from '@mui/icons-material/Link';
// import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// // Styled component for alternating row colors
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// // A robust helper to handle both camelCase and snake_case data from APIs
// const normalizeBanner = (banner) => {
//   return {
//     banner_id: banner.bannerId || banner.banner_id,
//     client_id: banner.clientId || banner.client_id,
//     pan_id: banner.panId || banner.pan_id,
//     channel: banner.channel,
//     status: banner.status,
//     segment_tag: banner.segmentTag || banner.segment_tag,
//     priority: banner.priority,
//     click_action: banner.clickAction || banner.click_action,
//     image_url: banner.imageUrl || banner.image_url,
//     valid_from: banner.validFrom || banner.valid_from,
//     valid_to: banner.validTo || banner.valid_to,
//   };
// };

// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     return new Date(dateString).toLocaleString();
//   } catch (error) {
//     return 'Invalid Date';
//   }
// };

// const BannerList = () => {
//   const [banners, setBanners] = useState([]);
//   const [filters, setFilters] = useState({ clientId: '', panId: '', channel: '', segmentTag: '' });
  
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const [editingBanner, setEditingBanner] = useState(null);
//   const [deleteCandidate, setDeleteCandidate] = useState(null);

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const CSV_EXPORT_URL = import.meta.env.VITE_CSV_EXPORT_URL;

//   // --- useCallback for memoizing fetch functions ---
  
//   const fetchFromExportUrl = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${CSV_EXPORT_URL}?chunk=1`);
//       if (!res.ok) throw new Error("Could not fetch the default banner list.");
//       const text = await res.text();
//       const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
//       const data = parsed.data.filter(row => row.banner_id?.trim());
//       setBanners(data.map(normalizeBanner));
//     } catch (err) {
//       setError(err.message || "An error occurred while fetching data.");
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [CSV_EXPORT_URL]);

//   const fetchWithFilters = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setPage(0); // Reset to the first page for every new search
//     try {
//       const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value.trim() !== ''));
      
//       if (Object.keys(activeFilters).length === 0) {
//         setError("Please enter at least one filter to search.");
//         setBanners([]); // Clear previous results
//         return;
//       }

//       const query = new URLSearchParams(activeFilters).toString();
//       const token = localStorage.getItem("authToken");
//       const { data } = await axios.get(`${API_BASE_URL}/api/banners?${query}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(data.map(normalizeBanner));
//     } catch (err) {
//       setError("Failed to load filtered banners. Please try again.");
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters, API_BASE_URL]);

//   // --- FIXED: useEffect now only runs once on initial mount ---
//   useEffect(() => {
//     fetchFromExportUrl();
//   }, [fetchFromExportUrl]); // The dependency array ensures it runs only once.

//   const handleFilterChange = (event) => setFilters(prev => ({ ...prev, [event.target.name]: event.target.value }));
//   const handleEditClick = (banner) => setEditingBanner({ ...banner });
//   const handleEditClose = () => setEditingBanner(null);
  
//   const handleClearFilters = () => {
//     setFilters({ clientId: '', panId: '', channel: '', segmentTag: '' });
//     fetchFromExportUrl(); // Refetch the original full list
//   };

//   const handleEditSave = async () => {
//     if (!editingBanner) return;
//     const token = localStorage.getItem("authToken");
//     const { banner_id, channel, status, priority, segment_tag, click_action } = editingBanner;
//     const payload = { channel, status, priority, segment_tag, clickAction: click_action };

//     try {
//       const { data } = await axios.put(`${API_BASE_URL}/api/banners/${banner_id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updatedBanner = normalizeBanner(data);
//       setBanners(prev => prev.map(b => b.banner_id === banner_id ? updatedBanner : b));
//       handleEditClose();
//     } catch (err) {
//       console.error("Error updating banner:", err);
//       alert("Failed to update banner.");
//     }
//   };

//   const handleDeleteClick = (banner) => setDeleteCandidate(banner);
//   const handleDeleteClose = () => setDeleteCandidate(null);

//   const handleDeleteConfirm = async () => {
//     if (!deleteCandidate) return;
//     const token = localStorage.getItem("authToken");
//     try {
//       await axios.delete(`${API_BASE_URL}/api/banners/${deleteCandidate.banner_id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(prev => prev.filter(b => b.banner_id !== deleteCandidate.banner_id));
//       handleDeleteClose();
//     } catch (err) {
//       console.error("Error deleting banner:", err);
//       alert("Failed to delete banner.");
//     }
//   };

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
  
//   const paginatedBanners = banners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
//       <Typography variant="h4" gutterBottom>Banner Management</Typography>
      
//       <Paper variant="outlined" sx={{ p: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Client ID" name="clientId" value={filters.clientId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="PAN ID" name="panId" value={filters.panId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select name="channel" value={filters.channel} label="Channel" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="Segment Tag" name="segmentTag" value={filters.segmentTag} onChange={handleFilterChange} size="small"/></Grid>
//           <Grid item xs={12} md={3} display="flex" gap={1}>
//             <Button fullWidth variant="contained" onClick={fetchWithFilters} startIcon={<SearchIcon />} disabled={loading}>Apply</Button>
//             <Button fullWidth variant="outlined" onClick={handleClearFilters} startIcon={<ClearAllIcon />} disabled={loading}>Clear</Button>
//           </Grid>
//         </Grid>
//       </Paper>
      
//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 900 }} aria-label="banner list table">
//           <TableHead><TableRow sx={{ '& th': { fontWeight: 'bold' } }}><TableCell>Client ID</TableCell><TableCell>Channel</TableCell><TableCell>Status</TableCell><TableCell>Segment</TableCell><TableCell align="center">Priority</TableCell><TableCell>Links</TableCell><TableCell>Valid From</TableCell><TableCell>Valid To</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
//           <TableBody>
//             {loading ? (<TableRow><TableCell colSpan={9} align="center"><CircularProgress /></TableCell></TableRow>) : paginatedBanners.length === 0 ? (<TableRow><TableCell colSpan={9} align="center">No Banners Found</TableCell></TableRow>) : (
//               paginatedBanners.map((banner) => (
//                 <StyledTableRow key={banner.banner_id}>
//                   <TableCell>{banner.client_id || 'N/A'}</TableCell>
//                   <TableCell>{banner.channel || 'N/A'}</TableCell>
//                   <TableCell><Chip label={banner.status || 'unknown'} color={banner.status === 'active' ? 'success' : 'default'} size="small" /></TableCell>
//                   <TableCell>{banner.segment_tag || 'N/A'}</TableCell>
//                   <TableCell align="center">{banner.priority || 'N/A'}</TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <Tooltip title="Click Action URL"><Link href={banner.click_action} target="_blank" rel="noopener noreferrer" aria-label="click action" sx={{ color: banner.click_action ? 'primary.main' : 'text.disabled', pointerEvents: banner.click_action ? 'auto' : 'none' }}><LinkIcon /></Link></Tooltip>
//                       <Tooltip title="Image URL"><Link href={banner.image_url} target="_blank" rel="noopener noreferrer" aria-label="image url" sx={{ color: banner.image_url ? 'primary.main' : 'text.disabled', pointerEvents: banner.image_url ? 'auto' : 'none' }}><PhotoCameraIcon /></Link></Tooltip>
//                     </Box>
//                   </TableCell>
//                   <TableCell>{formatDate(banner.valid_from)}</TableCell>
//                   <TableCell>{formatDate(banner.valid_to)}</TableCell>
//                   <TableCell align="right">
//                     <IconButton onClick={() => handleEditClick(banner)} color="primary" size="small"><EditIcon /></IconButton>
//                     <IconButton onClick={() => handleDeleteClick(banner)} color="error" size="small"><DeleteIcon /></IconButton>
//                   </TableCell>
//                 </StyledTableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={banners.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>

//       <Dialog open={!!editingBanner} onClose={handleEditClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Banner: {editingBanner?.banner_id}</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ pt: 1 }}>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="Client ID" value={editingBanner?.client_id || ''} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="PAN ID" value={editingBanner?.pan_id || ''} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select label="Channel" name="channel" value={editingBanner?.channel || ''} onChange={(e) => setEditingBanner(p => ({...p, channel: e.target.value}))}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
//             <Grid item xs={12} sm={6}><FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select label="Status" name="status" value={editingBanner?.status || 'inactive'} onChange={(e) => setEditingBanner(p => ({...p, status: e.target.value}))}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem><MenuItem value="draft">Draft</MenuItem></Select></FormControl></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Priority" type="number" name="priority" value={editingBanner?.priority || ''} onChange={(e) => setEditingBanner(p => ({...p, priority: e.target.value}))} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Segment Tag" name="segment_tag" value={editingBanner?.segment_tag || ''} onChange={(e) => setEditingBanner(p => ({...p, segment_tag: e.target.value}))} size="small"/></Grid>
//             <Grid item xs={12}><TextField fullWidth label="Click Action URL" name="click_action" value={editingBanner?.click_action || ''} onChange={(e) => setEditingBanner(p => ({...p, click_action: e.target.value}))} size="small"/></Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions><Button onClick={handleEditClose}>Cancel</Button><Button onClick={handleEditSave} variant="contained">Save Changes</Button></DialogActions>
//       </Dialog>
      
//       <Dialog open={!!deleteCandidate} onClose={handleDeleteClose}><DialogTitle>Confirm Deletion</DialogTitle><DialogContent><DialogContentText>Are you sure you want to delete banner for client "{deleteCandidate?.client_id}"?</DialogContentText></DialogContent><DialogActions><Button onClick={handleDeleteClose}>Cancel</Button><Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button></DialogActions></Dialog>
//     </Paper>
//   );
// };

// export default BannerList;





// page acceesssssss so reffer 
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import Papa from 'papaparse';
// import {
//   Box, Paper, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip,
//   IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Alert,
//   Link, Tooltip, styled
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
// import ClearAllIcon from '@mui/icons-material/ClearAll';
// import LinkIcon from '@mui/icons-material/Link';
// import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// // Styled component for alternating row colors
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// // A robust helper to handle both camelCase and snake_case data from APIs
// const normalizeBanner = (banner) => {
//   return {
//     banner_id: banner.bannerId || banner.banner_id, client_id: banner.clientId || banner.client_id,
//     pan_id: banner.panId || banner.pan_id, channel: banner.channel, status: banner.status,
//     segment_tag: banner.segmentTag || banner.segment_tag, priority: banner.priority,
//     click_action: banner.clickAction || banner.click_action, image_url: banner.imageUrl || banner.image_url,
//     valid_from: banner.validFrom || banner.valid_from, valid_to: banner.validTo || banner.valid_to,
//   };
// };

// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try { return new Date(dateString).toLocaleString(); } catch (error) { return 'Invalid Date'; }
// };

// // Helper to format server dates for the <input type="datetime-local">
// const formatDateForInput = (dateString) => {
//   if (!dateString) return '';
//   try {
//     const d = new Date(dateString);
//     const pad = (num) => num.toString().padStart(2, '0');
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
//   } catch { return ''; }
// };

// const BannerList = () => {
//   const [banners, setBanners] = useState([]);
//   const [isSearchMode, setIsSearchMode] = useState(false);
//   const [filters, setFilters] = useState({ clientId: '', panId: '', channel: '', segmentTag: '' });
  
//   // State for server-side pagination (chunk-based)
//   const [chunk, setChunk] = useState(1); 
//   const [hasNextPage, setHasNextPage] = useState(true);
  
//   // State for client-side pagination (for search results)
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const [editingBanner, setEditingBanner] = useState(null);
//   const [deleteCandidate, setDeleteCandidate] = useState(null);

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const CSV_EXPORT_URL = import.meta.env.VITE_CSV_EXPORT_URL;

//   const fetchBannersByChunk = useCallback(async (currentChunk) => {
//     if (isSearchMode) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${CSV_EXPORT_URL}?chunk=${currentChunk}`);
//       if (!res.ok) {
//         setHasNextPage(false);
//         if (currentChunk === 1) setBanners([]); // Clear if first page fails
//         throw new Error("Could not fetch banner data for this page.");
//       }
//       const text = await res.text();
//       const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
//       const data = parsed.data.filter(row => row.banner_id?.trim());

//       setBanners(data.map(normalizeBanner));
//       setHasNextPage(data.length > 0); // Assume no next page if current chunk is empty
//     } catch (err) {
//       setError(err.message || "An error occurred.");
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [isSearchMode, CSV_EXPORT_URL]);

//   useEffect(() => {
//     if (!isSearchMode) {
//       fetchBannersByChunk(chunk);
//     }
//   }, [chunk, isSearchMode, fetchBannersByChunk]);

//   const handleApplyFilters = async () => {
//     setIsSearchMode(true);
//     setLoading(true);
//     setError(null);
//     setPage(0);
//     try {
//       const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value.trim() !== ''));
//       if (Object.keys(activeFilters).length === 0) {
//         throw new Error("Please enter at least one filter to search.");
//       }
//       const query = new URLSearchParams(activeFilters).toString();
//       const token = localStorage.getItem("authToken");
//       const { data } = await axios.get(`${API_BASE_URL}/api/banners?${query}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(data.map(normalizeBanner));
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Failed to load filtered banners.");
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearFilters = () => {
//     setFilters({ clientId: '', panId: '', channel: '', segmentTag: '' });
//     setChunk(1); // Reset to first chunk
//     if (isSearchMode) {
//       setIsSearchMode(false); // This will trigger the useEffect to refetch chunk 1
//     } else {
//       fetchBannersByChunk(1); // Manually refetch if already in browse mode
//     }
//   };
  
//   const handleFilterChange = (event) => setFilters(prev => ({ ...prev, [event.target.name]: event.target.value }));
//   const handleEditClick = (banner) => setEditingBanner({ ...banner });
//   const handleEditClose = () => setEditingBanner(null);
  
//   const handleEditSave = async () => {
//     if (!editingBanner) return;
//     const token = localStorage.getItem("authToken");
//     const { banner_id, ...editableFields } = editingBanner;
    
//     // Create a payload with camelCase keys that the API expects for editing
//     const payload = {
//       channel: editableFields.channel, status: editableFields.status, priority: editableFields.priority,
//       segmentTag: editableFields.segment_tag, clickAction: editableFields.click_action,
//       validFrom: editableFields.valid_from, validTo: editableFields.valid_to
//     };

//     try {
//       const { data } = await axios.put(`${API_BASE_URL}/api/banners/${banner_id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updatedBanner = normalizeBanner(data);
//       setBanners(prev => prev.map(b => b.banner_id === banner_id ? updatedBanner : b));
//       handleEditClose();
//     } catch (err) {
//       console.error("Error updating banner:", err);
//       alert("Failed to update banner.");
//     }
//   };

//   const handleDeleteClick = (banner) => setDeleteCandidate(banner);
//   const handleDeleteClose = () => setDeleteCandidate(null);

//   const handleDeleteConfirm = async () => {
//     if (!deleteCandidate) return;
//     const token = localStorage.getItem("authToken");
//     try {
//       await axios.delete(`${API_BASE_URL}/api/banners/${deleteCandidate.banner_id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(prev => prev.filter(b => b.banner_id !== deleteCandidate.banner_id));
//       handleDeleteClose();
//     } catch (err) {
//       console.error("Error deleting banner:", err);
//       alert("Failed to delete banner.");
//     }
//   };

//   // Pagination handlers
//   const handleChangePage = (event, newPage) => { isSearchMode ? setPage(newPage) : setChunk(chunk + (newPage > page ? 1 : -1)); };
//   const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
  
//   const paginatedBanners = isSearchMode ? banners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : banners;

//   return (
//     <Paper sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
//       <Typography variant="h4" gutterBottom>Banner Management</Typography>
      
//       <Paper variant="outlined" sx={{ p: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Client ID" name="clientId" value={filters.clientId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="PAN ID" name="panId" value={filters.panId} onChange={handleFilterChange} size="small" /></Grid>
//           <Grid item xs={12} sm={6} md={2}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select name="channel" value={filters.channel} label="Channel" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
//           <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="Segment Tag" name="segmentTag" value={filters.segmentTag} onChange={handleFilterChange} size="small"/></Grid>
//           <Grid item xs={12} md={3} display="flex" gap={1}>
//             <Button fullWidth variant="contained" onClick={handleApplyFilters} startIcon={<SearchIcon />} disabled={loading}>Apply</Button>
//             <Button fullWidth variant="outlined" onClick={handleClearFilters} startIcon={<ClearAllIcon />} disabled={loading}>Clear</Button>
//           </Grid>
//         </Grid>
//       </Paper>
      
//       {error && <Alert severity="error">{error}</Alert>}
      
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 900 }} aria-label="banner list table">
//           <TableHead><TableRow sx={{ '& th': { fontWeight: 'bold' } }}><TableCell>Client ID</TableCell><TableCell>Channel</TableCell><TableCell>Status</TableCell><TableCell>Segment</TableCell><TableCell align="center">Priority</TableCell><TableCell>Links</TableCell><TableCell>Valid From</TableCell><TableCell>Valid To</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
//           <TableBody>
//             {loading ? (<TableRow><TableCell colSpan={9} align="center"><CircularProgress /></TableCell></TableRow>) : paginatedBanners.length === 0 ? (<TableRow><TableCell colSpan={9} align="center">No Banners Found</TableCell></TableRow>) : (
//               paginatedBanners.map((banner) => (
//                 <StyledTableRow key={banner.banner_id}>
//                   <TableCell>{banner.client_id || 'N/A'}</TableCell><TableCell>{banner.channel || 'N/A'}</TableCell>
//                   <TableCell><Chip label={banner.status || 'unknown'} color={banner.status === 'active' ? 'success' : 'default'} size="small" /></TableCell>
//                   <TableCell>{banner.segment_tag || 'N/A'}</TableCell><TableCell align="center">{banner.priority || 'N/A'}</TableCell>
//                   <TableCell><Box sx={{ display: 'flex', gap: 1 }}><Tooltip title="Click Action URL"><Link href={banner.click_action} target="_blank" rel="noopener noreferrer" aria-label="click action" sx={{ color: banner.click_action ? 'primary.main' : 'text.disabled', pointerEvents: banner.click_action ? 'auto' : 'none' }}><LinkIcon /></Link></Tooltip><Tooltip title="Image URL"><Link href={banner.image_url} target="_blank" rel="noopener noreferrer" aria-label="image url" sx={{ color: banner.image_url ? 'primary.main' : 'text.disabled', pointerEvents: banner.image_url ? 'auto' : 'none' }}><PhotoCameraIcon /></Link></Tooltip></Box></TableCell>
//                   <TableCell>{formatDate(banner.valid_from)}</TableCell><TableCell>{formatDate(banner.valid_to)}</TableCell>
//                   <TableCell align="right"><IconButton onClick={() => handleEditClick(banner)} color="primary" size="small"><EditIcon /></IconButton><IconButton onClick={() => handleDeleteClick(banner)} color="error" size="small"><DeleteIcon /></IconButton></TableCell>
//                 </StyledTableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       {isSearchMode ? (
//         <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={banners.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
//       ) : (
//         <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}><Typography>Page {chunk}</Typography><Button onClick={()=>setChunk(c=>c-1)} disabled={chunk<=1 || loading}>Prev</Button><Button onClick={()=>setChunk(c=>c+1)} disabled={!hasNextPage || loading}>Next</Button></Box>
//       )}

//       <Dialog open={!!editingBanner} onClose={handleEditClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Banner: {editingBanner?.banner_id}</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ pt: 1 }}>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="Client ID" value={editingBanner?.client_id || ''} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField disabled fullWidth label="PAN ID" value={editingBanner?.pan_id || ''} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select label="Channel" value={editingBanner?.channel || ''} onChange={(e) => setEditingBanner(p => ({...p, channel: e.target.value}))}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
//             <Grid item xs={12} sm={6}><FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select label="Status" value={editingBanner?.status || 'inactive'} onChange={(e) => setEditingBanner(p => ({...p, status: e.target.value}))}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem><MenuItem value="draft">Draft</MenuItem></Select></FormControl></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Priority" type="number" value={editingBanner?.priority || ''} onChange={(e) => setEditingBanner(p => ({...p, priority: e.target.value}))} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Segment Tag" value={editingBanner?.segment_tag || ''} onChange={(e) => setEditingBanner(p => ({...p, segment_tag: e.target.value}))} size="small"/></Grid>
//             <Grid item xs={12}><TextField fullWidth label="Click Action URL" value={editingBanner?.click_action || ''} onChange={(e) => setEditingBanner(p => ({...p, click_action: e.target.value}))} size="small"/></Grid>
//             <Grid item xs={12} sm={6}><TextField label="Valid From" type="datetime-local" fullWidth size="small" InputLabelProps={{ shrink: true }} value={formatDateForInput(editingBanner?.valid_from)} onChange={(e) => setEditingBanner(p => ({...p, valid_from: e.target.value}))}/></Grid>
//             <Grid item xs={12} sm={6}><TextField label="Valid To" type="datetime-local" fullWidth size="small" InputLabelProps={{ shrink: true }} value={formatDateForInput(editingBanner?.valid_to)} onChange={(e) => setEditingBanner(p => ({...p, valid_to: e.target.value}))}/></Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions><Button onClick={handleEditClose}>Cancel</Button><Button onClick={handleEditSave} variant="contained">Save Changes</Button></DialogActions>
//       </Dialog>
      
//       <Dialog open={!!deleteCandidate} onClose={handleDeleteClose}><DialogTitle>Confirm Deletion</DialogTitle><DialogContent><DialogContentText>Are you sure you want to delete banner for client "{deleteCandidate?.client_id}"?</DialogContentText></DialogContent><DialogActions><Button onClick={handleDeleteClose}>Cancel</Button><Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button></DialogActions></Dialog>
//     </Paper>
//   );
// };

// export default BannerList;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import {
  Box, Paper, Typography, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Alert,
  Link, Tooltip, styled
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import LinkIcon from '@mui/icons-material/Link';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// --- STYLED AND HELPER FUNCTIONS (UNCHANGED AND CORRECT) ---
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover, },
  '&:last-child td, &:last-child th': { border: 0, },
}));

const normalizeBanner = (banner) => ({
  banner_id: banner.bannerId || banner.banner_id, client_id: banner.clientId || banner.client_id,
  pan_id: banner.panId || banner.pan_id, channel: banner.channel, status: banner.status,
  segment_tag: banner.segmentTag || banner.segment_tag, priority: banner.priority,
  click_action: banner.clickAction || banner.click_action, image_url: banner.imageUrl || banner.image_url,
  valid_from: banner.validFrom || banner.valid_from, valid_to: banner.validTo || banner.valid_to,
});

// --- THIS IS THE FINAL, CORRECTED FUNCTION ---
const createApiPayload = (bannerState) => {
  // Helper to safely format the date string into the required 'YYYY-MM-DDTHH:mm:ssZ' format.
  const formatDateForAPI = (dateString) => {
    if (!dateString) {
      return null; // If the date is not set, send null.
    }
    try {
      // Create a Date object from the input string.
      const date = new Date(dateString);
      // .toISOString() produces a format like "2023-10-01T00:00:00.000Z".
      // The backend test doesn't have milliseconds, so we will remove them to be safe.
      const isoString = date.toISOString();
      // Split at the decimal point and take the first part, then add 'Z'.
      return isoString.split('.')[0] + 'Z';
    } catch (e) {
      // If the date is invalid for any reason, return null.
      return null;
    }
  };

  return {
    clientId: bannerState.client_id,
    panId: bannerState.pan_id, 
    channel: bannerState.channel, 
    status: bannerState.status, 
    priority: parseInt(bannerState.priority, 10) || 0,
    segmentTag: bannerState.segment_tag, 
    clickAction: bannerState.click_action,
    
    // FIXED: Send dates in the exact ISO 8601 UTC string format required by the backend.
    validFrom: formatDateForAPI(bannerState.valid_from),
    validTo: formatDateForAPI(bannerState.valid_to),
  };
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try { return new Date(dateString).toLocaleString(); } catch (error) { return 'Invalid Date'; }
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    const pad = (num) => num.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ''; }
};
// --- END OF HELPERS ---

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [filters, setFilters] = useState({ clientId: '', panId: '', channel: '', segmentTag: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // --- FIXED: True Pagination State ---
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [chunk, setChunk] = useState(1); // Represents the current page/chunk
  const [hasNextPage, setHasNextPage] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const CSV_EXPORT_URL = import.meta.env.VITE_CSV_EXPORT_URL;

  // --- DATA FETCHING LOGIC ---
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${CSV_EXPORT_URL}?chunk=${chunk}`);
      if (!res.ok) {
        if (res.status === 404) {
          setHasNextPage(false);
          setBanners([]); // Clear banners on a page that doesn't exist
        } else {
          throw new Error("Could not fetch banner data.");
        }
        return;
      }
      const text = await res.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      const data = parsed.data.filter(row => row.banner_id?.trim());
      setBanners(data.map(normalizeBanner));
      
      // Proactively check if the next page exists to enable/disable the 'Next' button
      const nextRes = await fetch(`${CSV_EXPORT_URL}?chunk=${chunk + 1}`);
      setHasNextPage(nextRes.ok);

    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [chunk, CSV_EXPORT_URL]);

  const fetchWithFilters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value.trim() !== ''));
      if (Object.keys(activeFilters).length === 0) {
        setError("Please enter at least one filter to search.");
        setBanners([]);
        return;
      }
      const query = new URLSearchParams(activeFilters).toString();
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(`${API_BASE_URL}/api/banners?${query}`, { headers: { Authorization: `Bearer ${token}` } });
      setBanners(data.map(normalizeBanner));
    } catch (err) {
      setError("Failed to load filtered banners.");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [filters, API_BASE_URL]);

  // --- FIXED: useEffect now fetches based on chunk or search mode ---
  useEffect(() => {
    if (isSearchMode) {
      // In search mode, fetching is triggered by the button, not this effect.
      return; 
    }
    fetchBanners();
  }, [chunk, isSearchMode, fetchBanners]);

  const handleApplyFilters = () => {
    setIsSearchMode(true);
    fetchWithFilters();
  };
  
  const handleClearFilters = () => {
    setIsSearchMode(false);
    setFilters({ clientId: '', panId: '', channel: '', segmentTag: '' });
    if (chunk !== 1) {
      setChunk(1); // Changing chunk will trigger the useEffect to fetch page 1
    } else {
      fetchBanners(); // If already on page 1, manually refetch
    }
  };
  
  const handleFilterChange = (event) => setFilters(prev => ({ ...prev, [event.target.name]: event.target.value }));
  const handleEditClick = (banner) => setEditingBanner({ ...banner });
  const handleEditClose = () => setEditingBanner(null);

//   const handleEditSave = async () => {
//     if (!editingBanner) return;
//     const token = localStorage.getItem("authToken");
//     const { banner_id } = editingBanner;
//     const payload = createApiPayload(editingBanner); // Use helper to create correct payload

//     try {
//       const { data } = await axios.put(`${API_BASE_URL}/api/banners/${banner_id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updatedBanner = normalizeBanner(data);
//       setBanners(prev => prev.map(b => b.banner_id === banner_id ? updatedBanner : b));
//       handleEditClose();
//     } catch (err) {
//       console.error("Error updating banner:", err);
//       alert("Failed to update banner.");
//     }
//   };

  const handleEditSave = async () => {
    if (!editingBanner) return;

    const token = localStorage.getItem("authToken");
    const { banner_id } = editingBanner;
    
    // --- THIS IS THE FIX ---
    // Instead of creating the payload manually and inconsistently,
    // we use the helper function that correctly formats everything to camelCase.
    const payload = createApiPayload(editingBanner); 

    // For debugging, you can see the correctly formatted payload here
    console.log("Sending updated payload:", payload);

    try {
      const { data } = await axios.put(`${API_BASE_URL}/api/banners/${banner_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // The server response might be camelCase, so we normalize it for our state.
      const updatedBanner = normalizeBanner(data);
      
      // Update the banner in our local list to reflect the changes instantly.
      setBanners(prev => prev.map(b => b.banner_id === banner_id ? updatedBanner : b));
      handleEditClose();
    } catch (err) {
      // Provide a more detailed error message to the user.
      console.error("Error updating banner:", err);
      const errorMessage = err.response?.data?.message || "Failed to update banner. Please check the console.";
      alert(errorMessage);
    }
  };

  const handleDeleteClick = (banner) => setDeleteCandidate(banner);
  const handleDeleteClose = () => setDeleteCandidate(null);

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${API_BASE_URL}/api/banners/${deleteCandidate.banner_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners(prev => prev.filter(b => b.banner_id !== deleteCandidate.banner_id));
      handleDeleteClose();
    } catch (err) {
      console.error("Error deleting banner:", err);
      alert("Failed to delete banner.");
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h4" gutterBottom>Banner Management</Typography>
      
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Client ID" name="clientId" value={filters.clientId} onChange={handleFilterChange} size="small" /></Grid>
          <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="PAN ID" name="panId" value={filters.panId} onChange={handleFilterChange} size="small" /></Grid>
          <Grid item xs={12} sm={6} md={2}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select name="channel" value={filters.channel} label="Channel" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12} sm={6} md={2}><TextField fullWidth label="Segment Tag" name="segmentTag" value={filters.segmentTag} onChange={handleFilterChange} size="small"/></Grid>
          <Grid item xs={12} md={3} display="flex" gap={1}>
            <Button fullWidth variant="contained" onClick={handleApplyFilters} startIcon={<SearchIcon />} disabled={loading}>Apply</Button>
            <Button fullWidth variant="outlined" onClick={handleClearFilters} startIcon={<ClearAllIcon />} disabled={loading}>Clear</Button>
          </Grid>
        </Grid>
      </Paper>
      
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 900 }}><TableHead><TableRow sx={{ '& th': { fontWeight: 'bold' } }}><TableCell>Client ID</TableCell><TableCell>Channel</TableCell><TableCell>Status</TableCell><TableCell>Segment</TableCell><TableCell align="center">Priority</TableCell><TableCell>Links</TableCell><TableCell>Valid From</TableCell><TableCell>Valid To</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={9} align="center"><CircularProgress /></TableCell></TableRow>) : banners.length === 0 ? (<TableRow><TableCell colSpan={9} align="center">No Banners Found</TableCell></TableRow>) : (
              banners.map((banner) => (
                <StyledTableRow key={banner.banner_id}><TableCell>{banner.client_id || 'N/A'}</TableCell><TableCell>{banner.channel || 'N/A'}</TableCell><TableCell><Chip label={banner.status || 'unknown'} color={banner.status === 'active' ? 'success' : 'default'} size="small" /></TableCell><TableCell>{banner.segment_tag || 'N/A'}</TableCell><TableCell align="center">{banner.priority || 'N/A'}</TableCell><TableCell><Box sx={{ display: 'flex', gap: 1 }}><Tooltip title="Click Action URL"><Link href={banner.click_action} target="_blank" rel="noopener noreferrer" sx={{ color: banner.click_action ? 'primary.main' : 'text.disabled', pointerEvents: banner.click_action ? 'auto' : 'none' }}><LinkIcon /></Link></Tooltip><Tooltip title="Image URL"><Link href={banner.image_url} target="_blank" rel="noopener noreferrer" sx={{ color: banner.image_url ? 'primary.main' : 'text.disabled', pointerEvents: banner.image_url ? 'auto' : 'none' }}><PhotoCameraIcon /></Link></Tooltip></Box></TableCell><TableCell>{formatDate(banner.valid_from)}</TableCell><TableCell>{formatDate(banner.valid_to)}</TableCell><TableCell align="right"><IconButton onClick={() => handleEditClick(banner)} color="primary" size="small"><EditIcon /></IconButton><IconButton onClick={() => handleDeleteClick(banner)} color="error" size="small"><DeleteIcon /></IconButton></TableCell></StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* --- FIXED: Replaced TablePagination with custom chunk-based pagination --- */}
      {!isSearchMode && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <Button onClick={() => setChunk(prev => prev - 1)} disabled={chunk === 1 || loading} startIcon={<NavigateBeforeIcon />}>Previous</Button>
          <Typography sx={{ mx: 2 }}>Page {chunk}</Typography>
          <Button onClick={() => setChunk(prev => prev + 1)} disabled={!hasNextPage || loading} endIcon={<NavigateNextIcon />}>Next</Button>
        </Box>
      )}

      {/* --- FIXED: Enhanced Edit Dialog with all editable fields --- */}
      <Dialog open={!!editingBanner} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Banner: {editingBanner?.banner_id}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}><TextField disabled fullWidth label="Client ID" value={editingBanner?.client_id || ''} size="small"/></Grid>
            <Grid item xs={12} sm={6}><TextField disabled fullWidth label="PAN ID" value={editingBanner?.pan_id || ''} size="small"/></Grid>
            <Grid item xs={12} sm={6}><FormControl fullWidth size="small"><InputLabel>Channel</InputLabel><Select label="Channel" value={editingBanner?.channel || ''} onChange={(e) => setEditingBanner(p => ({...p, channel: e.target.value}))}><MenuItem value="netbanking">Net Banking</MenuItem><MenuItem value="mobile">Mobile App</MenuItem><MenuItem value="website">Public Website</MenuItem></Select></FormControl></Grid>
            <Grid item xs={12} sm={6}><FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select label="Status" value={editingBanner?.status || 'inactive'} onChange={(e) => setEditingBanner(p => ({...p, status: e.target.value}))}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem><MenuItem value="draft">Draft</MenuItem></Select></FormControl></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Priority" type="number" value={editingBanner?.priority || ''} onChange={(e) => setEditingBanner(p => ({...p, priority: e.target.value}))} size="small"/></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Segment Tag" value={editingBanner?.segment_tag || ''} onChange={(e) => setEditingBanner(p => ({...p, segment_tag: e.target.value}))} size="small"/></Grid>
            <Grid item xs={12}><TextField fullWidth label="Click Action URL" value={editingBanner?.click_action || ''} onChange={(e) => setEditingBanner(p => ({...p, click_action: e.target.value}))} size="small"/></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Valid From" type="datetime-local" InputLabelProps={{ shrink: true }} value={formatDateForInput(editingBanner?.valid_from)} onChange={(e) => setEditingBanner(p => ({...p, valid_from: e.target.value}))} size="small" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Valid To" type="datetime-local" InputLabelProps={{ shrink: true }} value={formatDateForInput(editingBanner?.valid_to)} onChange={(e) => setEditingBanner(p => ({...p, valid_to: e.target.value}))} size="small" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={handleEditClose}>Cancel</Button><Button onClick={handleEditSave} variant="contained">Save Changes</Button></DialogActions>
      </Dialog>
      
      <Dialog open={!!deleteCandidate} onClose={handleDeleteClose}><DialogTitle>Confirm Deletion</DialogTitle><DialogContent><DialogContentText>Are you sure you want to delete banner for client "{deleteCandidate?.client_id}"?</DialogContentText></DialogContent><DialogActions><Button onClick={handleDeleteClose}>Cancel</Button><Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button></DialogActions></Dialog>
    </Paper>
  );
};

export default BannerList;