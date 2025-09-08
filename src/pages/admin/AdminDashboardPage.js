import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  DirectionsCar,
  AttachMoney,
  Schedule,
  Assignment,
  TrendingUp,
  CheckCircle,
  Pending,
  DirectionsRun,
  LocalCarWash,
} from '@mui/icons-material';
import RouteIcon from '@mui/icons-material/Route';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { fetchDashboardData } from '../../store/slices/adminSlice';
import { parseUTCDate } from '../../utils/dateUtils';
const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading && !dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          {error.error || 'Failed to load dashboard data.'}
        </Alert>
      </Container>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { overview, ordersByStatus, recentOrders, mobileStatus, dailyRevenue } = dashboardData;

  // Prepare data for charts
  const revenueData = dailyRevenue.map(item => ({
    date: parseUTCDate(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    orders: item.orders_count,
  }));

  const statusData = ordersByStatus.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' '),
    value: item.count,
  }));

  const COLORS = ['#000000', '#666666', '#999999', '#cccccc', '#f0f0f0'];

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                backgroundColor: color,
                color: '#fff',
                borderRadius: 2,
                p: 1,
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#000', mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#666' }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

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
            Admin Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Smart Car Wash Pro 2.0 - Business Overview
          </Typography>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={overview.totalOrders}
              icon={<Assignment />}
              color="#000"
              subtitle="All time orders"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`₪${overview.totalRevenue}`}
              icon={<AttachMoney />}
              color="#4caf50"
              subtitle="All time revenue"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Working Time"
              value={`${Math.round(overview.totalWorkingTime / 60)}h`}
              icon={<Schedule />}
              color="#ff9800"
              subtitle="Total service hours"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg Order Value"
              value={`₪${overview.averageOrderValue}`}
              icon={<TrendingUp />}
              color="#2196f3"
              subtitle="Per order average"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Distance"
              value={`${overview.totalDistance} km`}
              icon={<RouteIcon />}
              color="#9c27b0"
              subtitle="Total distance driven"
            />
        </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Revenue Chart */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Daily Revenue (Last 7 Days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#000"
                        strokeWidth={3}
                        dot={{ fill: '#000', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Orders by Status */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Orders by Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 2 }}>
                    {statusData.map((item, index) => (
                      <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: '50%',
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {item.name}: {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent Orders & Mobile Status */}
        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Recent Orders
                  </Typography>
                  {recentOrders && recentOrders.length > 0 ? (
                    <List>
                      {recentOrders.slice(0, 5).map((order, index) => (
                        <React.Fragment key={order.id}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  backgroundColor: '#f0f0f0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Assignment sx={{ color: '#666' }} />
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  Order #{order.id} - {order.vehicle_number}
                                </Typography>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" sx={{ color: '#666' }}>
                                    {order.service_type} • ₪{order.price} • {order.mobile_name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#999' }}>
                                    {parseUTCDate(order.created_at).toLocaleString('he-IL')}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Chip
                              label={order.status.toUpperCase()}
                              size="small"
                              color={
                                order.status === 'completed' ? 'success' :
                                order.status === 'pending' ? 'warning' :
                                order.status === 'on_way' ? 'primary' : 'default'
                              }
                            />
                          </ListItem>
                          {index < recentOrders.slice(0, 5).length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', py: 2 }}>
                      No recent orders
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Mobile Units Status */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Mobile Units Status
                  </Typography>
                  {mobileStatus && mobileStatus.length > 0 ? (
                    <List>
                      {mobileStatus.map((mobile, index) => (
                        <React.Fragment key={mobile.id}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  backgroundColor: mobile.is_available ? '#4caf50' : '#ff9800',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <DirectionsCar sx={{ color: '#fff' }} />
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {mobile.name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                  {mobile.is_available ? 'Available' : 'Busy'}
                                  {mobile.current_order_id && ` • Order #${mobile.current_order_id}`}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < mobileStatus.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', py: 2 }}>
                      No mobile units available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AdminDashboardPage;
