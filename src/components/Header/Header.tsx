import React, { useState } from 'react';
import { _models } from '../../scripts/Models';
import './Header.css';
import Entry from '../Entry/Entry';
import Cart from '../Cart/Cart';
import SideBar from '../SideBar/SideBar';
import { Link } from 'react-router-dom';

export default function Header(props:_models) {

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

                <button className="btn btn-light btn-lg cart" onClick={toggleCart}><i className="fa fa-shopping-cart"></i> {props.auth.get_cart().length > 0 ? <span className="badge badge-dark">{props.auth.get_cart().length > 0}</span> : <span></span>}</button>

                <button className="btn btn-light btn-lg user" onClick={toggleEntry}><i className="fa fa-user"></i></button>
            </div>

            {viewEntry && <Entry {...props}/>}
            {viewCart && <Cart {...props}/>}
            {viewMenu && <SideBar {...props}/>}
        </>
    )
}