import React, { useState } from "react";
import { _models } from "../../scripts/Models";
import './Profile.css';
import { Link } from "react-router-dom";

export default function Profile(props:_models) {

    const [name, setName] = useState(props.auth.get_display_name());

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
        if(props.auth.get_display_name() !== name) {
            setName(props.auth.get_display_name());
            clearInterval(changed);
        }
    }, 1000);

    return (
        <>
            <div id="profile">
                <h6 id="greet">Hi {name}!</h6>

                <button className="btn btn-light profile-btn">Profile</button>
                <button className="btn btn-light profile-btn">My Orders</button>

                {props.auth.get_role().can_view_items() && 
                    <Link to="/products"><button className="btn btn-light profile-btn">View Products</button></Link>
                }
                
                {props.auth.get_role().can_view_orders() &&
                    <Link to="/orders"><button className="btn btn-light profile-btn">View Orders</button></Link>
                }

                {props.auth.get_role().can_view_users() &&
                    <Link to="/users"><button className="btn btn-light profile-btn">View Users</button></Link>
                }

                <hr/>

                <button className="btn btn-light profile-btn" onClick={signOut}>Sign Out</button>
            </div>
        </>
    )
}