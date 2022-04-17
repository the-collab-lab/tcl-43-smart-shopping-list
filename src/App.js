import React from 'react';
import './App.css';
import { BrowserRouter, Routes, NavLink, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import List from './components/List.jsx';
import AddItem from './components/AddItem.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/addItem" element={<AddItem />} />
        </Routes>

        <nav className="link-div">
          <NavLink
            to="list"
            style={({ isActive }) =>
              isActive ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
            }
          >
            Shopping List
          </NavLink>

          <NavLink
            to="addItem"
            style={({ isActive }) =>
              isActive ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
            }
          >
            Add Item
          </NavLink>
        </nav>
      </BrowserRouter>
    </div>
  );
}

export default App;
