import React, { useState } from 'react';
import Auth from '../../scripts/Auth';
import { _models } from '../../scripts/Models';
import './Email.css';

function showLogin() {

    let login = document.getElementById("login");
    let verify = document.getElementById("email-verify");

    if(login && verify) {
        verify.style.display = "none";
        login.style.display = "block";
    }
}

async function resend(auth:Auth, setLoading:any) {

    setLoading(true);
    await auth.sendEmailVerification();
    setLoading(false);
}

export default function Email(props:_models) {

    const [loading, setLoading] = useState(false);

    return (
        <div id="email-verify">
            <p id="verify-msg">Please Check Your Email For Verification</p>

            <button className="btn btn-light resend-btn" onClick={() => resend(props.auth, setLoading)} disabled={loading}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Resend"}</button>

            <button className="btn btn-light login-btn" onClick={showLogin}>Login</button>
        </div>
    )
}