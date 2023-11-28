import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; 
import './eventForm.css';

function EventForm(){

const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [thumbnail, setThumbnail] = useState(null);
const [isOpen, setIsOpen] = useState(null);
const [openDate,setOpenDate] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('thumbnail', thumbnail);
    formData.append('isOpen',)

    const response = await fetch('./GSUposter/php/addevent.php', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Event added successfully!');
    } else {
      console.error('Failed to add event');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setThumbnail(file);
};

return (
  <form onSubmit={handleSubmit}>
    {/* Existing form fields */}
    <div className='event-form'>
    <label htmlFor="name">Event Name:</label>
      <input
        type="text"
        id="name"
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="description">Event Description:</label>
      <input
        type="text"
        id="description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="thumbnail">Event Thumbnail Image:</label>
      <input
        type="file"
        id="thumbnail"
        accept=".png, .jpg, .jpeg" // Specify accepted file types
        onChange={handleFileChange}
      />
       <label htmlFor="isOpen">Event Status:</label>
      <select id="isOpen" onChange={(e) => setIsOpen(e.target.value)}>
        <option value="true">Open</option>
        <option value="false">Closed</option>
      </select>

      <label htmlFor="openDate">Event Open Date:</label>
      <input
        type="date"
        id="openDate"
        value={openDate}
        onChange={(e) => setOpenDate(e.target.value)}
      />
    </div>
    <button type="submit">Submit</button>
  </form>
);
}

export default EventForm;