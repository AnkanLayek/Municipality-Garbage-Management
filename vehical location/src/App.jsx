import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import Home from './pages/Home'

const isAdmin = 'flase';

export const socket = io('http://localhost:3000',{
  query: {isAdmin},
});

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/home' element={< Home />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
