import React, { useState } from 'react';
import './Login.css';
import './Register.css';
import './Email.css';
import { _cart, _models, _role, _user } from '../../scripts/Models';
import Profile from '../Profile/Profile';

export default function Entry(props:_models) {

    const [viewLogin, setViewLogin] = useState(true);
    const [viewRegister, setViewRegister] = useState(false);
    const [viewVerify, setViewVerify] = useState(false);

    const Login = () => {

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);

        const user_login = async (e:Event) => {

            e.preventDefault();
    
            if(email !== "" && password !== "") {
    
                setLoading(true);
    
                if(await props.auth.signIn(email, password)) {
    
                    props.auth.set_user();
    
                    await props.auth.set_info();
    
                    setEmail('');
                    setPassword('');
                    setLoading(false);
                    setViewLogin(false);
                }
            }
        }

        const toggleRegister = () => {

            setViewLogin(false);
            setViewRegister(true);
        }

        return (
            <form id="login">
                <button id="create" className="btn btn-light btn-sm" type="button" onClick={toggleRegister}>Create Account <i className="fa fa-arrow-right"></i></button>

                <input className="login-detail form-control" type="email" placeholder="Email" value={email} onChange={(e:any) => setEmail(e.target.value)} required/>
                <input className="login-detail form-control" type="password" placeholder="Password" value={password} onChange={(e:any) => setPassword(e.target.value)} onKeyDown={(e:any) => e.key === "Enter" && user_login(e)} required/>

                <button id="login-btn" className="btn btn-light" type="submit" onClick={(e:any) => user_login(e)} disabled={loading}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Login"}</button>
            </form>
        )
    }

    const Register = () => {

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [conPassword, setConPassword] = useState('');
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [loading, setLoading] = useState(false);

        const add_to_store = async (): Promise<boolean> => {

            let all_added:boolean = false;
    
            if(props.auth.isAuth()) {
    
                let store_user:_user = {
                    id : props.auth.get_id(),
                    email: props.auth.get_email(),
                    display_name: props.auth.get_display_name(),
                    photo_url: props.auth.get_photo()
                }
    
                if(await props.store.addData("USERS", store_user)) {
    
                    let store_cart:_cart = {
                        id: props.auth.get_id(),
                        items: [] 
                    }
    
                    if(await props.store.addData("CARTS", store_cart)) {
    
                        let store_role:_role = {
    
                            id: props.auth.get_id(),
                
                            can_add_item: false,
                            can_delete_item: false,
                            can_edit_item: false,
                
                            can_edit_role: false,
                            can_view_items: false,
                            can_view_orders: false,
                            can_view_users: false
                        }
    
                        if(await props.store.addData("ROLES", store_role))
                            all_added = true;
                    }
                }
            }
    
            return all_added;
        }

        const user_register = async (e:Event) => {

            e.preventDefault();
    
            if(firstName !== "" && lastName !== "" && email !== "" && password !== "" && conPassword !== "") {
    
                if(password === conPassword) {
    
                    setLoading(true);
    
                    let signed:boolean = await props.auth.signUp(email, password);
    
                    if(signed) {
    
                        let changed:boolean = await props.auth.updateProfile(firstName + ' ' + lastName, "https://api.hello-avatar.com/adorables/" + email);
    
                        if(changed) {
    
                            props.auth.set_user();
    
                            let added:boolean = await add_to_store();
    
                            if(added) {
    
                                let sent:boolean = await props.auth.sendEmailVerification();
    
                                if(sent) {
    
                                    await props.auth.set_info();
    
                                    setLoading(false);
                                    setFirstName('');
                                    setLastName('');
                                    setEmail('');
                                    setPassword('');
                                    setConPassword('');

                                    setViewRegister(false);
                                    setViewVerify(true);
                                }
                            }
                        }
                    }
                }
            }
        }

        const toggleLogin = () => {
            setViewRegister(false);
            setViewLogin(true);
        }

        return (

            <form id="register">
                <button id="signin" className="btn btn-light btn-sm" type="button" onClick={toggleLogin}><i className="fa fa-arrow-left"></i> Sign In</button>

                <input className="register-detail form-control" placeholder="First Name" value={firstName} onChange={(e:any) => setFirstName(e.target.value)} required/>

                <input className="register-detail form-control" placeholder="Last Name" value={lastName} onChange={(e:any) => setLastName(e.target.value)} required/>

                <input className="register-detail form-control" type="email" placeholder="Email" value={email} onChange={(e:any) => setEmail(e.target.value)} required/>
                <input className="register-detail form-control" type="password" placeholder="Password" value={password} onChange={(e:any) => setPassword(e.target.value)} required/>
                <input className="register-detail form-control" type="password" placeholder="Confirm Password" value={conPassword} onChange={(e:any) => setConPassword(e.target.value)} onKeyDown={(e:any) => e.key === "Enter" && user_register(e)} required/>

                <button id="register-btn" className="btn btn-light" type="submit" onClick={(e:any) => user_register(e)} disabled={loading}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Register"}</button>
            </form>
        )
    }

    const Verify = () => {

        const [loading, setLoading] = useState(false);

        const resend = async () => {

            setLoading(true);
            await props.auth.sendEmailVerification();
            setLoading(false);
        }

        const toggleLogin = () => {

            setViewVerify(false);
            setViewLogin(true);
        }

        return (
            <div id="email-verify">
                <p id="verify-msg">Please Check Your Email For Verification</p>

                <button className="btn btn-light resend-btn" onClick={resend} disabled={loading}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Resend"}</button>

                <button className="btn btn-light login-btn" onClick={toggleLogin}>Login</button>
            </div>
        )
    }

    return props.auth.isAuth() ? (
        <>
            {<Profile {...props}/>}
        </>
    ) : (
        <>
            {viewLogin && <Login/>}
            {viewRegister && <Register/>}
            {viewVerify && <Verify/>}
        </>
    )
}