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
import AddPath from './pages/AddPath'
const backendURL = import.meta.env.VITE_BACKEND_URL

const isAdmin = 'true'

export const socket = io(`${backendURL}`,{
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
          <Route path='/addPath' element={<AddPath />} />

          <Route path='/slideShow' element={< SlideShow />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
