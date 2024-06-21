// src/components/Hero.js
import React from 'react';
import { Container, Typography, Avatar } from '@mui/material';

const Hero = () => {
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Crazy Koder
      </Typography>
      <Avatar alt="Crazy Koder" src="/path/to/profile.jpg" style={{ margin: 'auto', width: 100, height: 100 }} />
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        We are a dynamic team fueled by passion and creativity in the App Development and Web Design industry.
      </Typography>
    </Container>
  );
};

export default Hero;
