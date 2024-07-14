// src/components/Footer.js
import React from 'react';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  return (
    <footer style={{ borderTop: "1px solid"+ theme.palette.text.primary+"5c", background: theme.palette.background.default, padding: '10px 0', textAlign: 'center' }}>
      <p style={{ color: theme.palette.text.primary }}>© 2024 Minh Duc Nguyen. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
