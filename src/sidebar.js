import React, { useState, useEffect } from 'react';
import './sidebar.css'; // Import your CSS file
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom';


function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [firstname,setFirstname] = useState('');
  const [lastname,setLastname] = useState('');

  const accountTypeOptions = ['Presenter', 'Admin', 'Judge']; // Define account type options

  useEffect(() => {
    // Check if the user is logged in by looking at the cookie
    const isLoggedInCookie = Cookies.get('isLoggedIn');
    const accountTypeCookie = Cookies.get('accountType');
    if (isLoggedInCookie === 'true') {
      setIsLoggedIn(true);
      setAccountType(accountTypeCookie);
    }
  }, []); // The empty array ensures this runs only once on component mount

  const handleLoginOrRegister = async () => {
    //handles login
    if(isLoginForm){
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      try {
        const response = await fetch('php/loginsubmit.php', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.text(); // Get the response body as text
          setResponseMessage(data);
          alert(data); // You can replace this with any other UI update logic
          setIsLoggedIn(true);
          setAccountType(Cookies.get('accountType'));
        } else {
           // Handle login failure, e.g., display an error message
          setResponseMessage('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }else{
      // Handle registration
      if (
        (accountType === 'Judge' && !email.endsWith('@gsu.edu')) ||
        (accountType === 'Admin' && !email.endsWith('@gsu.edu')) ||
        (accountType === 'Presenter' && !email.endsWith('@student.gsu.edu'))
      ) {
        if (accountType === 'Judge' || accountType === 'Admin') {
          alert('This account type must register with a @gsu.edu email');
        } else if (accountType === 'Presenter') {
          alert('This account type must register with a @student.gsu.edu email');
        }
      }else{
      if (password === confirmPassword) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('account_type', accountType); // Add account type to the form data
        formData.append('first_name',firstname);
        formData.append('last_name',lastname)

        try {
          const response = await fetch('php/registrationsubmit.php', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.text();
            setResponseMessage(data); // Set the response message in state
          } else {
            setResponseMessage('Registration failed. Please try again.'); // Handle failure
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        setResponseMessage('Passwords do not match.'); // Handle password mismatch
      }
    }
    }
    
  };

  const handleLogout = () => {
    // Handle logout logic here
  
        setIsLoggedIn(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAccountType('');
        setResponseMessage('');

        Cookies.remove('isLoggedIn');
        Cookies.remove('accountType');
    

  };

  return (
    <div className='sidebar'>
      { isLoggedIn ? (
         <div className="logged-in-state">
         <p>Currently logged in as: {email}</p>
         <button onClick={handleLogout}>Sign Out</button>
         </div>
      ) : ( 
    <div className="auth-form">
      <h2>{isLoginForm ? 'Login' : 'Register'}</h2>
      <form>
        <div className='form-group'>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!isLoginForm && (
          <div className='form-group'>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              />
              <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              />
          </div>
          
        )}
         {!isLoginForm && (
          <div>
            <label htmlFor="accountType">Account Type</label>
            <select
              id="account_type"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="">Select an Account Type</option>
              {accountTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>
      <div className='button-container'>
      <button type="button" onClick={handleLoginOrRegister}>
          {isLoginForm ? 'Log In' : 'Register'}
        </button>
      <button type="button" onClick={() => setIsLoginForm(!isLoginForm)}>
        {isLoginForm ? 'Switch to Registration' : 'Switch to Login'}
      </button>
      </div>
      {responseMessage && (
        <div className="response-message">{responseMessage}</div>
      )}
    </div>
      )}
       <nav>
         <ul>
           <li><a href="index.html">Home</a></li>
           {accountType === 'Admin' && (
             <li><a href="/admin">Admin Dashboard</a></li>
           )}
           {(accountType === 'Presenter' || accountType === 'Judge') && (
             <li><Link to="./userDashboard">User Dashboard</Link></li>
           )}
           <li><a href="/about">About</a></li>
           <li><a href="/contact">Contact</a></li>

         </ul>
       </nav>
       <div className='calendar'>
   
       </div>
       </div>
  );
}

export default AuthForm;
