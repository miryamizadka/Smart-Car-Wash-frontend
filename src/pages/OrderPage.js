import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Radio,         
  RadioGroup,
} from '@mui/material';
import {
  DirectionsCar,
  CleaningServices,
  Schedule,
  LocationOn,
  PhotoCamera,
  Calculate,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

import { createOrder, clearOrder } from '../store/slices/orderSlice';
import { showSnackbar } from '../store/slices/uiSlice';
import { uploadAPI, orderAPI  } from '../services/api';

const steps = [
  'Vehicle Details',
  'Service Selection',
  'Location & Time',
  'Review & Confirm',
];

const vehicleTypes = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'truck', label: 'Truck' },
  { value: 'van', label: 'Van' },
  { value: 'motorcycle', label: 'Motorcycle' },
];

const baseServiceTypes = [
    { value: 'exterior', label: 'Exterior Wash' },
    { value: 'interior', label: 'Interior Clean' },
    { value: 'exterior+interior', label: 'Exterior + Interior' },
  ];
  
  const additionalServiceTypes = [
    { value: 'polish', label: 'Polish Service', time: 15 },
    { value: 'wax', label: 'Wax Protection', time: 10 },
  ];

const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, currentOrder } = useSelector((state) => state.order);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    vehicle_number: '',
    vehicle_type: '',
    service_type: '', 
    additional_services: [],
    requested_datetime: '',
    location_lat: 32.0853,
    location_lng: 34.7818,
    location_address: '',
    vehicle_image: '',
    dirt_level: 3,
    customer_name: '',
    customer_phone: '',
    customer_email: '',
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearOrder());
  
    const now = new Date();
    now.setHours(now.getHours()+1);
    
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    
    const localDatetimeString = localDate.toISOString().slice(0, 16);
  
    setFormData(prev => ({
      ...prev,
      requested_datetime: localDatetimeString,
    }));
  }, [dispatch]);

  useEffect(() => {
    if (success && currentOrder) {
      navigate('/order/confirm');
    }
  }, [success, currentOrder, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleImageUpload = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('vehicleImage', file);

      try {
        const response = await uploadAPI.uploadVehicleImage(formData);
        setUploadedImage(response.data);
        handleInputChange('vehicle_image', response.data.imageUrl);
        dispatch(showSnackbar({
          message: 'Image uploaded successfully',
          severity: 'success',
        }));
      } catch (error) {
        dispatch(showSnackbar({
          message: 'Failed to upload image',
          severity: 'error',
        }));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const validateStepOne = () => {
    const newErrors = {};
    // Vehicle Number Validation
    if (!formData.vehicle_number) {
        newErrors.vehicle_number = 'Vehicle number is required';
    } else if (formData.vehicle_number.length < 6) {
        newErrors.vehicle_number = 'Must be at least 6 characters';
    } else if ((formData.vehicle_number.match(/\d/g) || []).length < 3) {
        newErrors.vehicle_number = 'Must contain at least 3 digits';
    }

    // Vehicle Type Validation (already handled by disabled button, but good to have)
    if (!formData.vehicle_type) {
        newErrors.vehicle_type = 'Vehicle type is required';
    }
    
    // Email Validation
    if (!formData.customer_email) {
        newErrors.customer_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
        newErrors.customer_email = 'Email address is invalid';
    }

    // Phone Validation (optional field, but if filled, must be valid)
    if (formData.customer_phone && !/^\+?[0-9]{9,12}$/.test(formData.customer_phone.replace(/[\s-]/g, ''))) {
        newErrors.customer_phone = 'Invalid phone number (9-12 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
};

const validateStepTwo = () => {
    const newErrors = {};
    if (!formData.service_type) {
        dispatch(showSnackbar({
            message: 'Please select a base service (Exterior, Interior, etc.)',
            severity: 'error',
        }));
        return false;
    }
    setErrors({}); 
    return true;
};

const validateStepThree = () => {
    const newErrors = {};
    if (!formData.location_address.trim()) {
        newErrors.location_address = 'Address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};



  const calculateDuration = () => {
    let duration = 30; // Base time
    duration += formData.dirt_level * 10; // Dirt level time
    
    // Add service type time (as per requirements)
    formData.additional_services.forEach(service => {
      const serviceData = additionalServiceTypes.find(s => s.value === service);
      if (serviceData) {
        duration += serviceData.time;
      }
    });
    
    return duration;
  };


const handleRecalculate = async () => {
    setIsCalculating(true);
    setPriceEstimate(null); 
    try {
        const finalServiceType = [formData.service_type, ...formData.additional_services].filter(Boolean).join('+');
        const estimateData = { ...formData, service_type: finalServiceType };
        const response = await orderAPI.getOrderPriceEstimate(estimateData);
        setPriceEstimate(response.data);
    } catch (err) {
        console.error("Failed to get price estimate", err);
        dispatch(showSnackbar({ 
            message: err.response?.data?.error || 'Could not recalculate price.', 
            severity: 'error' 
        }));
    } finally {
        setIsCalculating(false);
    }
};

const handleNext = async () => {
    let isValid = true;
    if (activeStep === 0) {
        isValid = validateStepOne();
    }
    if (activeStep === 1) {
        isValid = validateStepTwo();
    }
    if (activeStep === 2) {
        isValid = validateStepThree();
    }

    if (!isValid) return; 

    if (activeStep === 2) {
        await handleRecalculate();
    }
    setActiveStep(prev => prev + 1);
};


  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (!formData.service_type) {
        dispatch(showSnackbar({ message: 'Please select a base service', severity: 'error' }));
        return;
      }
    
      const finalServiceType = [formData.service_type, ...formData.additional_services].filter(Boolean).join('+');
    
      const orderDataToSend = {
        ...formData,
        requested_datetime: new Date(formData.requested_datetime).toISOString(), // המרה ל-UTC
        service_type: finalServiceType,
      };
      delete orderDataToSend.additional_services; 
    
      dispatch(createOrder(orderDataToSend));
  };

  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                value={formData.vehicle_number}
                onChange={(e) => handleInputChange('vehicle_number', e.target.value)}
                required
                placeholder="ABC-123"
                error={!!errors.vehicle_number}
                helperText={errors.vehicle_number}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={formData.vehicle_type}
                  onChange={(e) => handleInputChange('vehicle_type', e.target.value)}
                  label="Vehicle Type"
                >
                  {vehicleTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                placeholder="John Doe"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                placeholder="+972-50-123-4567"
                error={!!errors.customer_phone}
                helperText={errors.customer_phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
                placeholder="john@example.com"
                error={!!errors.customer_email}
                helperText={errors.customer_email}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Select Services
            </Typography>
            <FormControl component="fieldset" fullWidth>
      <RadioGroup
        value={formData.service_type}
        onChange={(e) => handleInputChange('service_type', e.target.value)}
      >
        {baseServiceTypes.map((service) => (
          <FormControlLabel 
            key={service.value} 
            value={service.value} 
            control={<Radio />} 
            label={service.label} 
          />
        ))}
      </RadioGroup>
    </FormControl>

    <Divider sx={{ my: 3 }} />

    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Select Additional Services
    </Typography>
    <FormGroup>
      {additionalServiceTypes.map((service) => (
        <FormControlLabel
          key={service.value}
          control={
            <Checkbox
              checked={formData.additional_services.includes(service.value)}
              onChange={(e) => {
                const newServices = e.target.checked
                  ? [...formData.additional_services, service.value]
                  : formData.additional_services.filter(s => s !== service.value);
                handleInputChange('additional_services', newServices);
              }}
            />
          }
          label={`${service.label} (+${service.time} min)`}
        />
      ))}
    </FormGroup>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Dirt Level
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={formData.dirt_level}
                onChange={(e, value) => handleInputChange('dirt_level', value)}
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1, label: 'Light' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: 'Heavy' },
                ]}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                Level {formData.dirt_level} - {formData.dirt_level === 1 ? 'Light' : 
                formData.dirt_level === 5 ? 'Heavy' : 'Moderate'} dirt
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Requested Date & Time"
                type="datetime-local"
                value={formData.requested_datetime}
                onChange={(e) => handleInputChange('requested_datetime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                value={formData.location_address}
                onChange={(e) => handleInputChange('location_address', e.target.value)}
                placeholder="Enter your address"
                error={!!errors.location_address}
                helperText={errors.location_address}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={formData.location_lat}
                onChange={(e) => handleInputChange('location_lat', e.target.value)}
                required
            />
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={formData.location_lng}
                onChange={(e) => handleInputChange('location_lng', e.target.value)}
                required
            />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Vehicle Photo (Optional)
              </Typography>
              <Paper
                {...getRootProps()}
                sx={{
                  p: 4,
                  border: '2px dashed #ccc',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? '#f5f5f5' : '#fff',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <input {...getInputProps()} />
                <PhotoCamera sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {isDragActive
                    ? 'Drop the image here...'
                    : 'Drag & drop an image here, or click to select'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  PNG, JPG, GIF up to 5MB
                </Typography>
                {uploadedImage && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label="Image uploaded"
                      color="success"
                      icon={<CheckCircle />}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Review Your Order
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Vehicle Details
                  </Typography>
                  <Typography variant="body1">
                    <strong>Number:</strong> {formData.vehicle_number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Type:</strong> {vehicleTypes.find(t => t.value === formData.vehicle_type)?.label}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Dirt Level:</strong> {formData.dirt_level}/5
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Services
                  </Typography>
                  {formData.service_type && (
                    <Chip 
                        label={baseServiceTypes.find(s => s.value === formData.service_type)?.label}
                        sx={{ mr: 1, mb: 1 }} 
                        color="primary"
                    />
                    )}

                    {formData.additional_services.map(serviceValue => (
                        <Chip
                            key={serviceValue}
                            label={additionalServiceTypes.find(s => s.value === serviceValue)?.label}
                            sx={{ mr: 1, mb: 1 }}
                        />
                    ))}
                 </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Schedule
                  </Typography>
                  <Typography variant="body1">
                        <strong>Date & Time:</strong> {new Date(formData.requested_datetime).toLocaleString('he-IL', {
                        day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}                  
                  </Typography>
                  <Typography variant="body1">
                    <strong>Location:</strong> {formData.location_address}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Contact
                  </Typography>
                  <Typography variant="body1">
                    <strong>Name:</strong> {formData.customer_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {formData.customer_phone}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {formData.customer_email}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {priceEstimate && (
              <Card sx={{ p: 3, mt: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Price Estimate
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>
                      ₪{priceEstimate.price}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      Estimated Duration: {priceEstimate.duration} minutes
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleRecalculate}
                    disabled={isCalculating}
                    startIcon={isCalculating ? <CircularProgress size={20} /> : <Calculate />}
                  >
                    {isCalculating ? 'Calculating...' : 'Recalculate'}
                  </Button>
                </Box>
              </Card>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 700,
            color: '#000',
          }}
        >
          Book Your Car Wash Service
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card sx={{ p: 4 }}>
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error.error || 'An error occurred. Please try again.'}
              </Alert>
            )}

            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ minWidth: 100 }}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !priceEstimate}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Confirm Order'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && (!formData.vehicle_number || !formData.vehicle_type || !formData.customer_email)) ||
                    (activeStep === 1 && !formData.service_type) || 
                    (activeStep === 2 && !formData.location_address)
                  }
                  sx={{ minWidth: 100 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default OrderPage;
