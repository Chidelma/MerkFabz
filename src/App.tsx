import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Slider from './components/Slider/Slider';
import Stripe from './components/Stripe/Stripe';
import Products from './components/Products/Products';
import Orders from './components/Orders/Orders';

import { _cart, _cart_item, _firebase, _item, _models, _order } from './scripts/Models';
import firebase from 'firebase/app';
import Auth from './scripts/Auth';
import Firestore from './scripts/Firestore';
import Item from './scripts/Item';
import Storage from './scripts/Storage';
import Order from './scripts/Order';

const config: _firebase = {
  apiKey: "AIzaSyDRJbMO8p_kOJY6AH6VPRdMQYe1xjwo3zg",
  authDomain: "merkfabz.firebaseapp.com",
  databaseURL: "https://merkfabz.firebaseio.com",
  projectId: "merkfabz",
  storageBucket: "merkfabz.appspot.com",
  messagingSenderId: "653880877265",
  appId: "1:653880877265:web:90a623a4b5707fa203e5f0",
  measurementId: "G-NTVWNWY41C"
};

const app: firebase.app.App = firebase.initializeApp(config);

export default function App() {

  let all_items: Item[] = [];
  let all_orders: Order[] = [];
  let filtered: Item[] = []; 

  const [items, setItems] = useState(all_items);
  const [orders, setOrders] = useState(all_orders);

  const [filter,setFilter] = useState(filtered);
  const [store, setStore] = useState(new Firestore(app.firestore()));
  const [auth, setAuth] = useState(new Auth(app.auth(), store));
  const [storage, setStorage] = useState(new Storage(app.storage()))

  useEffect(() => {
    setTimeout(async () => {
      await getAdminData();
    }, 100);
  }, []);

  const models: _models = {
    auth: auth,
    store: store,
    items: items,
    storage: storage,
    orders: orders,
    filtered: filter
  }

  const addOrder = async (item:_item) => {

    let cart_item:_cart_item = {
      quantity: 1,
      item: item
    }

    let order:_order = {
      id: "1",
      name: "Chinedu Ezenma",
      address: "162 Apple Ridge",
      city: "Kitchener",
      province: "ON",
      country: "Canada",
      postal: "N2P 2S7",
      email: "lycosidae23@gmail.com",
      tracking_id: null,
      status: "Processing",
      items: [cart_item],
      date: "Dec 04, 2020 16:04 PM"
    }

    await store.addData("ORDERS", order);
  } 

  const getAdminData = async () => {

    let items: Item[] = [];
    let orders: Order[] = [];

    let db_items: _item[] = await store.getAllDocs("ITEMS");
    await addOrder(db_items[0]);
    let db_orders: _order[] = await store.getAllDocs("ORDERS");

    for(let i = 0; i < db_items.length; i++)
      items.push(new Item(db_items[i]));

    for(let i = 0; i < db_orders.length; i++)
      orders.push(new Order(db_orders[i]));

    setItems(items);
    setOrders(orders);
  }
 
  return (
    <>
      <Products {...models} />
      <Header {...models} />
    </>
  )

}