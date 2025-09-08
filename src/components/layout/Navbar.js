import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  AdminPanelSettings,
  CarRepair,
  Dashboard,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/adminSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated, admin } = useSelector((state) => state.admin);
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleMenuClose();
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar>
        {/* Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mr: 4,
            }}
            onClick={() => navigate('/')}
          >
            <CarRepair sx={{ mr: 1, fontSize: 28 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontSize: '1.25rem',
              }}
            >
              Smart Car Wash Pro
            </Typography>
            <Chip
              label="2.0"
              size="small"
              sx={{
                ml: 1,
                backgroundColor: '#000',
                color: '#fff',
                fontSize: '0.75rem',
                height: 20,
              }}
            />
          </Box>
        </motion.div>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              fontWeight: location.pathname === '/' ? 600 : 400,
              borderBottom: location.pathname === '/' ? '2px solid' : 'none',
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/order')}
            sx={{
              mr: 2,
              fontWeight: location.pathname === '/order' ? 600 : 400,
              borderBottom: location.pathname === '/order' ? '2px solid' : 'none',
            }}
          >
            Book Service
          </Button>
          {isAuthenticated && (
            <Button
              color="inherit"
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                mr: 2,
                fontWeight: isAdminRoute ? 600 : 400,
                borderBottom: isAdminRoute ? '2px solid' : 'none',
              }}
            >
              <AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} />
              Admin
            </Button>
          )}
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Chip
                icon={<AdminPanelSettings />}
                label={`Welcome, ${admin?.name || 'Admin'}`}
                color="primary"
                sx={{ mr: 2 }}
              />
              <IconButton
                size="large"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#000' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { navigate('/admin/dashboard'); handleMenuClose(); }}>
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/admin/login')}
              startIcon={<AdminPanelSettings />}
              sx={{
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 2,
                px: 2,
              }}
            >
              Admin Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
