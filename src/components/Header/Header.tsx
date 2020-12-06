import React, { useState } from 'react';
import { _models } from '../../scripts/Models';
import './Header.css';
import Entry from '../Entry/Entry';
import ShopCart from '../Cart/ShopCart';
import SideBar from '../SideBar/SideBar';
import { Link } from 'react-router-dom';
import { auth } from '../../scripts/Init';

export default function Header() {

    const [viewMenu, setViewMenu] = useState(false);
    const [viewCart, setViewCart] = useState(false);
    const [viewEntry, setViewEntry] = useState(false);

    const toggleSide = () => {

        setViewCart(false);
        setViewEntry(false);

        setViewMenu(view => view = !view);
    }

    const toggleCart = () => {

        setViewMenu(false);
        setViewEntry(false);

        setViewCart(view => view = !view);
    }

    const toggleEntry = () => {

        setViewCart(false);
        setViewMenu(false);
    
        setViewEntry(view => view = !view);
    }

    return (
        <>
            <div id="head-o">
                <button className="btn btn-light btn-lg menu-bar" onClick={toggleSide}><i className="fa fa-navicon"></i></button>

                <Link to="/"><img className="logo" src="./logo200.png" alt="logo" /></Link>

                <button className="btn btn-light btn-lg cart" onClick={toggleCart}><i className="fa fa-shopping-cart"></i> {auth.get().get_user().get_cart().length > 0 ? <span className="badge badge-dark">{auth.get().get_user().get_cart().length > 0}</span> : <span></span>}</button>

                <button className="btn btn-light btn-lg user" onClick={toggleEntry}><i className="fa fa-user"></i></button>
            </div>

            {viewEntry && <Entry/>}
            {viewCart && <ShopCart/>}
            {viewMenu && <SideBar/>}
        </>
    )
}