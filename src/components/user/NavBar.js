import React, { Component } from 'react'

function Navbar (props) {
  const handleLogout = () => {
    // Clear the bearer token from localStorage
    localStorage.removeItem('token')
    // Reload the app to reset the state and redirect to the login page
    window.location.reload()
  }

  const handleManageAccount = () => {
    window.location.href = '/account'
  }
  return (
    <div className='navbar'>
      <p className='heading'>Welcome, {props.name}!</p>
      <div className='navbar-buttons'>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleManageAccount}>Manage Account</button>
      </div>
    </div>
  )
}

export default Navbar
