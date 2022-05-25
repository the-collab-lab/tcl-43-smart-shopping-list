import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="link-div">
      <NavLink
        to="/list"
        style={({ isActive }) =>
          isActive ? { color: '#20a39e' } : { color: 'black' }
        }
      >
        Shopping List
      </NavLink>

      <NavLink
        to="/addItem"
        style={({ isActive }) =>
          isActive ? { color: '#20a39e' } : { color: 'black' }
        }
      >
        Add Item
      </NavLink>
    </nav>
  );
}
