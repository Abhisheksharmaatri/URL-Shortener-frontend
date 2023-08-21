import React, { useState } from 'react'
import '../styles/Login.css'

function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = e => {
    e.preventDefault()
    // Create the request body object
    const requestBody = {
      email: email,
      password: password
    }

    // Make the POST request to the server
    fetch('http://localhost:4000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Login successful, store the token in localStorage
          localStorage.setItem('token', data.token)
          setMessage(data.message)
          console.log('JWT Token:', data.token)

          // Redirect to the home page
          window.location.href = '/'
        } else {
          // Login failed, handle error message
          setMessage(data.message)
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error)
      })
  }

  const passwordSubmit = e => {
    if (e.key === 'Enter') {
      handleLogin(e)
    }
  }

  return (
    <div className='login-container'>
      <h1 className='login-heading'>Login</h1>
      <form className='login-form'>
        <div className='form-group'>
          <label htmlFor='email' className='form-label'>
            Email:
          </label>
          <input
            type='text'
            id='email'
            className='form-input'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password' className='form-label'>
            Password:
          </label>
          <input
            type='password'
            id='password'
            className='form-input'
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={passwordSubmit}
          />
        </div>
        <button className='login-button' onClick={handleLogin}>
          Login
        </button>
        <p className='login-message'>{message}</p>
      </form>
      <button
        className='signup-button'
        onClick={() => (window.location.href = '/signup')}
      >
        Signup
      </button>
    </div>
  )
}

export default Login
