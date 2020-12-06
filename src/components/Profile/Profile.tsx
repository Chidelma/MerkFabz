import React, { useState } from "react";
import { _models } from "../../scripts/Models";
import './Profile.css';
import { Link } from "react-router-dom";
import { auth } from "../../scripts/Init";

export default function Profile() {

    const [userAuth, setUserAuth] = useState(auth.get());

    const signOut = async () => {

        let signed:boolean = await userAuth.signOut();
    
        if(signed)
            auth.set(userAuth);
    }

    return (
        <>
            <div id="profile">
                <h6 id="greet">Hi {userAuth.get_user().get_name()}!</h6>

                <button className="btn btn-light profile-btn">Profile</button>
                <button className="btn btn-light profile-btn">My Orders</button>

                {userAuth.get_user().get_role().can_view_items() && 
                    <Link to="/products"><button className="btn btn-light profile-btn">View Products</button></Link>
                }
                
                {userAuth.get_user().get_role().can_view_orders() &&
                    <Link to="/orders"><button className="btn btn-light profile-btn">View Orders</button></Link>
                }

                {userAuth.get_user().get_role().can_view_users() &&
                    <Link to="/users"><button className="btn btn-light profile-btn">View Users</button></Link>
                }

                <hr/>

                <button className="btn btn-light profile-btn" onClick={() => signOut()}>Sign Out</button>
            </div>
        </>
    )
}