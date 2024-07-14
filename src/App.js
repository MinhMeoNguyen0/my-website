// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import Home from './pages/Home';
import Projects from './pages/Projects';
import './App.css'; // Import the CSS file for global styles

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#ffffff'
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000'
      }
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`outer-div ${darkMode ? 'dark' : 'light'}`}>
        <div className="inner-div">
          <Router>
            <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <div className="content-wrapper">
              <div className="content">
                <Routes>
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </div>
            </div>
            <Footer />
          </Router>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
