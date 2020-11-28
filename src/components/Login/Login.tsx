import React, { useState } from 'react';
import './Login.css';
import { _user, _models } from '../../scripts/Models';

interface _login {
    email: string,
    password: string,

    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function register() {

    let login = document.getElementById("login");
    let register = document.getElementById("register");

    if(login && register) {
        login.style.display = "none";
        register.style.display = "block";
    }
}

async function user_login(e:Event, props:_models, user_login:_login) {

    e.preventDefault();

    if(user_login.email !== "" && user_login.password !== "") {

        user_login.setLoading(true);

        if(await props.auth.signIn(user_login.email, user_login.password)) {

            props.auth.set_user();

            await props.auth.set_info();

            let login = document.getElementById("login");
            let profile = document.getElementById("profile");

            if(login && profile) {

                user_login.setEmail('');
                user_login.setPassword('');
                user_login.setLoading(false);

                login.style.display = "none";
                profile.style.display = "block"
            }

        }
    }
}

export default function Login(props:_models) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    let login:_login = {

        email: email,
        password: password,

        setEmail: setEmail,
        setPassword: setPassword,
        setLoading: setLoading
    }

    return (
        <form id="login">
            <button id="create" className="btn btn-light btn-sm" type="button" onClick={register}>Create Account <i className="fa fa-arrow-right"></i></button>

            <input className="login-detail form-control" type="email" placeholder="Email" value={email} onChange={(e:any) => setEmail(e.target.value)} required/>
            <input className="login-detail form-control" type="password" placeholder="Password" value={password} onChange={(e:any) => setPassword(e.target.value)} onKeyDown={(e:any) => e.key === "Enter" && user_login(e, props, login)} required/>

            <button id="login-btn" className="btn btn-light" type="submit" onClick={(e:any) => user_login(e, props, login)} disabled={loading}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Login"}</button>
        </form>
    )
}