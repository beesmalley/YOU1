import React, { useState, useEffect } from 'react';
import useHistory from 'react-router-dom';
import './posterUploadForm.css'

const PosterUploadForm = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [posterImage, setPosterImage] = useState(null);
    const [description, setDescription] = useState('');

    const history = useHistory();


    useEffect(() => {
        // Fetch events from the backend
        fetch('./handling.php')
            .then(response => response.json())
            .then(data => setEvents(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('event', selectedEvent);
        formData.append('title', title);
        formData.append('name', name);
        formData.append('posterImage', posterImage);
        formData.append('description', description);

        try {
            const response = await fetch('./posterInfo.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleBack = () => {
        if (window.confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
            history.goBack(); // Go back to the previous page
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Event:
                <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} required>
                    <option value="">Select an Event</option>
                    {events.map(event => (
                        <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Title:
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </label>
            <label>
                Your Name:
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
                Poster Image:
                <input type="file" onChange={e => setPosterImage(e.target.files[0])} />
            </label>
            <label>
                Description (140 characters max):
                <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength="140" />
            </label>
            <button type="submit">Submit</button>
            <button type="button" onClick={handleBack}>Back</button>
        </form>
    );
};

export default PosterUploadForm;
