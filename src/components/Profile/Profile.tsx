import React, { useState } from "react";
import { _models } from "../../scripts/Models";
import './Profile.css';

export default function Profile(props:_models) {

    const [name, setName] = useState(props.auth.get_display_name());
    const [role, setRole] = useState(props.auth.get_role());

    const [viewInventory, setViewInventory] = useState(false);

    const signOut = async () => {

        let signed:boolean = await props.auth.signOut();
    
        if(signed) {
    
            let profile = document.getElementById("profile");
            let login = document.getElementById("login");
    
            if(profile && login) {
                profile.style.display = "none";
                login.style.display = "block"
            }
        }
    }

    let changed = setInterval(() => {
        if(props.auth.get_display_name() != name) {
            setName(props.auth.get_display_name());
            setRole(props.auth.get_role());
            clearInterval(changed);
        }
    }, 1000);

    return (
        <div id="profile">
            <h6 id="greet">Hi {name}!</h6>

            <button className="btn btn-light profile-btn">Profile</button>
            <button className="btn btn-light profile-btn">My Orders</button>

            <hr/>

            <button className="btn btn-light profile-btn">View Inventory</button>
            <button className="btn btn-light profile-btn">View Orders</button>
            <button className="btn btn-light profile-btn">View Users</button>

            <hr/>

            <button className="btn btn-light profile-btn" onClick={signOut}>Sign Out</button>
        </div>
    )
}