import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Toolbar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Snackbar from './components/common/Snackbar';

// Pages
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackingPage from './pages/TrackingPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import AdminMobilesPage from './pages/admin/AdminMobilesPage';

// Redux actions
import { initializeAuth } from './store/slices/adminSlice';
import { setGlobalLoading } from './store/slices/uiSlice';

// Socket service
import { initializeSocket } from './services/socket';

function App() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.admin);

  useEffect(() => {
    // Initialize authentication
    dispatch(initializeAuth());
    
    // Initialize socket connection
    initializeSocket(dispatch);
    
    // Set loading to false after initialization
    dispatch(setGlobalLoading(false));
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Toolbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft: sidebarOpen ? '240px' : '0px',
            transition: 'margin-left 0.3s ease',
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#fafafa',
          }}
        >
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order/confirm" element={<OrderConfirmationPage />} />
              <Route path="/track/:orderId" element={<TrackingPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              {isAuthenticated && (
                <>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/logs" element={<AdminLogsPage />} />
                  <Route path="/admin/mobiles" element={<AdminMobilesPage />} />
                </>
              )}
              
              {/* Redirect to home for unknown routes */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </AnimatePresence>
        </Box>
      </Box>
      
      {/* Footer */}
      <Footer />
      
      {/* Global Snackbar */}
      <Snackbar />
    </Box>
  );
}

export default App;
