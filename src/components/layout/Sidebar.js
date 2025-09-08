import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import {
  Home,
  CarRepair,
  TrackChanges,
  AdminPanelSettings,
  Dashboard,
  Assignment,
  History,
  DirectionsCar,
  Login,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.admin);

  const drawerWidth = 240;

  const publicMenuItems = [
    {
      text: 'Home',
      icon: <Home />,
      path: '/',
    },
    {
      text: 'Book Service',
      icon: <CarRepair />,
      path: '/order',
    },
    {
      text: 'Track Order',
      icon: <TrackChanges />,
      path: '/track',
    },
  ];

  const adminMenuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin/dashboard',
    },
    {
      text: 'Orders',
      icon: <Assignment />,
      path: '/admin/orders',
    },
    {
      text: 'Activity Logs',
      icon: <History />,
      path: '/admin/logs',
    },
    {
      text: 'Mobile Units',
      icon: <DirectionsCar />,
      path: '/admin/mobiles',
    },
  ];

  const isActive = (path) => {
    if (path === '/track') {
      return location.pathname.startsWith('/track');
    }
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64, // Height of AppBar
          height: 'calc(100vh - 64px)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#000',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CarRepair sx={{ mr: 1, color: '#000' }} />
            Navigation
          </Typography>
        </motion.div>
      </Box>

      <Divider />

      {/* Public Menu Items */}
      <List sx={{ px: 1, py: 2 }}>
        {publicMenuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive(item.path) ? '#000' : 'transparent',
                  color: isActive(item.path) ? '#fff' : '#000',
                  '&:hover': {
                    backgroundColor: isActive(item.path) ? '#333' : '#f5f5f5',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? '#fff' : '#666',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Admin Section */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#666',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AdminPanelSettings sx={{ mr: 1, fontSize: 16 }} />
          Administration
        </Typography>
      </Box>

      <List sx={{ px: 1, py: 1 }}>
        {isAuthenticated ? (
          adminMenuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (index + 3) * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive(item.path) ? '#000' : 'transparent',
                    color: isActive(item.path) ? '#fff' : '#000',
                    '&:hover': {
                      backgroundColor: isActive(item.path) ? '#333' : '#f5f5f5',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? '#fff' : '#666',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/admin/login')}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive('/admin/login') ? '#000' : 'transparent',
                  color: isActive('/admin/login') ? '#fff' : '#000',
                  '&:hover': {
                    backgroundColor: isActive('/admin/login') ? '#333' : '#f5f5f5',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive('/admin/login') ? '#fff' : '#666',
                    minWidth: 40,
                  }}
                >
                  <Login />
                </ListItemIcon>
                <ListItemText
                  primary="Admin Login"
                  primaryTypographyProps={{
                    fontWeight: isActive('/admin/login') ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        )}
      </List>

      {/* Footer Info */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Chip
            label="Smart Car Wash Pro 2.0"
            size="small"
            sx={{
              backgroundColor: '#f0f0f0',
              color: '#666',
              fontSize: '0.7rem',
              width: '100%',
            }}
          />
        </motion.div>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
