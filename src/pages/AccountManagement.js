import React, { useEffect, useState } from 'react'
import '../styles/AccountManagement.css'

function AccountManagement (props) {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Retrieve the bearer token from localStorage (assuming you stored it there after login)
    const token = localStorage.getItem('token')

    if (!token) {
      // Redirect to the login page if no token is found in localStorage
      window.location.href = '/login'
    }

    // Make the GET request to fetch the user's account details
    fetch('http://localhost:4000/user/get', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUser(data.user)
        } else {
          setError(data.message)
        }
        setLoading(false)
      })
      .catch(error => {
        setError('An error occurred while fetching the user details.')
        setLoading(false)
      })
  }, [])

  const socket = props.socket
  if (!socket) {
    console.error('Socket prop is undefined in UrlDashBoard')
    console.log(props)
    return null // Render nothing if the socket prop is missing
  }

  const handleLogout = () => {
    // Clear the bearer token from localStorage
    localStorage.removeItem('token')
    // Reload the app to reset the state and redirect to the login page
    window.location.reload()
  }

  const deleteAccount = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
    }
    setLoading(true)
    setError('')
    const requestBody = {
      userId: user._id
    }
    const res = await fetch(`http://localhost:4000/user/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      setMessage(data.message)
      handleLogout()
    }
    setLoading(false)
    localStorage.removeItem('token')
    //windows.location.href = '/login'
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const home = () => {
    window.location.href = '/'
  }

  return (
    <div className='account-management'>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>
        Verification Status:{' '}
        {user.verificationStatus ? 'Verified' : 'Not Verified'}
      </p>

      {/* Add the logout button */}
      <div className='account-management-buttons'>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={deleteAccount}>Delete Account</button>
        <button onClick={home}>Home</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  )
}

export default AccountManagement
