import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

function CreateUrl (props) {
  const [url, setUrl] = useState('')
  const [message, setmessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const socket = props.socket

  async function handleSubmit (e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
    }
    const res = await fetch('http://localhost:4000/url/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        url
      })
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      setmessage(data.message)
      socket.emit('newUrl', { url: data.url })
    }
    setLoading(false)
  }

  return (
    <div className='create-url'>
      <h1>Create a Short URL</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Enter URL'
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Create'}
        </button>
      </form>
      {error && <p className='error'>{error}</p>}
      {message && <p className='message'>{message}</p>}
    </div>
  )
}

export default CreateUrl
