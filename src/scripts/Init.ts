import { _firebase } from './Models';
import Auth from './Auth';
import Firestore from './Firestore';
import User from './User';

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

export const auth:Auth = new Auth(config);
export const firestore:Firestore = new Firestore(config);
export const user:User = new User();