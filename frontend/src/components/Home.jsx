import React from "react";
import '../styles/Home.css';
import {Link} from 'react-router-dom'
function Home(){

    return (
        <div className="Base">
            
            <h1> Welcome to Garbage Management System</h1>
            <p>Its a Garbage Management system</p>
            <p>for the people of municipal area </p>

            <Link to="/userAuth">Authorize User</Link>     
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
            
        </div>

    );}
export default Home;