import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Link, Route } from 'react-router-dom';
import List from './components/List.js';
import AddItem from './components/AddItem.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/additem" element={<AddItem />} />
          <Route path="/list" element={<List />} />
        </Routes>

        <div>
          <button>
            <Link to="/list">Shopping List</Link>
          </button>
          <button>
            <Link to="/additem">Add Item</Link>
          </button>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
