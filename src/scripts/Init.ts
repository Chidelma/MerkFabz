import { _firebase, _item } from './Models';
import firebase from 'firebase/app';
import Auth from './Auth';
import Firestore from './Firestore';
import User from './User';
import Item from './Item';

const config:_firebase = {
    apiKey: "AIzaSyDRJbMO8p_kOJY6AH6VPRdMQYe1xjwo3zg",
    authDomain: "merkfabz.firebaseapp.com",
    databaseURL: "https://merkfabz.firebaseio.com",
    projectId: "merkfabz",
    storageBucket: "merkfabz.appspot.com",
    messagingSenderId: "653880877265",
    appId: "1:653880877265:web:90a623a4b5707fa203e5f0",
    measurementId: "G-NTVWNWY41C"
};

const app:firebase.app.App = firebase.initializeApp(config);

export const auth:Auth = new Auth(app);
export const firestore:Firestore = new Firestore(app);
export const user:User = new User();
export const items:Item[] = [];

(async () => {

    let db_items:_item[] = await firestore.getAllDocs("ITEMS");

    for(let i = 0; i < db_items.length; i++)
        items.push(new Item(db_items[i]));
});