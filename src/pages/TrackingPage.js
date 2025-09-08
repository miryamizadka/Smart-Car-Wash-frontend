import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  DirectionsCar,
  Schedule,
  Payment,
  CheckCircle,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  QrCode,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { fetchOrderTracking, updateOrderStatusLocal, clearTrackingData } from '../store/slices/orderSlice';
import { joinOrderRoom, leaveOrderRoom } from '../services/socket';
import { parseUTCDate } from '../utils/dateUtils';
const TrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { trackingData, loading, error } = useSelector((state) => state.order);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(clearTrackingData());
      dispatch(fetchOrderTracking(orderId));
      joinOrderRoom(orderId);
    }

    return () => {
      if (orderId) {
        leaveOrderRoom(orderId);
      }
    };
  }, [dispatch, orderId]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchOrderTracking(orderId)).finally(() => {
      setRefreshing(false);
    });
  };

  const getStatusSteps = () => {
    const steps = [
      { label: 'Order Placed', status: 'pending' },
      { label: 'Mobile Assigned', status: 'assigned' },
      { label: 'On the Way', status: 'on_way' },
      { label: 'Washing', status: 'washing' },
      { label: 'Completed', status: 'completed' },
    ];

    const currentStatusIndex = steps.findIndex(step => step.status === trackingData?.order?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      active: index === currentStatusIndex,
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      assigned: 'info',
      on_way: 'primary',
      washing: 'secondary',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <AccessTime />,
      assigned: <DirectionsCar />,
      on_way: <DirectionsCar />,
      washing: <Schedule />,
      completed: <CheckCircle />,
      cancelled: <CheckCircle />,
    };
    return icons[status] || <AccessTime />;
  };

  if (loading && !trackingData) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.error || 'Failed to load order details.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!trackingData) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Order Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          The order you're looking for doesn't exist or has been removed.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const { order } = trackingData;
  const statusSteps = getStatusSteps();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#000',
              mb: 2,
            }}
          >
            Order Tracking
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666',
              mb: 2,
            }}
          >
            Order #{order.id}
          </Typography>
          <Chip
            label={order.status.toUpperCase()}
            color={getStatusColor(order.status)}
            icon={getStatusIcon(order.status)}
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              px: 2,
              py: 1,
            }}
          />
        </Box>

        {/* Refresh Button */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={20} /> : <Refresh />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              borderColor: '#000',
              color: '#000',
              '&:hover': {
                backgroundColor: '#000',
                color: '#fff',
              },
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </Button>
        </Box>

        {/* Status Progress */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Order Progress
            </Typography>
            
            <Stepper orientation="vertical" activeStep={statusSteps.findIndex(step => step.active)}>
              {statusSteps.map((step, index) => (
                <Step key={step.label} completed={step.completed}>
                  <StepLabel
                    icon={getStatusIcon(step.status)}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: step.active ? 600 : 400,
                      },
                    }}
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      {step.status === 'pending' && 'Your order has been received and is being processed.'}
                      {step.status === 'assigned' && 'A mobile unit has been assigned to your order.'}
                      {step.status === 'on_way' && 'The mobile unit is on the way to your location.'}
                      {step.status === 'washing' && 'Your car is currently being washed.'}
                      {step.status === 'completed' && 'Your car wash service has been completed successfully.'}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Grid container spacing={4}>
          {/* Vehicle & Service Info */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Vehicle & Service
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Vehicle
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {order.vehicleNumber}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Service Type
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {order.serviceType}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Price
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>
                    ₪{order.price}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Duration
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {order.duration} minutes
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Mobile Unit Info */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Mobile Unit
                </Typography>
                
                {order.mobile ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Assigned Unit
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {order.mobile.name}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Lat: {order.mobile.location.lat.toFixed(4)}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Lng: {order.mobile.location.lng.toFixed(4)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Status
                      </Typography>
                      <Chip
                        label={order.status === 'completed' || order.status === 'cancelled' ? 'Available' : 'Busy'}
                        color={order.status === 'completed' || order.status === 'cancelled' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </>
                ) : (
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    No mobile unit assigned yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Activity Log */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Activity Log
                </Typography>
                
                {trackingData.logs && trackingData.logs.length > 0 ? (
                  <List>
                    {trackingData.logs.map((log, index) => (
                      <React.Fragment key={log.id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {getStatusIcon(log.status)}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {log.status.replace('_', ' ').toUpperCase()}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                  {log.notes || 'Status updated'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#999' }}>
                                  {parseUTCDate(log.timestamp).toLocaleString('he-IL')}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < trackingData.logs.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', py: 2 }}>
                    No activity logs available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* QR Code Info */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
              <QrCode sx={{ fontSize: 48, color: '#000', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Track with QR Code
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                Scan the QR code in your invoice to access this tracking page
              </Typography>
              <Typography variant="body2" sx={{ color: '#000', fontWeight: 600 }}>
                Order #{order.id} - Track at localhost:3001
              </Typography>
            </Paper>
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

export default TrackingPage;
