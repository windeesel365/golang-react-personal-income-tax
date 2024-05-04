import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaxForm from './components/TaxForm';
import './App.css'; 

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<TaxForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
