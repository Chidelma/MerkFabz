import React, { useEffect, useState } from "react";
import Auth from "../../scripts/Auth";
import { _models } from "../../scripts/Models";
import './Profile.css';

async function signOut(auth:Auth) {

    let signed:boolean = await auth.signOut();

    if(signed) {

        let profile = document.getElementById("profile");
        let login = document.getElementById("login");

        if(profile && login) {
            profile.style.display = "none";
            login.style.display = "block"
        }
    }
}

export default function Profile(props:_models) {

    const [name, setName] = useState(props.auth.get_display_name());

    let changed = setInterval(() => {
        if(props.auth.get_display_name() !== name) {
            setName(props.auth.get_display_name());
            clearInterval(changed);
        }
    }, 1000);

    const closeProfile = () => {

        let close = document.getElementById("profile");
        

        if(close) {
            close.style.display = "none";
        }
    }

    return (
        <div id="profile">

            <button className="btn btn-sm btn-danger" onClick={closeProfile}><i className="fa fa-close"></i></button>

            <h6 id="greet">Hi {name}!</h6>

            <button className="btn btn-light profile-btn">Profile</button>
            <button className="btn btn-light profile-btn">My Orders</button>
            <button className="btn btn-light profile-btn" onClick={() => signOut(props.auth)}>Sign Out</button>
        </div>
    )
}