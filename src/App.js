import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/user-dashboard">
              <UserDashboard />
            </Route>
            {/* Add other routes as needed */}
          </Switch>
        </main>

        {/* Footer */}
        {/* ... Footer code ... */}
      </div>
    </Router>
  );
}

export default App;
