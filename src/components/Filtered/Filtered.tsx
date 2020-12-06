import React, { useEffect, useState } from 'react';
import './Filtered.css';
import { filtered, products, auth, store } from "../../scripts/Init";
import { allCategories, allSizes } from "../../scripts/Shares";
import Item from '../../scripts/Item';
import Cart from '../../scripts/Cart';
import { _cart, _cart_item, _firestore, _search } from '../../scripts/Models';

interface items { items:Item[] }

export default function Filtered() {

    const [userAuth, setUserAuth] = useState(auth.get());
    const [userFiltered, setUserFiltered] = useState(filtered.get());
    const [allProducts, setAllProducts] = useState(products.get());
    const [userStore] = useState(store.get());
    const [loading, setLoading] = useState(true);

    let catOptions:string[] = allCategories;
    let sizeOptions:string[] = allSizes;

    useEffect(() => {
        setTimeout(() => {
            setUserFiltered(filtered.get());
            setAllProducts(products.get());
            setLoading(false);
        }, 1000);
    }, []);

    const filterProducts = (search_term:string) => {
        setUserFiltered(allProducts.filter((item) => item.get_name().includes(search_term)));
    }

    const filterCategory = (filterOption:string) => {

        let results:Item[] = [];

        allProducts.forEach((item) => {
            item.get_categories().forEach((cat) => {
                if(cat === filterOption)
                    results.push(item);
            });
        });

        setUserFiltered(results);
    }

    const filterSize = (filterOption:string) => {

        let results:Item[] = [];

        allProducts.forEach((item) => {
            item.get_sizes().forEach((size) => {
                if(size === filterOption)
                    results.push(item);
            });
        });

        setUserFiltered(results);
    }

    const shopAll = () => {
        setUserFiltered(allProducts);
    }

    const addToCart = async (item:Item) => {

        let cart = userAuth.get_user().get_cart().find((cart) => cart.get_item().get_id() === item.get_id());

        if(cart !== undefined) {

            cart.set_quanity(cart.get_quantity() + 1);

            let cartIdx:number = userAuth.get_user().get_cart().findIndex((cart) => cart.get_item().get_id() === item.get_id());

            userAuth.get_user().get_cart()[cartIdx] = cart;

            let user_cart:_cart = {
                id: userAuth.get_user().get_id(),
                items: userAuth.get_user().get_cart_prim()
            }
            
            let updated:boolean = await userStore.addData("CARTS", user_cart);

            if(updated) {
                setUserAuth(userAuth);
                auth.set(userAuth);
            }

        } else {

            let cart_Item:_cart_item = {
                item: item.get_item_prim(),
                quantity: 1
            }

            if(userAuth.isAuth()) {
    
                let info:_firestore = {
                    coll: "CARTS",
                    id: userAuth.get_user().get_id()
                }
    
                let search:_search = {
                    key: "items",
                    value: cart_Item
                }
    
                await userStore.arrayUnion(info, search);
            }

            userAuth.get_user().get_cart().unshift(new Cart(cart_Item));
            setUserAuth(userAuth);
            auth.set(userAuth);
        }
    }

    const Products = ({ items }:items) => {

        return (
            <>
            {items.map((item, idx) => (
                <div className="filter-item" key={idx}>
                    <div className="filter-img">
                        <img className="filter-img-idx" src={item.get_photos()[0]} alt="index image" />
                    </div>
                    <div className="filter-mid">
                        <h5>
                            {item.get_name()} - {item.get_tags().map((tag, indx) => ( <span key={indx}>{tag} </span> ))}
                        </h5>
                        {item.get_sale_price() && <h5 className="prices"><span className="old-price">${item.get_price()} CAD</span> ${item.get_sale_price()} CAD</h5>}
                        {item.get_sale_price() === null && <h5 className="prices">${item.get_price()} CAD</h5>}
                    </div>
                    <div className="filter-btm">
                        <button className="btn btn-info btn-sm view-btn">View Details</button>
                        <button className="btn btn-success btn-sm cart-btn" onClick={() => addToCart(item)}>Add To Cart</button>
                    </div>
                </div>
            ))}
            </>
        )
    }

    return (
        <div id="filtered">
            <div className="input-group mb-3" id="filter-input">
                <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={(e) => filterProducts(e.target.value)} />
                <select onChange={(e) => filterCategory(e.target.value)} className="custom-select custom-select-lg" id="inputGroupSelect01">
                    <option defaultValue="">Category</option>
                    {
                        catOptions.map((cat, idx) => (
                            <option value={cat} key={idx}>{cat}</option>
                        ))
                    }
                </select>
                <select onChange={(e) => filterSize(e.target.value)} className="custom-select custom-select-lg" id="inputGroupSelect02">
                    <option defaultValue="">Size</option>
                    {
                        sizeOptions.map((size, idx) => (
                            <option value={size} key={idx}>{size}</option>
                        ))
                    }
                </select>
                <div className="input-group-append">
                    <button className="btn btn-light" onClick={shopAll}>Reset</button>
                </div>
            </div>

            {loading && <h4 className="filter-msg"><i className="fa fa-spinner fa-spin"></i></h4>}
            {!loading && userFiltered.length > 0 && <Products items={userFiltered} />}
            {!loading && userFiltered.length === 0 && <h4 className="filter-msg">No Results</h4>}
        </div>
    )
}