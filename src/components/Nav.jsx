import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="link-div">
      <NavLink
        to="/list"
        style={({ isActive }) =>
          isActive ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
        }
      >
        Shopping List
      </NavLink>

      <NavLink
        to="/addItem"
        style={({ isActive }) =>
          isActive ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
        }
      >
        Add Item
      </NavLink>
    </nav>
  );
}
