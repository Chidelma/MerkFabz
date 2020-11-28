import React, { useState } from 'react';
import './Register.css';
import { _user, _models, _cart, _role } from '../../scripts/Models';
import Auth from '../../scripts/Auth';
import Firestore from '../../scripts/Firestore';

interface _register {

    name:string,
    email:string,
    password:string,
    conPassword:string,

    setName: React.Dispatch<React.SetStateAction<string>>,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    setConPassword: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function login() {

    let login = document.getElementById("login");
    let register = document.getElementById("register");

    if(login && register) {
        login.style.display = "block";
        register.style.display = "none";
    }
}

async function add_to_store(auth:Auth, store:Firestore): Promise<boolean> {

    let all_added:boolean = false;

    if(auth.isAuth()) {

        let store_user:_user = {
            id : auth.get_id(),
            email: auth.get_email(),
            display_name: auth.get_display_name(),
            photo_url: auth.get_photo()
        }

        if(await store.addData("USERS", store_user)) {

            let store_cart:_cart = {
                id: auth.get_id(),
                item_ids: []
            }

            if(await store.addData("CARTS", store_cart)) {

                let store_role:_role = {

                    id: auth.get_id(),
        
                    can_add_item: false,
                    can_delete_item: false,
                    can_edit_item: false,
        
                    can_edit_role: false,
                    can_view_items: false,
                }

                if(await store.addData("ROLES", store_role))
                    all_added = true;
            }
        }
    }

    return all_added;
}

async function user_register(e:Event, props:_models, user:_register) {

    e.preventDefault();

    if(user.name !== "" && user.email !== "" && user.password !== "" && user.conPassword !== "") {

        if(user.password === user.conPassword) {

            user.setLoading(true);

            let signed:boolean = await props.auth.signUp(user.email, user.password);

            if(signed) {

                let changed:boolean = await props.auth.updateProfile(user.name, "https://api.hello-avatar.com/adorables/" + user.email);

                if(changed) {

                    props.auth.set_user();

                    let added:boolean = await add_to_store(props.auth, props.store);

                    if(added) {

                        let sent:boolean = await props.auth.sendEmailVerification();

                        if(sent) {

                            await props.auth.set_info();

                            let verify = document.getElementById("email-verify");
                            let register = document.getElementById("register");

                            if(verify && register) {

                                user.setLoading(false);
                                user.setName('');
                                user.setEmail('');
                                user.setPassword('');
                                user.setConPassword('');

                                verify.style.display = "block";
                                register.style.display = "none";
                            }
                        }
                    }
                }
            }
        }
    }
}

export default function Register(props:_models) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('')
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    let register:_register = {

        email: email,
        password: password,
        conPassword: conPassword,
        name: name,

        setName: setName,
        setPassword: setPassword,
        setConPassword: setConPassword,
        setLoading: setLoading,
        setEmail: setEmail
    }

    return (
        <form id="register">
            <button id="signin" className="btn btn-light btn-sm" type="button" onClick={login}><i className="fa fa-arrow-left"></i> Sign In</button>

            <input className="register-detail form-control" placeholder="Name" value={name} onChange={(e:any) => setName(e.target.value)} required/>

            <input className="register-detail form-control" type="email" placeholder="Email" value={email} onChange={(e:any) => setEmail(e.target.value)} required/>
            <input className="register-detail form-control" type="password" placeholder="Password" value={password} onChange={(e:any) => setPassword(e.target.value)} required/>
            <input className="register-detail form-control" type="password" placeholder="Confirm Password" value={conPassword} onChange={(e:any) => setConPassword(e.target.value)} onKeyDown={(e:any) => e.key === "Enter" && user_register(e, props, register)} required/>

            <button id="register-btn" className="btn btn-light" type="submit" onClick={(e:any) => user_register(e, props, register)} disabled={loading}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Register"}</button>
        </form>
    )
}