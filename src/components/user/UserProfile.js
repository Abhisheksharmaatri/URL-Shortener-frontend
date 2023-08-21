import React, { useEffect, useState } from 'react'

//Import URL Dashboard
import UrlDashBoard from './UrlDashBoard'
import NavBar from './NavBar'

function UserProfile (props) {
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
          data.user.urls.forEach(url => {
            url.expirationDate = new Date(
              url.expirationDate
            ).toLocaleDateString()
          })
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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className='user-profile'>
      <NavBar name={user.name} email={user.email} />
      <UrlDashBoard urls={user.urls} socket={socket} />
      {error && <p className='error'>{error}</p>}
      {message && <p className='message'>{message}</p>}
    </div>
  )
}

export default UserProfile
