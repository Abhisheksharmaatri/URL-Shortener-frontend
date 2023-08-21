import React, { useEffect, useState } from 'react'

import axios from 'axios'

import QRCodePopup from '../url/Qrcode' // Adjust the import path as needed.

function UrlDashBoard (props) {
  const [url, setUrl] = useState('')
  const [message, setmessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [urls, setUrls] = useState(props.urls) // Store URLs in state
  const [showQRCodePopup, setShowQRCodePopup] = useState(false)
  const [qrCodeImg, setQRCodeImg] = useState('')
  const [qrcodeUrl, setQrcodeUrl] = useState('')

  const socket = props.socket

  if (!socket) {
    console.error('Socket prop is undefined in UrlDashBoard')
    console.log(props)
    return null // Render nothing if the socket prop is missing
  }

  const deleteUrl = async id => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
    }
    setLoading(true)
    setError('')
    const requestBody = {
      urlId: id
    }
    const res = await fetch(`http://localhost:4000/url/delete`, {
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
      setmessage(data.message)
      socket.emit('deleteUrl', { urlId: id })

      // Remove the deleted URL from the list in the state
      setUrls(urls.filter(url => url._id !== id))
    }
    setLoading(false)
  }

  //Qrcode:

  useEffect(() => {
    // Listen for a WebSocket event that signals a URL has been deleted
    socket.on('urlDeleted', ({ deletedUrlId }) => {
      // Update the UI to remove the deleted URL from the list
      console.log('urlDeleted event received')

      // Remove the deleted URL from the list in the state
      setUrls(urls.filter(url => url._id !== deletedUrlId))
    })

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('urlDeleted')
    }
  }, [socket, urls]) // Include 'urls' in the dependency array

  useEffect(() => {
    socket.on('urlCreated', ({ url }) => {
      console.log('urlCreated event received')
      console.log('url:', url)
      setUrls([...urls, url])
    })
    return () => {
      socket.off('urlCreated')
    }
  }, [socket, urls])

  const generateQRCode = async url => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
      }

      setLoading(true)
      setError('')

      // Make an HTTP request to generate the QR code for the URL
      const response = await axios.get(
        `http://localhost:4000/qrcode/create?link=${encodeURIComponent(url)}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Create a URL for the QR code image
      const qrCodeImg = URL.createObjectURL(response.data)
      setQRCodeImg(qrCodeImg) // Set the qrCodeImg state
      setQrcodeUrl(url) // Set the qrcodeUrl state

      // Show the QR code popup
      setShowQRCodePopup(true)

      setLoading(false)
    } catch (error) {
      console.error('Error generating QR code:', error)
      setError('Error generating QR code')
      setLoading(false)
    }
  }

  return (
    <div className='url-dashboard'>
      <h2>Your Shortened URLs:</h2>
      <ul>
        {urls &&
          urls.map(url => (
            <div key={url._id}>
              <li>
                <p>Long URL: {url.longUrl}</p>
                <p>
                  Short URL: <a href={url.shortUrl}>Visit</a>
                </p>
                <p>Expiration Date: {url.expirationDate}</p>
              </li>
              <button onClick={() => deleteUrl(url._id)}>Delete</button>
              <button onClick={() => generateQRCode(url.shortUrl)}>
                Generate QR Code
              </button>
            </div>
          ))}
      </ul>
      {showQRCodePopup && (
        <QRCodePopup
          qrCodeImg={qrCodeImg}
          onClose={() => setShowQRCodePopup(false)}
          url={qrcodeUrl}
        />
      )}
      {error && <p className='error'>{error}</p>}
      {message && <p className='message'>{message}</p>}
    </div>
  )
}

export default UrlDashBoard
