import React, { useState } from 'react';
import { _models } from '../../scripts/Models';
import './Header.css';

function toggleSide(view:boolean, setView:React.Dispatch<React.SetStateAction<boolean>>) {

    let sideBar = document.getElementById("side-bar");
    let head = document.getElementById("head-o");

    if(sideBar && head && !view) {
        sideBar.style.marginLeft = "0px";
        setView(true);
    } 

    if(sideBar && head && view) {
        sideBar.style.marginLeft = "-20%";
        setView(false);
    }
}

function toggleSearch(view:boolean, setView:React.Dispatch<React.SetStateAction<boolean>>) {

    let searchInput = document.getElementById("search-input");
    let searchBtn = document.getElementById("search-btn");

    if(searchBtn && searchInput && !view) {
        searchBtn.style.display = "none";
        searchInput.style.display = "block";
        setView(true);
    }

    if(searchBtn && searchInput && view) {
        searchBtn.style.display = "block";
        searchInput.style.display = "none";
        setView(false);
    }
}

function toggleCart(view:boolean, setView:React.Dispatch<React.SetStateAction<boolean>>) {

    let cart = document.getElementById("cart");

    let profile = document.getElementById("profile");
    let login = document.getElementById("login");
    let register = document.getElementById("register");
    let email = document.getElementById("email-verify");

    if(profile) 
        profile.style.display = "none";

    if(login)
        login.style.display = "none";

    if(register)
        register.style.display = "none";

    if(email)
        email.style.display = "none";

    if(cart && !view) {
        cart.style.marginRight = "0px";
        setView(true);
    } 

    if(cart && view) {
        cart.style.marginRight = "-20%";
        setView(false);
    }
}

function userInfo(props:_models) {

    let cart = document.getElementById("cart");
    let register = document.getElementById("register");

    if(cart)
        cart.style.marginRight = "-20%";

    if(register)
        register.style.display = "none";

    if(!props.auth.isAuth()) {

        let login = document.getElementById("login");

        if(login) {
            if(login.style.display === "block") {
                login.style.display = "none";
            } else {
                login.style.display = "block";
            }
        }

    } else if(props.auth.isAuth() && !props.auth.isVerified()) {

        let verify = document.getElementById("email-verify");

        if(verify) {
            if(verify.style.display === "block") {
                verify.style.display = "none";
            } else {
                verify.style.display = "block";
            }
        }

    } else if(props.auth.isAuth() && props.auth.isVerified()) {

        let profile = document.getElementById("profile");

        if(profile) {
            if(profile.style.display === "block") {
                profile.style.display = "none";
            } else {
                profile.style.display = "block";
            }
        }
    }
}

export default function Header(props:_models) {

    const [viewMenu, setViewMenu] = useState(false);

    const [viewSearch, setViewSearch] = useState(false);

    const [viewCart, setViewCart] = useState(false);

    return (
        <div id="head-o">

            <button className="btn btn-light btn-lg menu-bar" onClick={() => toggleSide(viewMenu, setViewMenu)}><i className="fa fa-navicon"></i></button>

            <img className="logo" src="./logo200.png" alt="logo" />

            <button className="btn btn-light btn-lg cart" onClick={() => toggleCart(viewCart, setViewCart)}><i className="fa fa-shopping-cart"></i></button>

            <button className="btn btn-light btn-lg user" onClick={() => userInfo(props)}><i className="fa fa-user"></i></button>

            <button id="search-btn" className="btn btn-light btn-lg search" onClick={() => toggleSearch(viewSearch, setViewSearch)}><i className="fa fa-search"></i></button>

            <input id="search-input" className="form-control form-control-lg" placeholder="Search" />
        </div>
    )
}