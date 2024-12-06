import { useState } from "react";
import React from "react";
import {Navigate, useNavigate} from 'react-router-dom'
// import NavBarComponent from "../components/NavBarComponent";
const backendURL = import.meta.env.VITE_BACKEND_URL

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formErr, setFormErr] = useState('');
    const navigate = useNavigate();

    const handleLogIn = async (e) => {
        e.preventDefault();
        if ('' === username) {
            setFormErr("Enter your username!")
            return
        }
        // if (!/^[a-zA-Z][\w-]{2,14}$/.test(username)) {
        //     setUsernameErr("Enter a valid username!")
        // }
        if ('' === password) {
            setFormErr('Please enter a password')
            return
        }
        // if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#!$])[A-Za-z\d@#!$]{8,}$/.test(password)) {
        //     setPasswordErr('Password must be at least 8 characters long, contain at least one letter, one number, and one special character (@, #, !, or $)');
        //     return;
        // }
        // if(username =='admin' && password == '1234')
        // {
        //     setFormErr("")
        //     navigate('/dashboard')
            
        // }
        // else{
        //     setFormErr('invalid credentials!!')
        // }
        const response = await fetch(`${backendURL}/driver/login`, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({username, password})
        })
        const data = await response.json();
        if(response.ok){
            setFormErr('');
            localStorage.setItem("token",
                JSON.stringify(
                    {
                        fullName: data.user.fullName,
                        username: data.user.username,
                        email: data.user.email,
                        // isAdmin: data.user.isAdmin
                    })
                );
            navigate('/');
        }
        else {
            setFormErr(data.message);
        }
    }
    return (
        <>
            {/* <div className='fixed w-full top-0 z-10'>
                <NavBarComponent />
            </div> */}
            <div className="w-full mt-16 px-5 py-3 flex justify-center items-center" style={{height: "calc(100vh - 64px)"}}>
                <div className="loginContainer flex flex-col items-center p-5" style={{background: "linear-gradient(45deg, #e6f5e6, #b9ebb9)"}}>
                    <h1 className="text-3xl mb-10">LogIn</h1>
                    <form className="flex flex-col items-center"
                        onSubmit={handleLogIn}>
                        <div className="inputsContainer flex flex-col gap-3">
                            <div className="flex flex-col">
                                <label htmlFor="username">Username</label>
                                <input type="text" id='username' name="username"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password">Password</label>
                                <input type="password" id='password' name="password"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        {formErr != ''
                            ? <div className="mt-3 text-red-600">{formErr}</div>
                            : <></>
                        }
                        <div className="inline-block w-32 mt-7 bg-green-700 py-2 text-lg font-medium text-white rounded-full text-center cursor-pointer">
                            <input type="submit" value={'LogIn'} />
                        </div>
                    </form>
                </div>
            </div>
        </>
        
    )
}

export default LoginPage;