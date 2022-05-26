import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import List from './components/List/List.jsx';
import AddItem from './components/AddItem/AddItem.jsx';
import { getUser } from './utils/utils';

function App() {
  const userToken = getUser();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={userToken ? <List /> : <Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/addItem" element={<AddItem />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
