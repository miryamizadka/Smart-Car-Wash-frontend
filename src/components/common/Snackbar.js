import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar as MuiSnackbar, Alert, Slide } from '@mui/material';
import { hideSnackbar } from '../../store/slices/uiSlice';

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const Snackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.ui.snackbar);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          backgroundColor: severity === 'error' ? '#f44336' : 
                          severity === 'success' ? '#4caf50' :
                          severity === 'warning' ? '#ff9800' : '#2196f3',
          color: '#fff',
          '& .MuiAlert-icon': {
            color: '#fff',
          },
        }}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
