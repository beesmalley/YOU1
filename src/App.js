import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Sidebar from './sidebar';
import UserDashboard from './userDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Banner */}
        <header className="banner">
          <h1>GSU Poster Voting</h1>
        </header>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            {/* Add other routes as needed */}
          </Routes>
        </main>

        {/* Footer */}
        {/* ... Footer code ... */}
      </div>
    </Router>
  );
}

export default App;
