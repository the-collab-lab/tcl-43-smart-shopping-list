import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';

export default function Nav() {
  return (
    <nav className="link-div">
      <div className="nav-links">
        <NavLink
          to="/list"
          style={({ isActive }) =>
            isActive ? { color: '#20A39E' } : { color: '#A4A9AD' }
          }
        >
          Shopping List
        </NavLink>
      </div>

      <div className="nav-links">
        <NavLink
          to="/addItem"
          style={({ isActive }) =>
            isActive ? { color: '#20A39E' } : { color: '#A4A9AD' }
          }
        >
          Add Item
        </NavLink>
      </div>

      <div className="nav-links">
        <NavLink
          to="/"
          onClick={() => window.localStorage.clear()}
          style={{ color: '#A4A9AD' }}
        >
          Home
        </NavLink>
      </div>
    </nav>
  );
}
