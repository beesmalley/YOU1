import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Home from './Home';
import AuthForm from './sidebar';
import UserDashboard from './userDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Banner */}
        <header className="banner">
          <h1>GSU Poster Voting</h1>
        </header>
        
        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/user-dashboard">User Dashboard</Link></li>
            {/* Add other links as needed */}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/user-dashboard">
              <UserDashboard />
            </Route>
          </Switch>
          <AuthForm />
        </main>

        {/* Footer with Static Links */}
        <footer className="footer">
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
