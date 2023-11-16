import React, { useEffect, useState } from 'react';
import './Dashboard.css';
function Dashboard() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('./eventhandling.php')
            .then(response => response.json())
            .then(data => {
                if (data === 'No events') {
                    // Handle case where no events exist
                    console.log('No events');
                } else {
                    // Set events in state to display
                    setEvents(data);
                }
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }, []);

    // Render events or "No events" message in your component
    return (
        <div className='dashboard'>
            <h2>Upcoming Events</h2>
            <hr></hr>
            {events.length > 0 ? (
                events.map(event => (
                    <div key={event.ID} className='eventcard'>
                        <h2>{event.Name}</h2>
                        <p>{event.Description}</p>
                        {/* Display other event details */}
                    </div>
                ))
            ) : (
                <div className='eventcard'>
                    <h2>No events</h2>
                </div>
            )}
        </div>
    );
}

export default Dashboard;