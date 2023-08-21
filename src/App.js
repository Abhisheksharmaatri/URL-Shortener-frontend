import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Import the pages
import Login from './pages/Login'
import Home from './pages/Home'
import Signup from './pages/Signup'
import AccountManagement from './pages/AccountManagement'

//Websockets for real time updates
import { io } from 'socket.io-client'
const socket = io('http://localhost:4000')
socket.on('connect_error', error => {
  console.error('WebSocket connection error:', error)
})

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home socket={socket} />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path='/account'
          element={<AccountManagement socket={socket} />}
        />
      </Routes>
    </Router>
  )
}

export default App
