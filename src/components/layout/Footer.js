import React from 'react';
import { Box, Typography, Container, Divider, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { CarRepair, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 4,
            }}
          >
            {/* Company Info */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CarRepair sx={{ mr: 1, fontSize: 28 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                  }}
                >
                  Smart Car Wash Pro
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#ccc',
                  maxWidth: 300,
                  lineHeight: 1.6,
                }}
              >
                Professional mobile car wash services delivered to your doorstep. 
                Experience the convenience of premium car care with our advanced 
                Smart Car Wash Pro 2.0 system.
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: '#fff',
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 16, color: '#ccc' }} />
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    +972-50-123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16, color: '#ccc' }} />
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    support@carwash.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: '#ccc' }} />
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Tel Aviv, Israel
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Services */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: '#fff',
                }}
              >
                Our Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Exterior Wash
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Interior Cleaning
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Polish Service
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Wax Protection
                </Typography>
              </Box>
            </Box>

            {/* Technology */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: '#fff',
                }}
              >
                Technology
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Real-time Tracking
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Smart Scheduling
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Mobile Fleet
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Digital Invoices
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: '#333' }} />

          {/* Copyright */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#999',
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              © {currentYear} Smart Car Wash Pro 2.0. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link
                href="#"
                sx={{
                  color: '#999',
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s ease',
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#999',
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s ease',
                }}
              >
                Terms of Service
              </Link>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
