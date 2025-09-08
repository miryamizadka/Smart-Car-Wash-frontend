import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/api';

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrder(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOrderTracking = createAsyncThunk(
  'order/fetchOrderTracking',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderTracking(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, status, notes);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  currentOrder: null,
  orderHistory: [],
  trackingData: null,
  loading: false,
  error: null,
  success: false,
  pdfUrl: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.trackingData = null;
      state.pdfUrl = null;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTrackingData: (state) => {
      state.trackingData = null;
      state.loading = false;
      state.error = null;
    },
    setPdfUrl: (state, action) => {
      state.pdfUrl = action.payload;
    },
    updateOrderStatusLocal: (state, action) => {
      const { orderId, status } = action.payload;

      if (state.trackingData && state.trackingData.order.id === orderId) {
        state.trackingData.order.status = status;
        
        if (!state.trackingData.logs) {
            state.trackingData.logs = [];
        }
        state.trackingData.logs.unshift({
            id: new Date().getTime(), 
            order_id: orderId,
            status: status,
            notes: 'Status updated in real-time',
            timestamp: new Date().toISOString()
        });
      }
      
      if (state.currentOrder && state.currentOrder.orderId === orderId) {
        state.currentOrder.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.pdfUrl = action.payload.pdfPath;
        state.success = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch Order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order Tracking
      .addCase(fetchOrderTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingData = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrder) {
          state.currentOrder.status = action.payload.status;
        }
        if (state.trackingData) {
          state.trackingData.order.status = action.payload.status;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder, clearError, setPdfUrl, updateOrderStatusLocal, clearTrackingData } = orderSlice.actions;
export default orderSlice.reducer;
