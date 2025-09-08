import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CarRepair,
  Speed,
  LocationOn,
  Schedule,
  CheckCircle,
  Star,
  DirectionsCar,
  CleaningServices,
  AutoFixHigh,
  Security,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Speed />,
      title: 'Fast Service',
      description: 'Quick and efficient car wash in just 30-60 minutes',
    },
    {
      icon: <LocationOn />,
      title: 'Mobile Service',
      description: 'We come to you - no need to leave your home',
    },
    {
      icon: <Schedule />,
      title: 'Flexible Scheduling',
      description: 'Book at your convenience with real-time availability',
    },
    {
      icon: <Security />,
      title: 'Professional Quality',
      description: 'Trained professionals with premium equipment',
    },
  ];

  const services = [
    {
      name: 'Exterior Wash',
      description: 'Complete exterior cleaning and detailing',
      icon: <CleaningServices />,
    },
    {
      name: 'Interior + Exterior',
      description: 'Full car cleaning inside and out',
      icon: <DirectionsCar />,
    },
    {
      name: 'Polish Service',
      description: 'Professional polishing and protection',
      icon: <AutoFixHigh />,
    },
    {
      name: 'Wax Protection',
      description: 'Premium wax application for long-lasting shine',
      icon: <Star />,
    },
  ];

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '1000+', label: 'Cars Washed' },
    { number: '5', label: 'Mobile Units' },
    { number: '4.9', label: 'Rating' },
  ];

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    color: '#000',
                    lineHeight: 1.2,
                  }}
                >
                  Smart Car Wash
                  <br />
                  <Box component="span" sx={{ color: '#666' }}>
                    Pro 2.0
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#666',
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                >
                  Professional mobile car wash services delivered to your doorstep. 
                  Experience the future of car care with our advanced technology.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/order')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    Book Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/track')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    Track Order
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400,
                    backgroundColor: '#000',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <CarRepair sx={{ fontSize: 120, color: '#fff' }} />
                  <Chip
                    label="2.0"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: '#fff',
                      color: '#000',
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 700,
                color: '#000',
              }}
            >
              Why Choose Us?
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: '#000',
                          color: '#fff',
                          mr: 2,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#000',
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 700,
                color: '#000',
              }}
            >
              Our Services
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={6} lg={3} key={service.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: '#f5f5f5',
                            color: '#000',
                            width: 60,
                            height: 60,
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          {service.icon}
                        </Avatar>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#000',
                            mb: 1,
                          }}
                        >
                          {service.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            mb: 2,
                            lineHeight: 1.5,
                          }}
                        >
                          {service.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#000',
                          }}
                        >
                          {service.price}
                        </Typography>
                        <Chip
                          label={service.duration}
                          size="small"
                          sx={{
                            backgroundColor: '#f0f0f0',
                            color: '#666',
                          }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/order')}
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Book This Service
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, backgroundColor: '#000', color: '#fff' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: '#fff',
                }}
              >
                Ready to Experience Smart Car Wash Pro 2.0?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#ccc',
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Book your service now and enjoy professional car care delivered 
                to your doorstep with real-time tracking and premium quality.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/order')}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  backgroundColor: '#fff',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                Book Your Service Now
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
