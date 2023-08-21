import React, { useRef, useEffect } from 'react'

function QRCodePopup ({ qrCodeImg, onClose, url }) {
  const popupRef = useRef(null)

  // Close the popup when clicking outside the QR code area
  const handleOverlayClick = e => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose()
    }
  }

  // Attach a click event listener to the document when the component mounts
  useEffect(() => {
    document.addEventListener('click', handleOverlayClick)
    return () => {
      document.removeEventListener('click', handleOverlayClick)
    }
  }, [])

  return (
    <div className='qrcode-popup'>
      <button className='close-button' onClick={onClose}>
        Close
      </button>
      <div className='qrcode-content' ref={popupRef}>
        <img src={qrCodeImg} alt='QR Code' />
        <p>URL: {url}</p>
      </div>
    </div>
  )
}

export default QRCodePopup
