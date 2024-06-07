// Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/chart">Activity Chart</Link></li>
        <li><Link to="/table">Activity Table</Link></li>
        <li><Link to="/summary">Summary Report</Link></li>
        <li><Link to="/details">Activity Details</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
