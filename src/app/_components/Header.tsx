"use client";
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faInfoCircle, faMoon, faSun, faCode } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/app/_context/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="header-content">
      <Link href="/" className="logo-link">
        <span className="logo-text">My BLOG</span>
      </Link>
        <nav className="main-nav">
          <Link href="/" className="nav-link">
            <FontAwesomeIcon icon={faHouse} className="nav-icon" />
            Home
          </Link>
          <Link href="/about" className="nav-link">
            <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
            About
          </Link>
          <button onClick={toggleTheme} className="nav-link" aria-label="Toggle Dark Mode" title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="nav-icon" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;