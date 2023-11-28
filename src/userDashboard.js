import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const UserDashboard = () => {
  const [userType, setUserType] = useState('');
  const [events, setEvents] = useState([]);
  const [judgeEvents, setJudgeEvents] = useState([]);
  const [postersToJudge, setPostersToJudge] = useState([]);

  useEffect(() => {
    setUserType(Cookies.get('accountType'));
    fetchEvents();
    if (userType === 'Judge') {
      fetchEventsFollowedByJudge();
      fetchAssignedPosters();
    } else {
      //TODO: Add function here for fetchEventsFollowedByPresenter
      fetchEvents(); //Fetch all events for Presenter and Admin
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

  const fetchEventsFollowedByJudge = async () => {
    const judgeId = Cookies.get('userId'); 
    try {
      const response = await fetch(`./posterJudging.php?judgeId=${judgeId}&fetchEvents=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJudgeEvents(data || []);
    } catch (error) {
      console.error('Fetching events followed by judge failed:', error);
    }
  };

  const fetchAssignedPosters = async () => {
    const judgeId = Cookies.get('userId'); 
    try {
      const response = await fetch(`./posterJudging.php?judgeId=${judgeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPostersToJudge(data || []);
    } catch (error) {
      console.error('Fetching assigned posters failed:', error);
    }
  };

  //function to call after a review is submitted
  const onReviewSubmit = (posterId) => {
    setPostersToJudge(prev => prev.filter(poster => poster.ID !== posterId));
  };

  //TODO: create render events list for Presenter user type
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

  const renderJudgeEventsList = () => {
    if (judgeEvents.length === 0) {
      return <p>Visit the home page to explore and follow events!</p>;
    }
    return (
      <ul>
        {judgeEvents.map(event => (
          <li key={event.ID}>
            <h3>{event.Name}</h3>
            <p>{event.Description}</p>
          </li>
        ))}
      </ul>
    );
  };

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
      <Link to="./posterForm">Upload Poster</Link>
    </div>
  );

  const renderJudgeDashboard = () => (
    <div>
      <h2>My Events</h2>
      {renderJudgeEventsList()}
      <h2>Posters to Judge</h2>
      {renderPostersList()}
    </div>
  );

  //admins see ALL events on their dashboard
  const renderAdminDashboard = () => (
    <div>
      <h2>Events</h2>
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
