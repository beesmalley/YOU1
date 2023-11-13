import React, { useState } from 'react';
import './login.css'; // Import your CSS file

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);

  const accountTypeOptions = ['Presenter', 'Admin', 'Judge']; // Define account type options

  const handleLoginOrRegister = async () => {
    //handles login
    if(isLoginForm){
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('account_type', accountType); // Add account type to the form data
  
      try {
        const response = await fetch('php/loginsubmit.php', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.text(); // Get the response body as text
          setResponseMessage(data);
          alert(data); // You can replace this with any other UI update logic
        } else {
           // Handle login failure, e.g., display an error message
          setResponseMessage('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }else{
      // Handle registration
      if (password === confirmPassword) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

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
    
  };

  return (
    <div className='sidebar'>
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
          </div>
          
        )}
         {!isLoginForm && (
          <div>
            <label htmlFor="accountType">Account Type</label>
            <select
              id="accountType"
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
      
       <nav>
         <ul>
           <li><a href="/">Home</a></li>
           {accountType === 'admin' && (
             <li><a href="/admin">Admin Dashboard</a></li>
           )}
           {accountType === 'user' && (
             <li><a href="/user">User Dashboard</a></li>
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
