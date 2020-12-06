import React, { useState } from 'react';
import './Login.css';
import './Register.css';
import './Email.css';
import { _cart, _models, _role, _user } from '../../scripts/Models';
import Profile from '../Profile/Profile';
import { auth, setAllUsers, store } from '../../scripts/Init';

export default function Entry() {

    const [viewLogin, setViewLogin] = useState(true);
    const [viewRegister, setViewRegister] = useState(false);
    const [viewVerify, setViewVerify] = useState(false);
    const [loading, setLoading] = useState(false);

    const [userAuth] = useState(auth.get());
    const [userStore] = useState(store.get());

    const Login = () => {

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const user_login = async (e:Event) => {

            e.preventDefault();
    
            if(email !== "" && password !== "") {
    
                setLoading(true);
    
                if(await userAuth.signIn(email, password)) {

                    auth.set(userAuth);

                    if(userAuth.get_user().get_role().can_view_users())
                        await setAllUsers();
    
                    setEmail('');
                    setPassword('');
                    setLoading(false);
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

        const add_to_store = async (): Promise<boolean> => {

            let all_added:boolean = false;
    
            if(userAuth.isAuth()) {
    
                if(await userStore.addData("USERS", userAuth.get_user().get_user_prim())) {
    
                    let store_cart:_cart = {
                        id: userAuth.get_user().get_id(),
                        items: [] 
                    }
    
                    if(await userStore.addData("CARTS", store_cart)) {
    
                        if(await userStore.addData("ROLES", userAuth.get_user().get_role().get_role_prime()))
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
    
                    let signed:boolean = await userAuth.signUp(email, password);
    
                    if(signed) {
    
                        let changed:boolean = await userAuth.updateProfile(firstName + ' ' + lastName, "https://api.hello-avatar.com/adorables/" + email);
    
                        if(changed) {
    
                            let added:boolean = await add_to_store();
    
                            if(added) {
    
                                let sent:boolean = await userAuth.sendEmailVerification();
    
                                if(sent) {
    
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

        const resend = async () => {

            setLoading(true);
            await userAuth.sendEmailVerification();
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

    return auth.get().isAuth() && auth.get().isVerified() ? (
        <Profile/>
    ) : (
        <>
            {viewLogin && <Login/>}
            {viewRegister && <Register/>}
            {viewVerify && <Verify/>}
        </>
    )
}