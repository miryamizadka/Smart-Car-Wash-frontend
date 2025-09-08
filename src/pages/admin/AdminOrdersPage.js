import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Visibility,
  CheckCircle,
  Pending,
  DirectionsRun,
  LocalCarWash,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { fetchOrders, updateOrderStatusAdmin, fetchMobileUnits  } from '../../store/slices/adminSlice';
import { parseUTCDate } from '../../utils/dateUtils';
import { showSnackbar } from '../../store/slices/uiSlice';

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, mobileUnits } = useSelector((state) => state.admin);

  const [statusFilter, setStatusFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('')
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');


  useEffect(() => {
    dispatch(fetchMobileUnits());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOrders({ status: statusFilter, mobileId: mobileFilter  }));
  }, [dispatch, statusFilter, mobileFilter]);

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedOrder(null);
  };

  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setAnchorEl(null); 
    setSelectedOrder(null); 
    setNewStatus(''); 
    setNotes(''); 
  };
  

  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      dispatch(updateOrderStatusAdmin({
        orderId: selectedOrder.id,
        status: newStatus,
        notes: notes,
      }))
      .unwrap() 
      .then(() => {
        dispatch(fetchOrders({ status: statusFilter, mobileId: mobileFilter }));
        dispatch(showSnackbar({ message: 'Order status updated successfully!', severity: 'success' }));
      })
      .catch((err) => {
        console.error("Failed to update order status:", err);
        dispatch(showSnackbar({ message: 'Failed to update status. Please try again.', severity: 'error' }));
      });
      closeUpdateDialog();

    }
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
      pending: <Pending />,
      assigned: <CheckCircle />,
      on_way: <DirectionsRun />,
      washing: <LocalCarWash />,
      completed: <CheckCircle />,
      cancelled: <Cancel />,
    };
    return icons[status] || <Pending />;
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'on_way', label: 'On Way' },
    { value: 'washing', label: 'Washing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading && !orders) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading orders...
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
            Orders Management
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Manage and track all car wash orders
          </Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="">All Orders</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Mobile Unit</InputLabel>
              <Select
                value={mobileFilter}
                onChange={(e) => setMobileFilter(e.target.value)}
                label="Filter by Mobile Unit"
                disabled={!mobileUnits || mobileUnits.length === 0} // מנע לחיצה לפני שהניידות נטענו
              >
                <MenuItem value="">All Units</MenuItem>
                {mobileUnits && mobileUnits.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
              <Button
                variant="outlined"
                onClick={() => dispatch(fetchOrders({ status: statusFilter, mobileId: mobileFilter }))}
                sx={{
                  borderColor: '#000',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#000',
                    color: '#fff',
                  },
                }}
              >
                Refresh
              </Button>
              <Button
              onClick={() => {
                setStatusFilter('');
                setMobileFilter('');
              }}
            >
              Clear Filters
            </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {error && (
              <Alert severity="error" sx={{ m: 3 }}>
                {error.error || 'Failed to load orders.'}
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Vehicle</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Mobile Unit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            #{order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {order.vehicle_number}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {order.vehicle_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {order.service_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            ₪{order.price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(order.status)}
                            label={order.status.toUpperCase()}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.mobile_name || 'Not assigned'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                          {parseUTCDate(order.created_at).toLocaleDateString('he-IL')}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                          {parseUTCDate(order.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, order)}
                            size="small"
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          No orders found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              setUpdateDialogOpen(true);
              handleMenuClose();
            }}
          >
            <Edit sx={{ mr: 1 }} />
            Update Status
          </MenuItem>
          <MenuItem onClick={() => {
            setDetailsDialogOpen(true);
            handleMenuClose();
          }}>
          <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
        </Menu>

        {/* Update Status Dialog */}
        <Dialog
          open={updateDialogOpen}
          onClose={closeUpdateDialog}
          // onClose={() => setUpdateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Order #{selectedOrder?.id} - {selectedOrder?.vehicle_number}
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="New Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
          <Button onClick={closeUpdateDialog}>
              Close
            </Button>
            <Button
              onClick={handleUpdateStatus}
              variant="contained"
              disabled={!newStatus}
            >
              Update Status
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog 
          open={detailsDialogOpen} 
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
        <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
            {selectedOrder && (
            <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Vehicle</Typography>
                        <Typography>{selectedOrder.vehicle_number} ({selectedOrder.vehicle_type})</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                        <Typography>{selectedOrder.customer_name || 'N/A'}</Typography>
                        <Typography>{selectedOrder.customer_phone || 'N/A'}</Typography>
                        <Typography>{selectedOrder.customer_email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                        <Typography>{selectedOrder.service_type}</Typography>
                        <Typography>Dirt Level: {selectedOrder.dirt_level}/5</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Schedule</Typography>
                        <Typography>
                          {selectedOrder?.requested_datetime 
                          ? new Date(selectedOrder.requested_datetime).toLocaleString('he-IL', {
                          day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) 
                        : 'N/A'}                        
                      </Typography>
                        <Typography>{selectedOrder.location_address || 'No address'}</Typography>
                        <Box sx={{ mt: 0.5 }}> {/* אפשר להקטין קצת את הרווח */}
                          <Typography variant="body2" color="text.secondary">
                            Lat: {selectedOrder.location_lat.toFixed(4)}, Lng: {selectedOrder.location_lng.toFixed(4)}
                          </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Pricing</Typography>
                        <Typography>₪{selectedOrder.price}</Typography>
                        <Typography>Duration: {selectedOrder.duration_minutes} min</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Assignment</Typography>
                        <Typography>Mobile Unit: {selectedOrder.mobile_name || 'Not assigned'}</Typography>
                        <Typography>Status: <Chip label={selectedOrder.status.toUpperCase()} color={getStatusColor(selectedOrder.status)} size="small" /></Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
          <DialogActions>
        <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
    </motion.div>
    </Container>
  );
};

export default AdminOrdersPage;
