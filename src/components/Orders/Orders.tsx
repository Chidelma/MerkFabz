import './Orders.css';
import React, { useState } from 'react';
import { _firestore, _models, _search } from '../../scripts/Models';
import Order from '../../scripts/Order';
import Cart from '../../scripts/Cart';
import { allAreas } from '../../scripts/Shares';
import { orders, store } from "../../scripts/Init";

interface orders { orders: Order[]};

export default function Orders() {

    const [allOrders] = useState(orders.get());
    const [userStore] = useState(store.get());

    let order_results:Order[] = [];
    let cart_items:Cart[] = [];
    let curr_order:Order = orders.get()[0];

    const [searching, setSearching] = useState(false);
    const [viewVerify, setViewVerify] = useState(false);
    const [viewStatus, setViewStatus] = useState(false);
    const [verified, setVerified] = useState(false);
    const [results, setResults] = useState(order_results);
    const [userEmail, setUserEmail] = useState('');
    const [email, setEmail] = useState('');
    const [viewItem, setViewItem] = useState(false);
    const [cartItems, setCartItems] = useState(cart_items);
    const [orderId, setOrderId] = useState('');

    const [trackingId, setTrackingId] = useState('');
    const [order, setOrder] = useState(curr_order);
    const [orderIdx, setOrderIdx] = useState(0);
    const [loading, setLoading] = useState(false);
 
    const encryptEmail = (email:string) => {

        let preat:string = email.split('@')[0];
        let foreat:string = email.split('@')[1];

        let frstIdx:string = preat[0];
        let lastIdx:string = preat[preat.length - 1];

        return frstIdx + '*****' + lastIdx + '@' + foreat;
    }

    const verifyEmail = (e:Event) => {

        e.preventDefault();

        if(userEmail === email)
            setVerified(true);
    }

    const Order = ({orders}:orders) => {

        const openForm = (email:string) => {

            setEmail('');
            setVerified(false);
            setViewVerify(false);
            setUserEmail(email);
            setViewVerify(true);
        }

        const viewOrderItems = (cart:Cart[], order_id:string) => {
            setOrderId(order_id);
            setCartItems(cart);
            setViewItem(true);
        }

        const openStatus = (order:Order, idx:number) => {
            setOrder(order);
            setOrderIdx(idx);
            setViewStatus(true);
        }

        return (
            <>
                <div className="order-head">
                    <table>
                        <tr>
                            <td className="order-attr">Order #</td>
                            <td className="order-attr">Name</td>
                            <td className="order-attr">Email</td>
                            <td className="order-attr">Address</td>
                            <td className="order-attr">Order Date/Time</td>
                            <td className="order-attr"># Order Items</td>
                            <td className="order-attr">Status</td>
                            <td className="order-attr last">Tracking ID</td>
                        </tr>
                    </table>
                </div>
                {orders.map((order, idx) => (
                    <div className="order" key={idx}>
                        <div className="order-attr">
                            <h5>{order.get_id()}</h5>
                        </div>
                        <div className="order-attr">
                            <h5>{order.get_name()}</h5>
                        </div>
                        <div className="order-attr">
                            <h6 className="order-email">{encryptEmail(order.get_email())}</h6>
                            <button className="btn btn-light" onClick={() => openForm(order.get_email())}>Verify Email</button>
                        </div>
                        <div className="order-attr">
                            <h6>{order.get_address()}, {order.get_city()}, {order.get_province()}, {order.get_postal()}, {order.get_country()}</h6>
                        </div>
                        <div className="order-attr">
                            <h5>{order.get_date()}</h5>
                        </div>
                        <div className="order-attr">
                            <h5>{order.get_items().length}</h5>
                            <button className="btn btn-light" onClick={() => viewOrderItems(order.get_items(), order.get_id())}>View Items</button>
                        </div>
                        <div className="order-attr">
                            <h5>{order.get_status()}</h5>
                            {order.get_status() === "Processing" && <button className="btn btn-light" onClick={() => openStatus(order, idx)}>Update Status</button>}
                        </div>
                        <div className="order-attr last">
                            <h5>{order.get_tracking_id() !== null ? order.get_tracking_id() : "-"}</h5>
                        </div>
                    </div>
                ))}
            </>
        )
    }

    const ViewItem = () => {

        const calcTotal = (): number => {

            let total:number = 0;

            for(let i = 0; i < cartItems.length; i++) {

                let price:number | null = cartItems[i].get_item().get_sale_price() !== null ? cartItems[i].get_item().get_sale_price() : cartItems[i].get_item().get_price();

                if(price)
                    total += price * cartItems[i].get_quantity();
            }

            return total;
        }

        const calcTaxes = (): number => {
            return Number((calcTotal() * 0.13).toFixed(2));
        }

        const calcNetTotal = (): number => {
            return calcTotal() + calcTaxes();
        }

        return (
            <form id="item-form">
                <h5>Order #{orderId} Details</h5>
                <hr/>

                {cartItems.map((item) => (
                    <div className="order-det">
                        <img className="order-pic" src={item.get_item().get_photos()[0]} />
                        <h6>{item.get_item().get_name()}</h6>
                        <h6>${item.get_item().get_sale_price() !== null ? item.get_item().get_sale_price() : item.get_item().get_price()} CAD x {item.get_quantity()}</h6>
                        <hr/>
                    </div>
                ))}

                <h6 className="total">Total: ${calcTotal()} CAD</h6>
                <h6 className="total">Taxes: ${calcTaxes()} CAD</h6>

                <hr/>

                <h6 className="total">Gross Total: ${calcNetTotal()} CAD</h6>

                <hr/>

                <button className="btn btn-danger close-btn" onClick={() => setViewItem(false)}>Close</button>
            </form>
        )
    }

    const search_order = (search_term:string) => {

        setSearching(true);

        setResults(allOrders.filter((order) => order.get_id().includes(search_term) || order.get_name().includes(search_term)));
    }

    const filterStatus = (filterOption:string) => {

        setSearching(true);

        setResults(allOrders.filter((order) => order.get_status() === filterOption));
    }

    const filterArea = (filterOption:string) => {

        setSearching(true);

        setResults(allOrders.filter((order) => order.get_province() === filterOption));
    }

    const filterCountry = (filterOption:string) => {

        setSearching(true);

        setResults(allOrders.filter((order) => order.get_country() === filterOption));
    }

    const updateStatus = async (e:Event) => {

        e.preventDefault();

        if(trackingId !== "") {

            setLoading(true);

            let info:_firestore = {
                id: order.get_id(),
                coll: "ORDERS"
            }
    
            let search:_search = {
                key: "tracking_id",
                value: trackingId
            }
    
            let updated:boolean = await userStore.updateData(info, search);
    
            if(updated) {
    
                search = {
                    key: "status",
                    value: "Dispatched"
                }
    
                updated = await userStore.updateData(info, search);

                if(updated) {
                    allOrders[orderIdx].set_status("Dispatched");
                    allOrders[orderIdx].set_tracking_id(trackingId);
                    setViewStatus(false);
                }

                orders.set(allOrders);
            }

            setLoading(false);
        }
    }

    return (
        <div id="orders">
            <div className="input-group mb-3 order-search-bar">
                <input type="text" className="form-control form-control-lg search-inp" onChange={(e) => search_order(e.target.value)} placeholder="Search Order ID, Name, Email" />
                <select className="custom-select custom-select-lg" onChange={(e) => filterStatus(e.target.value)}>
                    <option selected>Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                </select>
                <select className="custom-select custom-select-lg" onChange={(e) => filterArea(e.target.value)}>
                    <option selected>Province/State</option>
                    {allAreas.map((area) => (
                        <option value={area[1]}>{area[0]}</option>
                    ))}
                </select>
                <select className="custom-select custom-select-lg" onChange={(e) => filterCountry(e.target.value)}>
                    <option selected>Country</option>
                    <option value="Canada">Canada</option>
                    <option value="US">United States</option>
                </select>
                <div className="input-group-append">
                    <button className="btn btn-light" onClick={() => setSearching(false)}>Reset</button>
                </div>
            </div>
            {searching ? <Order orders={results}/> : <Order orders={allOrders}/> }
            {viewVerify && 
                <form id="verify-form">
                    <h5>Verify Email</h5>
                    <hr/>
    
                    <div className="input-group mb-3 prod-det">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Email:</span>
                        </div>
                        <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>

                    {verified && <h6 className="verify-msg">Verification Complete</h6>}
    
                    <button className="btn btn-danger" onClick={() => setViewVerify(false)}>Cancel</button>
                    <button className="btn btn-light verify-btn" onClick={(e:any) => verifyEmail(e)} disabled={email.length === 0}>Verify</button>
                </form>
            }
            {viewStatus && 
                <form id="update-status">
                    <h5>Update Order #{order.get_id()} Status</h5>
                    <hr/>

                    <div className="input-group mb-3 prod-det">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Tracking ID:</span>
                        </div>
                        <input type="text" className="form-control" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} required/>
                    </div>

                    <button className="btn btn-danger" onClick={() => setViewStatus(false)}>Cancel</button>
                    <button className="btn btn-light verify-btn" onClick={(e:any) => updateStatus(e)} disabled={trackingId.length === 0}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Update"}</button>
                </form>
            }
            {viewItem && <ViewItem/>}
        </div>
    )
}