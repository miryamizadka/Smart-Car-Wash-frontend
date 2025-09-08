import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api';

// Async thunks
export const adminLogin = createAsyncThunk(
  'admin/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await adminAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'admin/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboardData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchActivityLogs = createAsyncThunk(
  'admin/fetchActivityLogs',
  async ({ page = 1, limit = 50, orderId }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getActivityLogs(page, limit, orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async ({ status, mobileId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getOrders(status, mobileId, page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMobileUnits = createAsyncThunk(
  'admin/fetchMobileUnits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getMobileUnits();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOrderStatusAdmin = createAsyncThunk(
  'admin/updateOrderStatusAdmin',
  async ({ orderId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, status, notes);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMobileUnit = createAsyncThunk(
  'admin/updateMobileUnit',
  async ({ mobileId, updates }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateMobileUnit(mobileId, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  dashboardData: null,
  activityLogs: [],
  orders: [],
  mobileUnits: [],
  loading: false,
  error: null,
  logsPagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
      state.dashboardData = null;
      state.activityLogs = [];
      state.orders = [];
      state.mobileUnits = [];
      state.error = null;
      localStorage.removeItem('adminToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('adminToken', action.payload);
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem('adminToken', action.payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Activity Logs
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLogs = action.payload.logs;
        state.logsPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Mobile Units
      .addCase(fetchMobileUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMobileUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.mobileUnits = action.payload;
        state.error = null;
      })
      .addCase(fetchMobileUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status Admin
      .addCase(updateOrderStatusAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Update order in orders array
        const orderIndex = state.orders.findIndex(order => order.id === action.payload.orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = action.payload.status;
        }
        state.error = null;
      })
      .addCase(updateOrderStatusAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Mobile Unit
      .addCase(updateMobileUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMobileUnit.fulfilled, (state, action) => {
        state.loading = false;
        // Update mobile unit in mobileUnits array
        const mobileIndex = state.mobileUnits.findIndex(mobile => mobile.id === action.payload.mobileId);
        if (mobileIndex !== -1) {
          state.mobileUnits[mobileIndex] = { ...state.mobileUnits[mobileIndex], ...action.payload.updates };
        }
        state.error = null;
      })
      .addCase(updateMobileUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setToken, initializeAuth } = adminSlice.actions;
export default adminSlice.reducer;
