import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Link, Route } from 'react-router-dom';
import List from './components/List.js';
import AddItem from './components/AddItem.js';

function App() {
  const handleClick = (e) => {
    //e.target vs. e.currentTarget! e.currentTarget is what the event is attached to, e.target is what was clicked - fixed onClick confusion!

    //why doesn't the path change on refresh, but the ui styling does??

    const innerText = e.currentTarget.innerText;
    if (innerText === 'Shopping List') {
      e.currentTarget.style.fontWeight = 'bold';
      e.currentTarget.nextSibling.style.fontWeight = 'normal';
    } else {
      e.currentTarget.style.fontWeight = 'bold';
      e.currentTarget.previousElementSibling.style.fontWeight = 'normal';
    }
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/additem" element={<AddItem />} />
        </Routes>

        <div className="link-div">
          <Link to="/" onClick={handleClick}>
            Shopping List
          </Link>
          <Link to="/additem" onClick={handleClick}>
            Add Item
          </Link>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
