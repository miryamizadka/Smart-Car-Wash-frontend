import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Lock from '@mui/icons-material/Lock';
import Email from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    InputAdornment,
    IconButton,
  } from '@mui/material';
import { motion } from 'framer-motion';

import { adminLogin, clearError } from '../../store/slices/adminSlice';
import { showSnackbar } from '../../store/slices/uiSlice';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      dispatch(showSnackbar({
        message: 'Please fill in all fields',
        severity: 'error',
      }));
      return;
    }

    dispatch(adminLogin(formData));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AdminPanelSettings
                sx={{
                  fontSize: 80,
                  color: '#000',
                  mb: 2,
                }}
              />
            </motion.div>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#000',
                mb: 1,
              }}
            >
              Admin Login
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
              }}
            >
              Smart Car Wash Pro 2.0
            </Typography>
          </Box>

          {/* Login Form */}
          <Card sx={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error.error || 'Login failed. Please check your credentials.'}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  sx={{ mb: 4 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <Divider sx={{ my: 3 }} />

              {/* Demo Credentials */}
              <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#000' }}>
                  Demo Credentials
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  <strong>Email:</strong> admin@carwash.com
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  <strong>Password:</strong> password
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setFormData({
                      email: 'admin@carwash.com',
                      password: 'password',
                    });
                  }}
                  sx={{
                    borderColor: '#000',
                    color: '#000',
                    '&:hover': {
                      backgroundColor: '#000',
                      color: '#fff',
                    },
                  }}
                >
                  Use Demo Credentials
                </Button>
              </Paper>
            </CardContent>
          </Card>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Smart Car Wash Pro 2.0 - Admin Panel
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate('/')}
              sx={{
                color: '#666',
                textTransform: 'none',
              }}
            >
              ← Back to Home
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AdminLoginPage;
