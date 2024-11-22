import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import TrackMap from './pages/TrackMap'
import Dashboard from './pages/Dashboard'
import SlideShow from './pages/SlideShow'
import Assignment from './pages/Assignment'
import LoginPage from './pages/Login'
import Dashboard1 from './pages/Dashboard1'

const isAdmin = 'true'

export const socket = io("http://localhost:3000",{
  query: {isAdmin}
});

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={< LoginPage />} />
          <Route path='/' element={< Dashboard />} />
          <Route path='/dashboard' element={< Dashboard />} />
          <Route path='/dashboard1' element={< Dashboard1 />} />
          <Route path='/track' element={< TrackMap />} />
          <Route path='/assign' element={<Assignment />} />

          <Route path='/slideShow' element={< SlideShow />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
