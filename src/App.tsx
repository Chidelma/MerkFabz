import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Email from './components/Register/Email';
import Profile from './components/Profile/Profile';
import Cart from './components/Cart/Cart';
import Slider from './components/Slider/Slider';

import { _firebase, _item, _models } from './scripts/Models';
import firebase from 'firebase/app';
import Auth from './scripts/Auth';
import Firestore from './scripts/Firestore';
import Item from './scripts/Item';

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

async function getItems(setItems: any, store: Firestore) {

  let items: Item[] = [];

  let db_items: _item[] = await store.getAllDocs("ITEMS");

  for (let i = 0; i < db_items.length; i++)
    items.push(new Item(db_items[i]));

  setItems(items);
}

export default function App() {

  let curr_items: Item[] = [];
  let filtered: Item[] = []; 

  const [filter,setFilter] = useState(filtered);
  const [items, setItems] = useState(curr_items);
  const [store, setStore] = useState(new Firestore(app.firestore()));
  const [auth, setAuth] = useState(new Auth(app.auth(), store));

  useEffect(() => {
    getItems(setItems, store);
  }, []);

  let models: _models = {
    auth: auth,
    store: store,
    items: items,
    filtered: filter
  }
 
  return (
    <>
      <Slider />
      <SideBar {...models}/>
      <Header {...models} />
      <Cart {...models} />
      <Login {...models} />
      <Register {...models} />
      <Email {...models} />
      <Profile {...models} />
    </>
  )

}