import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';

import { _cart, _cart_item, _firebase, _firestore, _item, _models, _order, _role, _user } from './scripts/Models';
import firebase from 'firebase/app';
import Auth from './scripts/Auth';
import Firestore from './scripts/Firestore';
import Item from './scripts/Item';
import Storage from './scripts/Storage';
import Order from './scripts/Order';
import User from './scripts/User';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Slider from './components/Slider/Slider';
import Orders from './components/Orders/Orders';
import Users from './components/Users/Users';
import Products from './components/Products/Products';

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
  let all_users:User[] = [];
  let filtered: Item[] = []; 

  const [items, setItems] = useState(all_items);
  const [orders, setOrders] = useState(all_orders);
  const [filter,setFilter] = useState(filtered);
  const [users, setUsers] = useState(all_users);

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
	filtered: filter,
	users: users
  }

  const [isAuth, setIsAuth] = useState(models.auth.isAuth());
  const [viewItems, setViewItems] = useState(models.auth.get_role().can_view_items());
  const [viewOrders, setViewOrders] = useState(models.auth.get_role().can_view_orders());
  const [viewUsers, setViewUsers] = useState(models.auth.get_role().can_view_users());

	setInterval(() => {
		if(isAuth !== models.auth.isAuth()) {
			setIsAuth(models.auth.isAuth());
			setViewItems(models.auth.get_role().can_view_items());
			setViewOrders(models.auth.get_role().can_view_orders());
			setViewUsers(models.auth.get_role().can_view_users());
		}
	}, 1000);

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
	let users:User[] = [];

	let db_items: _item[] = await store.getAllDocs("ITEMS");
	await addOrder(db_items[0]);
	let db_orders: _order[] = await store.getAllDocs("ORDERS");
	let db_users: _user[] = await store.getAllDocs("USERS");
	let db_roles: _role[] = await store.getAllDocs("ROLES");

	for(let i = 0; i < db_items.length; i++)
	  items.push(new Item(db_items[i]));

	for(let i = 0; i < db_orders.length; i++)
	  orders.push(new Order(db_orders[i]));

	for(let i = 0; i < db_users.length; i++) {

	  let user_role:_role[] = db_roles.filter((role) => role.id === db_users[i].id);

	  let curr_user:User = new User(db_users[i], user_role[0]);

	  users.push(curr_user);
	}

	setItems(items);
	setOrders(orders);
	setUsers(users);
  }
 
  return (
	<Router>
		<Header {...models} />
		<Switch>
			<Route exact path="/">
				<Slider />
			</Route>
			<Route path="/products">
				{viewItems && <Products {...models} />}
			</Route>
			<Route path="/users">
				{viewUsers && <Users {...models} />}
			</Route>
			<Route path="/orders">
				{viewOrders && <Orders {...models} />}
			</Route>
		</Switch>
	</Router>
  )
}