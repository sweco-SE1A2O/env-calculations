import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Homepage from './components/Homepage/Homepage';
import './App.css';
import SGU3 from './components/SGU3/SGU3';
import SGU3Help from './components/SGU3/SGU3Help';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sgu3" element={<SGU3 />} />
        <Route path="/sgu3-help" element={<SGU3Help />} />
        {/* Fallback route for 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

