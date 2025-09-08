import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  currentPage: 'home',
  notifications: [],
  theme: 'light',
  loading: {
    global: false,
    order: false,
    admin: false,
  },
  modals: {
    orderConfirmation: false,
    orderTracking: false,
    adminLogin: false,
  },
  snackbar: {
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      const { type, loading } = action.payload;
      state.loading[type] = loading;
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    resetUI: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setCurrentPage,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  setLoading,
  setGlobalLoading,
  openModal,
  closeModal,
  showSnackbar,
  hideSnackbar,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
