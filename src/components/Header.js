import React, { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup, AppBar, Toolbar, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useTheme } from '@mui/material/styles';
import './Header.css'; // Import the CSS file for custom styles

const Header = ({ toggleDarkMode, darkMode }) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    // Set the current page based on the location path
    const path = location.pathname === '/' ? '' : location.pathname.substring(1);
    setCurrentPage(path);
  }, [location]);

  const handlePageChange = (event, newPage) => {
    if (newPage !== null) {
      setCurrentPage(newPage);
    }
  };

  const theme = useTheme();
  return (
    <AppBar position="static" style={{ background: theme.palette.background.default, boxShadow: 'none' }}>
      <Toolbar style={{ justifyContent: 'space-between', margin: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton style={{ marginLeft: 10, color: theme.palette.text.primary }} component={Link} to="/" color="inherit">
            <RocketLaunchIcon style={{ color: theme.palette.text.primary }} />
          </IconButton>
        </div>
        <ToggleButtonGroup
          color="primary"
          value={currentPage}
          exclusive
          onChange={handlePageChange}
          aria-label="Platform"
          className="custom-toggle-button-group" // Add custom class
        >
          <ToggleButton component={Link} to="/about" value="about" className="custom-toggle-button">About Me</ToggleButton>
          <ToggleButton component={Link} to="/" value="" className="custom-toggle-button">Home</ToggleButton>
          <ToggleButton component={Link} to="/projects" value="projects" className="custom-toggle-button">Projects</ToggleButton>
        </ToggleButtonGroup>
        <IconButton onClick={toggleDarkMode} style={{ marginRight: 10, color: theme.palette.text.primary }}>
          {darkMode ? <WbSunnyIcon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};


export default Header;
