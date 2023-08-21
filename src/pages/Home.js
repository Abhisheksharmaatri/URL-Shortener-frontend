import React, { useEffect, useState } from 'react'
import '../styles/Home.css'

// Add the User component
import UserProfile from '../components/user/UserProfile'

//import create url component
import CreateUrl from '../components/url/CreateUrl'

function Home (props) {
  return (
    <div className='home'>
      <UserProfile socket={props.socket} />
      <CreateUrl socket={props.socket} />
    </div>
  )
}

export default Home
