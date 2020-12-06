import React, { useEffect, useState } from 'react';
import './Payment.css';
import { _cart_item, _models, _order } from '../../scripts/Models';
import { PayPalButton } from "react-paypal-button-v2";
import moment from 'moment';
import { states, prov } from '../../scripts/Shares';
import { auth, store, total, tax, gross } from "../../scripts/Init";

export default function Stripe() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('');
    const [postal, setPostal] = useState('');

    const [userAuth] = useState(auth.get());
    const [userStore] = useState(store.get());

    const [orderTotal] = useState(total.get());
    const [orderTax] = useState(tax.get());
    const [orderGross] = useState(gross.get());

    useEffect(() => {
        setTimeout(async () => {
            if(userAuth.isAuth()) {

                setEmail(userAuth.get_user().get_email());
        
                let names:string[] = userAuth.get_user().get_name().split(' ');
        
                setFirstName(names[0]);
                setLastName(names[1]);
            }
        }, 1000)
    }, []);

    const handleOrder = async (order_id:string) => {

        if(firstName !== "" && lastName !== "" && email !== "" && address !== "" && city !== "" && province !== "" && country !== "" && postal != "") {

            let order:_order = {
                id: order_id,
                user_id: userAuth.isAuth() ? userAuth.get_user().get_id() : null,
                name: firstName + ' ' + lastName,
                email: email,

                date: moment().format('MMMM Do YYYY, h:mm:ss a'),

                address: address,
                city: city,
                province: province,
                country: country,
                postal: postal,

                status: "Processing",
                items: userAuth.get_user().get_cart_prim(),
                tracking_id: null
            }

            if(await userStore.addData("ORDERS", order)) {

            }
        }
    }

    return (
        <form id="stripe">

            <h5 id="ship-title">Shipping Details</h5>
            <hr/>
            <input id="first-name" className="form-control order-detail display-name" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
            <input id="last-name" className="form-control order-detail display-name" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            <input className="form-control order-detail" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="form-control order-detail" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input className="form-control order-detail" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <select className="custom-select order-detail" onChange={(e) => setCountry(e.target.value)}>
                <option selected>Country</option>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
            </select>
            <select className="custom-select order-detail" onChange={(e) => setProvince(e.target.value)} disabled={country.length === 0}>
                <option selected>Province/State</option>
                {country === "United States" ? states.map((state) => (<option value={state[1]}>{state[0]}</option>)) : prov.map((state) => (<option value={state[1]}>{state[0]}</option>)) }
            </select>
            <input className="form-control order-detail" placeholder="Postal/Zip Code" value={postal} onChange={(e) => setPostal(e.target.value)} required/>

            <PayPalButton 
            
                options={{
                    clientId: "AU19WLdzl_-V-0eQXoqhCrBl89JViU71Zz_2XhtDWlisZYHMMda7Bh6qhbq20Mu39PYdRhOW0uqDvzzU",
                    currency: "CAD"
                }}

                shippingPreference="NO_SHIPPING"

                onSuccess={(details:any, data:any) => {
                    handleOrder(data.orderID);
                }}

                amount={orderGross}
            />
        </form>
    )
}   