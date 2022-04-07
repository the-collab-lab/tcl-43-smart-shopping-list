import React from 'react';
import './App.css';
import { BrowserRouter, Routes, NavLink, Route } from 'react-router-dom';
import List from './components/List.js';
import AddItem from './components/AddItem.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/additem" element={<AddItem />} />
        </Routes>

        <div className="link-div">
          <NavLink
            to="/"
            style={({ isActive }) =>
              isActive ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
            }
          >
            Shopping List
          </NavLink>
          <NavLink
            to="additem"
            style={({ isActive }) =>
              isActive ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
            }
          >
            Add Item
          </NavLink>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
