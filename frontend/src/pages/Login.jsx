import { useState } from "react";
import React from "react";
import {Navigate, useNavigate} from 'react-router-dom'
import NavBarComponent from "../components/NavBarComponent";
import loginBg from "../assets/loginBG.png"
const backendURL = import.meta.env.VITE_BACKEND_URL

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErr, setFormErr] = useState('');
    const navigate = useNavigate();

    const handleLogIn = async (e) => {
        e.preventDefault();
        if ('' === email) {
            setFormErr("Enter your email!")
            return
        }
        // if (!/^[a-zA-Z][\w-]{2,14}$/.test(email)) {
        //     setEmailErr("Enter a valid email!")
        // }
        if ('' === password) {
            setFormErr('Please enter a password')
            return
        }
        // if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#!$])[A-Za-z\d@#!$]{8,}$/.test(password)) {
        //     setPasswordErr('Password must be at least 8 characters long, contain at least one letter, one number, and one special character (@, #, !, or $)');
        //     return;
        // }
        // if(email =='admin' && password == '1234')
        // {
        //     setFormErr("")
        //     navigate('/dashboard')
            
        // }
        // else{
        //     setFormErr('invalid credentials!!')
        // }
        const response = await fetch(`${backendURL}/admin/login`, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({email, password})
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
                        isAdmin: data.user.isAdmin
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
            <div className='fixed w-full top-0 z-10'>
                <NavBarComponent />
            </div>
            <div
                className="loginPageMain w-full mt-16 px-5 py-3 flex justify-end items-center relative"
                style={{height: "calc(100vh - 64px)", backgroundImage: `url(${loginBg})`, backgroundSize: "cover", backgroundPosition: "center"}}
            >
                <div
                    className="loginContainer absolute p-5 rounded-lg flex flex-col items-center backdrop-blur-lg"
                    style={{background: "linear-gradient(135deg, rgba(245,252,245,0.3), rgba(255,255,255,0.2)", boxShadow: '2px 2px 7px 5px rgba(0,0,0,0.2)'}}
                >
                    <h1 className="text-3xl mb-10">LogIn</h1>
                    <form className="flex flex-col items-center"
                        onSubmit={handleLogIn}>
                        <div className="inputsContainer w-80 flex flex-col gap-3">
                            <div className="flex flex-col">
                                <label htmlFor="email">Email</label>
                                <input type="email" id='email' name="email"
                                    className="px-3 py-2 rounded-md backdrop-blur-lg"
                                    style={{backgroundColor: "rgba(255,255,255,0.4)"}}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password">Password</label>
                                <input type="password" id='password' name="password"
                                    className="px-3 py-2 rounded-md backdrop-blur-lg"
                                    style={{backgroundColor: "rgba(255,255,255,0.4)"}}
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