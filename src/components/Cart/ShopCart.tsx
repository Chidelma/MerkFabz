import React, { useState } from 'react';
import './ShopCart.css';
import { auth, gross, total, tax, store } from "../../scripts/Init";
import Cart from "../../scripts/Cart";
import { _cart } from '../../scripts/Models';

export default function ShopCart() {

    const [userAuth, setUserAuth] = useState(auth.get());
    const [userCart, setUserCart] = useState(userAuth.get_user().get_cart());
    const [userStore] = useState(store.get());

    const calcTotal = (): number => {

        let totalPrice:number = 0;

        userCart.forEach((cart) => {

            let price = cart.get_item().get_sale_price();

            if(price) {
                totalPrice += price * cart.get_quantity();
            } else {
                totalPrice += cart.get_item().get_price() * cart.get_quantity();
            }
        });

        total.set(totalPrice);

        return totalPrice;;
    }

    const increment = async (cart:Cart, idx:number) => {

        userCart[idx].set_quanity(cart.get_quantity() + 1);

        setUserCart(userCart);

        userAuth.get_user().set_cart(userCart);

        if(userAuth.isAuth()) {

            let cart_item:_cart = {
                id: userAuth.get_user().get_id(),
                items: userAuth.get_user().get_cart_prim()
            }

            await userStore.addData("CARTS", cart_item);
        }

        setUserAuth(userAuth);

        auth.set(userAuth);
    }

    const decrement = async (cart:Cart, idx:number) => {

        userCart[idx].set_quanity(cart.get_quantity() - 1);

        setUserCart(userCart);

        userAuth.get_user().set_cart(userCart);

        if(userAuth.isAuth()) {

            let cart_item:_cart = {
                id: userAuth.get_user().get_id(),
                items: userAuth.get_user().get_cart_prim()
            }

            await userStore.addData("CARTS", cart_item);
        }

        setUserAuth(userAuth);

        auth.set(userAuth);
    }

    const removeItem = async (idx:number) => {

        userCart.splice(idx, 1);

        setUserCart(userCart);

        userAuth.get_user().set_cart(userCart);

        if(userAuth.isAuth()) {

            let cart_item:_cart = {
                id: userAuth.get_user().get_id(),
                items: userAuth.get_user().get_cart_prim()
            }

            await userStore.addData("CARTS", cart_item);
        }

        setUserAuth(userAuth);

        auth.set(userAuth);
    }

    const calcTax = ():number => {

        let num:number = Number((calcTotal() * 0.13).toFixed(2));

        tax.set(num);

        return num;
    }

    const calcGross = ():number => {

        gross.set(Number((calcTotal() + calcTax()).toFixed(2)))

        return Number((calcTotal() + calcTax()).toFixed(2));
    }

    return (
        <div id="cart">
            {userCart.length === 0 && <h5 id="empty">Emtpy Cart</h5>}
            {userCart.length > 0 && 
                <>
                    <button className="btn btn-light">CheckOut</button>

                    {userCart.map((cart, idx) => (
                        <div className="cart-item" key={Math.random()}>
                            <img className="cart-img" src={cart.get_item().get_photos()[0]} />
                            <h5 className="cart-name">{cart.get_item().get_name()} - {cart.get_item().get_tags().map((tag) => (<span key={Math.random()}>{tag} </span>))}</h5>
                            {cart.get_item().get_sale_price() && <h6 className="cart-price">${cart.get_item().get_sale_price()} CAD</h6>}
                            {cart.get_item().get_sale_price() == null && <h6 className="cart-price">${cart.get_item().get_price()} CAD</h6>}
                            <div className="counter">
                                <button className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}><i className="fa fa-trash"></i></button>
                                <button className="btn btn-light btn-sm minus" onClick={() => decrement(cart, idx)} disabled={cart.get_quantity() === cart.get_item().get_stock()}><i className="fa fa-plus"></i></button>
                                <span className="count">{cart.get_quantity()}</span>
                                <button className="btn btn-light btn-sm plus" onClick={() => increment(cart, idx)} disabled={cart.get_quantity() <= 1}><i className="fa fa-minus"></i></button>
                            </div>
                        </div>
                    ))}

                    <div id="calcs">
                        <h6 className="price-calc">Total: ${calcTotal()} CAD</h6>
                        <h6 className="price-calc">Tax: ${calcTax()} CAD</h6>
                        <hr/>
                        <h6 className="price-calc">Gross Total: ${calcGross()} CAD</h6>
                    </div>
                </>
            }
            
        </div>
    )
}