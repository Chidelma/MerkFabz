import React, { useState } from 'react';
import { _models } from '../../scripts/Models';
import './Header.css';

function toggleSide(view:boolean, setView:any) {

    let sideBar = document.getElementById("side-bar");
    let head = document.getElementById("head-o");

    if(sideBar && head && !view) {
        head.style.width = (window.innerWidth - 300) + "px";
        head.style.marginLeft = "300px";
        sideBar.style.marginLeft = "0px";
        setView(true);
    } 

    if(sideBar && head && view) {
        head.style.width = (window.innerWidth) + "px";
        head.style.marginLeft = "0px";
        sideBar.style.marginLeft = "-300px";
        setView(false);
    }
}

function toggleSearch(view:boolean, setView:any) {

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

function toggleCart(view:boolean, setView:any) {

    let cart = document.getElementById("cart");
    let head = document.getElementById("head-o");

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

    if(cart && head && !view) {
        head.style.width = (window.innerWidth - 300) + "px";
        head.style.marginRight = "300px";
        cart.style.marginRight = "0px";
        setView(true);
    } 

    if(cart && head && view) {
        head.style.width = (window.innerWidth) + "px";
        head.style.marginRight = "0px";
        cart.style.marginRight = "-300px";
        setView(false);
    }
}

function userInfo(props:_models) {

    if(!props.auth.isAuth()) {

        let login = document.getElementById("login");

        if(login) {
            login.style.display = "block";
        }

    } else if(props.auth.isAuth() && !props.auth.isVerified()) {

        let verify = document.getElementById("email-verify");

        if(verify) {
            verify.style.display = "block";
        }

    } else if(props.auth.isAuth() && props.auth.isVerified()) {

        let profile = document.getElementById("profile");

        if(profile) {
            profile.style.display = "block";
        }
    }
}

export default function Header(props:_models) {

    const [viewMenu, setViewMenu] = useState(false);

    const [viewSearch, setViewSearch] = useState(false);

    const [viewCart, setViewCart] = useState(false);

    return (
        <div id="head-o">

            <button className="btn btn-light btn-lg menu-bar" onClick={() => toggleSide(viewMenu, setViewMenu)}><i className={viewMenu ? "fa fa-arrow-left" : "fa fa-navicon"}></i></button>

            <img className="logo" src="./logo200.png" />

            <button className="btn btn-light btn-lg cart" onClick={() => toggleCart(viewCart, setViewCart)}><i className="fa fa-shopping-cart"></i></button>

            <button className="btn btn-light btn-lg user" onClick={() => userInfo(props)}><i className="fa fa-user"></i></button>

            <button id="search-btn" className="btn btn-light btn-lg search" onClick={() => toggleSearch(viewSearch, setViewSearch)}><i className="fa fa-search"></i></button>

            <input id="search-input" className="form-control form-control-lg" placeholder="Search" />
        </div>
    )
}