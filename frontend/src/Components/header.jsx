import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import { Button } from '@mui/material';

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn()); // State to manage login/logout status

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    setLoggedIn(false); // Update state to reflect logout
  };

  function isLoggedIn() {
    return localStorage.getItem('username') && localStorage.getItem('password');
  }

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" prefetch={false}>
          <MicIcon className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">Audio - Transcribe</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
            Features
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
            Contact
          </Link>
        </nav>

        {loggedIn ? (
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="contained">
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
