import { useState } from "react";
import React from "react";
import {Navigate, useNavigate} from 'react-router-dom'


function LoginPage() {
    const [Username, setUsername] = useState('')
    const [Password, setPassword] = useState('')
    const [UsernameErr, setUsernameErr] = useState('')
    const [PasswordErr, setPasswordErr] = useState('')
    const navigate=useNavigate();

    const onButtonclick = ({onLogin}) => {
        setUsernameErr('')
        setPasswordErr('')
        // if ('' === Username) {
        //     setUsernameErr("Enter your UserName!")
        //     return
        // }
        

        // if (!/^[a-zA-Z][\w-]{2,14}$/.test(Username)) {
        //     setUsernameErr("Enter a valid Username!")
        // }
        // if ('' === Password) {
        //     setPasswordErr('Please enter a password')
        //     return
        // }
        // if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#!$])[A-Za-z\d@#!$]{8,}$/.test(Password)) {
        //     setPasswordErr('Password must be at least 8 characters long, contain at least one letter, one number, and one special character (@, #, !, or $)');
        //     return;
        // }
        if(Username =='admin' && Password == '1234')
        {
            navigate('/dashboard')
            
        }
        // else{
        //     setPasswordErr('invalid credentials!!')
        // }
    }
    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <h1>Login Here</h1>
            </div>
            <div className={"inputContainer"}>
                <input value={Username}
                    placeholder=" Username"
                    type="text"
                    onChange={(ev) => setUsername(ev.target.value)}
                    className={'inputBox'}
                />
            </div>
            <label className={"errorlabel"} >{UsernameErr}</label>
            <div className={"inputContainer"}>
                <input value={Password}
                    type="password"
                    placeholder=" Password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={'inputBox'}
                />
                <label className={"errorlabel"} >{PasswordErr}</label>
            </div>

            <br />
            <div className={'inputContainer'}>
                <input className={'inputButton'} type="button" onClick={onButtonclick} value={'Log in'} />
            </div>
        </div>
    )
}
export default LoginPage;