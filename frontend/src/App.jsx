import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import TrackMap from './pages/TrackMap'

const socket = io("http://localhost:3000");

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/track' element={< TrackMap />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
