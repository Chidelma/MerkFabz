import firebase from 'firebase';
import Auth from './Auth';
import Firestore from './Firestore';
import Storage from './Storage';
import State from './State';
import { _firebase, _item, _order, _role, _user } from './Models';
import Item from './Item';
import Order from './Order';
import User from './User';

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

export const store = new State(new Firestore(app.firestore()));
export const auth = new State(new Auth(app.auth()));
export const storage = new State(new Storage(app.storage()));

export const total = new State(0);
export const tax = new State(0);
export const gross = new State(0);

let allProducts:Item[] = [];
let allOrders:Order[] = [];
let allUsers:User[] = [];

export const products = new State(allProducts);
export const filtered = new State(allProducts);

export const orders = new State(allOrders);
export const users = new State(allUsers);

async function setAllDocs() {

	let db_items: _item[] = await store.get().getAllDocs("ITEMS");
	let db_orders: _order[] = await store.get().getAllDocs("ORDERS");

	for(let i = 0; i < db_items.length; i++)
	    allProducts.push(new Item(db_items[i]));

	for(let i = 0; i < db_orders.length; i++)
	    allOrders.push(new Order(db_orders[i]));
    
    products.set(allProducts);
    orders.set(allOrders);
}

export async function setAllUsers() {

    let db_users: _user[] = await store.get().getAllDocs("USERS");

    for(let i = 0; i < db_users.length; i++) {

        let curr_user:User = new User();

        curr_user.set_user(db_users[i]);

        curr_user.set_role();

        allUsers.push(curr_user);
    }

    users.set(allUsers);
}

setTimeout(async () => {
    await setAllDocs();
}, 100);