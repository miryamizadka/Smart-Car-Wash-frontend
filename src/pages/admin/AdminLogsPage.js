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
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Refresh,
  History,
  Assignment,
  DirectionsCar,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { fetchActivityLogs } from '../../store/slices/adminSlice';
import { parseUTCDate } from '../../utils/dateUtils';
const AdminLogsPage = () => {
  const dispatch = useDispatch();
  const { activityLogs, logsPagination, loading, error } = useSelector((state) => state.admin);

  const [searchOrderId, setSearchOrderId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    dispatch(fetchActivityLogs({
      page: currentPage,
      limit: pageSize,
      orderId: searchOrderId || null,
    }));
  }, [dispatch, currentPage, pageSize, searchOrderId]);

  const handleSearch = () => {
    setCurrentPage(1);
    dispatch(fetchActivityLogs({
      page: 1,
      limit: pageSize,
      orderId: searchOrderId || null,
    }));
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
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
      pending: <Schedule />,
      assigned: <Assignment />,
      on_way: <DirectionsCar />,
      washing: <Schedule />,
      completed: <Schedule />,
      cancelled: <Schedule />,
    };
    return icons[status] || <Schedule />;
  };

  if (loading && !activityLogs) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading activity logs...
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
            Activity Logs
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Track all system activities and status changes
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                label="Search by Order ID"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search />}
                sx={{
                  backgroundColor: '#000',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchOrderId('');
                  setCurrentPage(1);
                  dispatch(fetchActivityLogs({
                    page: 1,
                    limit: pageSize,
                    orderId: null,
                  }));
                }}
                startIcon={<Refresh />}
                sx={{
                  borderColor: '#000',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#000',
                    color: '#fff',
                  },
                }}
              >
                Clear
              </Button>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Page Size</InputLabel>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  label="Page Size"
                >
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {error && (
              <Alert severity="error" sx={{ m: 3 }}>
                {error.error || 'Failed to load activity logs.'}
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Mobile Unit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityLogs && activityLogs.length > 0 ? (
                    activityLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {parseUTCDate(log.timestamp).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {parseUTCDate(log.timestamp).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            #{log.order_id}
                          </Typography>
                          {log.vehicle_number && (
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              {log.vehicle_number}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(log.status)}
                            label={log.status.toUpperCase()}
                            color={getStatusColor(log.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.mobile_name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 300 }}>
                            {log.notes || 'No notes'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                        <History sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          No activity logs found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {logsPagination && logsPagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Pagination
                  count={logsPagination.pages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}

            {/* Pagination Info */}
            {logsPagination && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, logsPagination.total)} of {logsPagination.total} entries
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Page {currentPage} of {logsPagination.pages}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AdminLogsPage;
