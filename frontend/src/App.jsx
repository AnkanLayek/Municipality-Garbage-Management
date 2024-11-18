import React,{ useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home.jsx'
// import { BrowserRouter as Route, Router, Routes } from 'react-router-dom'(this is wrong method)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './components/LoginPage.jsx'
import Dashboard from './components/Dashboard.jsx'

function App() {
  const [isLoggedin, setIsLoggedin] = useState(false)

  const handleLogin = (status) => {
    setIsLoggedin(status);  
  };


  const handleLogout = () => {
    setIsLoggedin(false);
  };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginPage onLogin={setIsLoggedin}/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>

      </Routes>
    </Router> 
  )
}

export default App;
