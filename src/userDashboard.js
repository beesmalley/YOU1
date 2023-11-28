import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const UserDashboard = () => {
  const [userType, setUserType] = useState('');
  const [events, setEvents] = useState([]);
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    setUserType(Cookies.get('accountType'));
    fetchEvents();
    if (userType === 'Judge') {
        fetchPosters(); //fetch posters to vote if user is a Judge
    }
  }, [userType]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('./eventhandling.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Fetching events failed:', error);
    }
  };

  const fetchPosters = async () => {
    // Placeholder for fetching posters data
    // ***** Replace '/path/to/posters.php' with actual PHP endpoint *****
    try {
      const response = await fetch('/path/to/posters.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosters(data);
    } catch (error) {
      console.error('Fetching posters failed:', error);
    }
  };

  const renderEventsList = () => (
    <ul>
      {events.map(event => (
        <li key={event.ID}>
          <h3>{event.Name}</h3>
          <p>{event.Description}</p>
        </li>
      ))}
    </ul>
  );

  const renderPostersList = () => (
    <ul>
      {posters.map(poster => (
        <li key={poster.ID}>
          <Link to={`/judgeForm/${poster.ID}`}>{poster.Title}</Link>
        </li>
      ))}
    </ul>
  );

  const renderPresenterDashboard = () => (
    <div>
      <h2>My Events</h2>
      {renderEventsList()}
      <Link to="/posterForm">Upload Poster</Link>
    </div>
  );

  const renderJudgeDashboard = () => (
    <div>
      <h2>My Events</h2>
      {renderEventsList()}
      <h2>Posters to Judge</h2>
      {renderPostersList()}
    </div>
  );

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      {userType === 'Presenter' && renderPresenterDashboard()}
      {userType === 'Judge' && renderJudgeDashboard()}
    </div>
  );
};

export default UserDashboard;
