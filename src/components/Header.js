// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Button, ButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useTheme } from '@mui/material/styles';

const Header = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  return (
    <AppBar position="static" style={{ background: theme.palette.background.default, boxShadow: 'none' }}>
      <Toolbar style={{ justifyContent: 'space-between', margin: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton style={{ marginLeft: 10, color: theme.palette.text.primary }} component={Link} to="/" color="inherit">
            <RocketLaunchIcon style={{ color: theme.palette.text.primary }} />
          </IconButton>
        </div>
        <ButtonGroup variant="text" aria-label="Basic button group">
          <Button color="inherit" component={Link} to="/about" style={{ borderColor: theme.palette.text.primary+'3d', color: theme.palette.text.primary }}>About</Button>
          <Button color="inherit" component={Link} to="/projects" style={{ color: theme.palette.text.primary }}>Projects</Button>
        </ButtonGroup>
        <IconButton onClick={toggleDarkMode} style={{ marginRight: 10, color: theme.palette.text.primary }}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
