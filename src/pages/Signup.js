import React, { useState } from 'react'
import '../styles/Signup.css'

function Signup () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = e => {
    e.preventDefault()
    // Create the request body object
    const requestBody = {
      name: name,
      email: email,
      password: password
    }

    // Make the POST request to the server
    fetch('http://localhost:4000/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Signup successful, redirect to login page
          window.location.href = '/login'
        } else {
          // Signup failed, display error message
          console.log(data.message)
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error)
      })
  }

  const passwordSubmit = e => {
    if (e.key === 'Enter') {
      handleSignup(e)
    }
  }

  return (
    <div class='signup-container'>
      <h1 className='signup-heading'>Signup</h1>
      <form className='signup-form'>
        <div class='form-group'>
          <label for='name' className='form-label'>
            Name:
          </label>
          <input
            type='text'
            id='name'
            class='form-input'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div class='form-group'>
          <label for='email' className='form-label'>
            Email:
          </label>
          <input
            type='text'
            id='email'
            class='form-input'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div class='form-group'>
          <label for='password' className='form-label'>
            Password:
          </label>
          <input
            type='password'
            id='password'
            class='form-input'
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={passwordSubmit}
          />
        </div>
        <button class='signup-button' onClick={handleSignup}>
          Signup
        </button>
      </form>
      <button
        class='signup-button'
        onClick={() => (window.location.href = '/login')}
      >
        Login
      </button>
    </div>
  )
}

export default Signup
