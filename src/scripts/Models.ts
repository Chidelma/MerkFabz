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

export interface _key_val {

    key: string,
    value: string
}

export interface _user {

    id: string,
    email: string,
    display_name: string,
    email_verified: boolean,
    photo_url: string
}

export interface _role {

    id: string,

    can_view_items: boolean,

    can_add_item: boolean,
    can_edit_item: boolean,
    can_delete_item: boolean,

    can_edit_role: boolean
}

export interface _cart {
    id: string,
    item_ids: string[]
}

export interface _item {

    id: string,
    name: string,
    price: number,
    photo_urls: string[],
    stock: number,
    size: string | number
}

export interface _order {

    id: string,
    user_id?: string,
    name: string,
    date: string,

    address: string,
    city: string,
    province: string,

    items: _item[],
    status: string,
    tracking_id: string
}