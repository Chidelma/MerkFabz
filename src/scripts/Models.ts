import Auth from './Auth';
import Firestore from './Firestore';
import Item from './Item';
import Order from './Order';
import Storage from './Storage';
import User from './User';

export interface _firebase {

    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string
}

export interface _firestore {

    coll:string,
    id:string,
}

export interface _search {

    key: string,
    value: any
}

export interface _user {

    id: string,
    email: string,
    display_name: string,
    photo_url: string
}

export interface _role {

    id: string,

    can_view_items: boolean,
    can_view_orders: boolean,

    can_add_item: boolean,
    can_edit_item: boolean,
    can_delete_item: boolean,
    
    can_view_users: boolean,
    can_edit_role: boolean
}

export interface _cart_item {
    item:_item,
    quantity: number
}

export interface _cart {
    id: string,
    items: _cart_item[]
}

export interface _item {

    id: string,
    name: string,
    price: number,
    sale_price: number | null,
    photo_urls: string[],
    stock: number,
    sizes: string[],
    categories: string[]
    tags: string[]
}

export interface _order {

    id: string,
    user_id?: string | null,
    name: string,
    date: string,
    email: string,

    address: string,
    city: string,
    province: string,
    country: string,
    postal: string,

    items: _cart_item[],
    status: string,
    tracking_id: string | null
}

export interface _models {
    auth: Auth,
    store: Firestore,
    storage: Storage,
    orders: Order[]
    items:Item[],
    filtered:Item[],
    users: User[]
}