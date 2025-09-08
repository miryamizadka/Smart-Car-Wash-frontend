import { io } from 'socket.io-client';
import { store } from '../store/store';
import { updateOrderStatusLocal } from '../store/slices/orderSlice';
import { showSnackbar } from '../store/slices/uiSlice';

let socket = null;

export const initializeSocket = (dispatch) => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for order status updates
    socket.on('status-update', (data) => {
      console.log('Status update received:', data);
      store.dispatch(updateOrderStatusLocal(data));
      
      const statusMessages = {
        pending: 'Your order is being processed',
        assigned: 'Mobile unit has been assigned',
        on_way: 'Mobile unit is on the way',
        washing: 'Your car is being washed',
        completed: 'Service completed successfully',
        cancelled: 'Order has been cancelled',
      };

      const message = statusMessages[data.status] || `Order status updated to ${data.status}`;
      
      store.dispatch(showSnackbar({
        message,
        severity: data.status === 'completed' ? 'success' : 'info',
      }));
    });

    // Listen for admin status updates
    socket.on('admin-status-update', (data) => {
      console.log('Admin status update received:', data);
      store.dispatch(updateOrderStatusLocal(data));
    });

    // Listen for new orders (admin)
    socket.on('order-created', (data) => {
      console.log('New order created:', data);
      store.dispatch(showSnackbar({
        message: `New order #${data.orderId} created`,
        severity: 'info',
      }));
    });
  }

  return socket;
};

export const joinOrderRoom = (orderId) => {
  if (socket) {
    socket.emit('join-order', orderId);
  }
};

export const leaveOrderRoom = (orderId) => {
  if (socket) {
    socket.emit('leave-order', orderId);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
