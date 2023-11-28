import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('php/eventhandling.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
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
        <div className='home'>
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

export default Home;