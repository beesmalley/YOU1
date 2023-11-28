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
        fetchFollowedEventsAndAssignPosters();
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

  const fetchFollowedEventsAndAssignPosters = async () => {
    const judgeId = Cookies.get('userId');
    try {
      //fetch events followed by the judge
      const eventsResponse = await fetch(`./eventsFollowed.php?judgeId=${judgeId}`);
      if (!eventsResponse.ok) {
        throw new Error(`HTTP error! status: ${eventsResponse.status}`);
      }
      const followedEvents = await eventsResponse.json();
      const eventIds = followedEvents.map(event => event.ID).join(',');

      //fetch posters for these events
      const postersResponse = await fetch(`./posterJudging.php?judgeId=${judgeId}&eventIds=${eventIds}`);
      if (!postersResponse.ok) {
        throw new Error(`HTTP error! status: ${postersResponse.status}`);
      }
      const postersData = await postersResponse.json();
      setPostersToJudge(postersData[judgeId] || []);
    } catch (error) {
      console.error('Error in fetching events or posters:', error);
    }
  };

  //function to call after a review is submitted
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
