import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaxForm from './components/TaxForm';
import CsvUpload from './components/CsvUpload';
import './App.css'; 

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/upload-csv">Upload CSV</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<TaxForm />} />
          <Route path="/upload-csv" element={<CsvUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
