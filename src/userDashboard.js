import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const UserDashboard = () => {
  const [userType, setUserType] = useState('');
  const [events, setEvents] = useState([]);
  const [postersToJudge, setPostersToJudge] = useState([]);

  useEffect(() => {
    setUserType(Cookies.get('accountType'));
    fetchEvents();
    if (userType === 'Judge') {
        fetchAssignedPosters(); //fetch posters to vote if user is a Judge
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

  const fetchAssignedPosters = async () => {
    try {
      const judgeId = Cookies.get('userId'); // 
      const response = await fetch(`./posterJudging.php?judgeId=${judgeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPostersToJudge(data[judgeId] || []);
    } catch (error) {
      console.error('Fetching assigned posters failed:', error);
    }
  };

  // Function to call after a review is submitted
  const onReviewSubmit = (posterId) => {
    setPostersToJudge(prev => prev.filter(poster => poster.ID !== posterId));
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
      {postersToJudge.map(poster => (
        <li key={poster.ID}>
          {/* Link to JudgeForm with onReviewSubmit callback */}
          <Link to={{
            pathname: `./judgeForm/${poster.ID}`,
            state: { onReviewSubmit }
          }}>
            {poster.Title}
          </Link>
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

  const renderAdminDashboard = () => (
    <div>
      <h2>My Events</h2>
      {renderEventsList()}
      <Link to="/eventForm">Create Event</Link>
    </div>
  );

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      {userType === 'Presenter' && renderPresenterDashboard()}
      {userType === 'Judge' && renderJudgeDashboard()}
      {userType === 'Admin' && renderAdminDashboard()}
    </div>
  );
};

export default UserDashboard;
