// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

const Header = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  return (
    <AppBar position="static" style={{ background: theme.palette.background.default, boxShadow: 'none' }}>
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/path/to/new-logo.png" alt="Logo" style={{ width: 40, height: 40, marginRight: 16 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/" style={{ color: theme.palette.text.primary }}>About</Button>
          <Button color="inherit" component={Link} to="/projects" style={{ color: theme.palette.text.primary }}>Projects</Button>
        </div>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
