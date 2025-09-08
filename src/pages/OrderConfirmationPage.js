import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  Download,
  TrackChanges,
  DirectionsCar,
  Schedule,
  Payment,
  QrCode,
  Visibility,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { clearOrder } from '../store/slices/orderSlice';
import { parseUTCDate } from '../utils/dateUtils';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!currentOrder) {
      navigate('/order');
    }
  }, [currentOrder, navigate]);

  const handleDownloadPDF = () => {
    if (currentOrder?.pdfPath) {
      window.open(`http://localhost:3000${currentOrder.pdfPath}`, '_blank');
    }
  };

  const handleTrackOrder = () => {
    if (currentOrder?.orderId) {
      const trackingUrl = `/track/${currentOrder.orderId}`;
      window.open(trackingUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Processing your order...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.error || 'An error occurred while processing your order.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/order')}>
          Try Again
        </Button>
      </Container>
    );
  }

  if (!currentOrder) {
    return null;
  }

  const statusColor = {
    pending: 'warning',
    assigned: 'info',
    on_way: 'primary',
    washing: 'secondary',
    completed: 'success',
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle
              sx={{
                fontSize: 80,
                color: '#4caf50',
                mb: 2,
              }}
            />
          </motion.div>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#000',
              mb: 2,
            }}
          >
            Order Confirmed!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666',
              mb: 3,
            }}
          >
            Your car wash service has been successfully booked
          </Typography>
          <Chip
            label={`Order #${currentOrder.orderId}`}
            color="primary"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              px: 2,
              py: 1,
            }}
          />
        </Box>

        {/* Order Details */}
        <Grid container spacing={4}>
          {/* Order Summary */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Order Summary
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Vehicle
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentOrder.vehicleNumber} • {currentOrder.vehicleType}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Service
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentOrder.serviceType}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Dirt Level
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentOrder.dirtLevel}/5
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Status
                  </Typography>
                  <Chip
                    label={currentOrder.status.toUpperCase()}
                    color={statusColor[currentOrder.status] || 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Pricing & Schedule */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Pricing & Schedule
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#000' }}>
                    ₪{currentOrder.price}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Total Amount
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentOrder.duration} minutes
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Estimated Duration
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {parseUTCDate(currentOrder.requestedDateTime).toLocaleString('he-IL')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Requested Time
                  </Typography>
                </Box>

                {currentOrder.mobile && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {currentOrder.mobile.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      Assigned Mobile Unit
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Mobile Unit Details */}
          {currentOrder.mobile && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Mobile Unit Assignment
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DirectionsCar sx={{ mr: 1, color: '#666' }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {currentOrder.mobile.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Assigned Unit
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ mr: 1, color: '#666' }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {parseUTCDate(currentOrder.mobile.estimatedArrival).toLocaleString('he-IL')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Estimated Arrival
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Payment sx={{ mr: 1, color: '#666' }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {currentOrder.mobile.distance} km
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Distance from Location
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Actions */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Next Steps
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<Visibility />}
                      onClick={handleDownloadPDF}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      View Invoice
                    </Button>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1, textAlign: 'center' }}>
                      Get your PDF invoice with QR code
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      startIcon={<TrackChanges />}
                      onClick={handleTrackOrder}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderColor: '#000',
                        color: '#000',
                        '&:hover': {
                          backgroundColor: '#000',
                          color: '#fff',
                        },
                      }}
                    >
                      Track Order
                    </Button>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1, textAlign: 'center' }}>
                      Monitor your order in real-time
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* QR Code Info */}
                <Paper sx={{ p: 3, backgroundColor: '#fff', textAlign: 'center' }}>
                  <QrCode sx={{ fontSize: 48, color: '#000', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Track with QR Code
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    Scan the QR code in your invoice to track your order
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000', fontWeight: 600 }}>
                    Order #{currentOrder.orderId} - Track at localhost:3001
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Back to Home */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            ← Back to Home
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default OrderConfirmationPage;
