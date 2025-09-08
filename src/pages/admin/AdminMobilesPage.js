import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import {
  DirectionsCar,
  Edit,
  LocationOn,
  Schedule,
  CheckCircle,
  Cancel,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { fetchMobileUnits, updateMobileUnit } from '../../store/slices/adminSlice';
import { parseUTCDate } from '../../utils/dateUtils';
const AdminMobilesPage = () => {
  const dispatch = useDispatch();
  const { mobileUnits, loading, error } = useSelector((state) => state.admin);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState(null);
  const [formData, setFormData] = useState({
    is_available: true,
    location_lat: '',
    location_lng: '',
    available_from: '',
  });

  useEffect(() => {
    dispatch(fetchMobileUnits());
  }, [dispatch]);

  const handleEditMobile = (mobile) => {
    setSelectedMobile(mobile);
    setFormData({
      is_available: mobile.is_available,
      location_lat: mobile.location_lat.toString(),
      location_lng: mobile.location_lng.toString(),
      available_from: mobile.available_from ? parseUTCDate(mobile.available_from).toISOString().slice(0, 16) : '',
    });
    setEditDialogOpen(true);
  };

  const handleSaveMobile = () => {
    if (selectedMobile) {
      const updates = {
        is_available: formData.is_available,
        location_lat: parseFloat(formData.location_lat),
        location_lng: parseFloat(formData.location_lng),
        available_from: formData.available_from ? parseUTCDate(formData.available_from).toISOString() : parseUTCDate().toISOString(),
      };

      dispatch(updateMobileUnit({ mobileId: selectedMobile.id, updates }))
      .unwrap() 
      .then(() => {
        dispatch(fetchMobileUnits());
      })
      .catch((err) => {
        console.error("Failed to update mobile unit:", err);
      });


      setEditDialogOpen(false);
      setSelectedMobile(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (isAvailable) => {
    return isAvailable ? 'success' : 'warning';
  };

  const getStatusText = (isAvailable) => {
    return isAvailable ? 'Available' : 'Busy';
  };

  if (loading && !mobileUnits) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading mobile units...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#000',
              mb: 1,
            }}
          >
            Mobile Units Management
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Manage your fleet of mobile car wash units
          </Typography>
        </Box>

        {/* Mobile Units Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {mobileUnits && mobileUnits.map((mobile, index) => (
            <Grid item xs={12} md={6} lg={4} key={mobile.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {mobile.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleEditMobile(mobile)}
                      >
                        <Edit />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={mobile.is_available ? <CheckCircle /> : <Cancel />}
                        label={getStatusText(mobile.is_available)}
                        color={getStatusColor(mobile.is_available)}
                        sx={{ mb: 2 }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Lat: {mobile.location_lat.toFixed(4)}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Lng: {mobile.location_lng.toFixed(4)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Available From
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {parseUTCDate(mobile.available_from).toLocaleString('he-IL')}
                      </Typography>
                    </Box>

                    {mobile.current_order_id && (
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          Current Order
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#ff9800' }}>
                          Order #{mobile.current_order_id}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Mobile Units Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {error && (
              <Alert severity="error" sx={{ m: 3 }}>
                {error.error || 'Failed to load mobile units.'}
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Unit Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Available From</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Current Order</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mobileUnits && mobileUnits.length > 0 ? (
                    mobileUnits.map((mobile) => (
                      <TableRow key={mobile.id} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {mobile.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={mobile.is_available ? <CheckCircle /> : <Cancel />}
                            label={getStatusText(mobile.is_available)}
                            color={getStatusColor(mobile.is_available)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {mobile.location_lat.toFixed(4)}, {mobile.location_lng.toFixed(4)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {parseUTCDate(mobile.available_from).toLocaleString('he-IL')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {mobile.current_order_id ? `#${mobile.current_order_id}` : 'None'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditMobile(mobile)}
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                        <DirectionsCar sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          No mobile units found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Edit Mobile Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Mobile Unit</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {selectedMobile?.name}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_available}
                    onChange={(e) => handleInputChange('is_available', e.target.checked)}
                  />
                }
                label="Available"
                sx={{ mb: 3 }}
              />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="number"
                    value={formData.location_lat}
                    onChange={(e) => handleInputChange('location_lat', e.target.value)}
                    inputProps={{ step: '0.0001' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="number"
                    value={formData.location_lng}
                    onChange={(e) => handleInputChange('location_lng', e.target.value)}
                    inputProps={{ step: '0.0001' }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Available From"
                type="datetime-local"
                value={formData.available_from}
                onChange={(e) => handleInputChange('available_from', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveMobile}
              variant="contained"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default AdminMobilesPage;
