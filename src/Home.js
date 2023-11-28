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

    const followEvent = (eventId) => {
        // Send a POST request to userevents.php when the "Follow" button is clicked
        const formData = new FormData();
        formData.append('EventID',eventId)
        
        fetch('./php/userevents.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // Log the response from the server
            // Add logic here to update UI if needed
        })
        .catch(error => {
            console.error('Error following event:', error);
        });
    };

    // Render events or "No events" message in your component
    return (
        <div className='home'>
            <h2>Upcoming Events</h2>
            <hr></hr>
            {events.length > 0 ? (
                events.map(event => (
                    <div key={event.ID} className='eventcard'>
                        <h2>{event.Name}</h2>
                        <hr></hr>
                        <p>{event.Description}</p>
                        {event.Thumbnail && (
                        <img
                            src={`data:image/jpeg;base64,${event.Thumbnail}`}
                            alt={`Thumbnail for ${event.Name}`}
                        />
                        
                        )}
                        <button onClick={() => followEvent(event.ID)}>Follow</button>
                        
                    <hr></hr>
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