import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Sidebar from './sidebar';
import UserDashboard from './userDashboard';
import EventForm from './eventForm';
import PosterUploadForm from './posterForm';
import JudgeForm from './judgeForm';
import Cookies from 'js-cookie';

function App() {
  const [accountType, setAccountType] = useState(Cookies.get('accountType') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  useEffect(() => {
    // Check if the user is logged in by looking at the cookie
    const isLoggedInCookie = Cookies.get('isLoggedIn');
    const accountTypeCookie = Cookies.get('accountType');
    if (isLoggedInCookie === 'true') {
      setIsLoggedIn(true);
      setAccountType(accountTypeCookie);
    }
  }, []); // The empty array ensures this runs only once on component mount
  
  return (
    <Router>
      <div className="App">
        {/* Banner */}
        <header className="banner">
          <h1>GSU Poster Voting</h1>
        </header>

        {/* Main Wrapper for Sidebar and Content */}
        <div className="main-wrapper">
          {/* Main Content */}
          <main className="content">
            <Routes>
              <Route path="/GSUPoster/index.html" element={<Home />} />
              <Route path="/userDashboard" element={<UserDashboard />} />
              <Route path="/eventForm" element={<EventForm/>} />
              <Route path="/posterForm" element={<PosterUploadForm/>} />
              <Route path="/judgeForm" element={<JudgeForm/>} />
              {/* Add other routes as needed */}
            </Routes>
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>

        {/* Footer */}
        {/* ... Footer code ... */}
      </div>
    </Router>
  );
}

export default App;
