import firebase from 'firebase/app';
import 'firebase/auth';
import Firestore from './Firestore';
import Item from './Item';
import { _cart, _firebase, _firestore, _item, _order, _role, _search } from './Models';
import Order from './Order';
import Role from './Role';

export default class Auth {

    private client:firebase.auth.Auth;

    private shop_cart:Item[];
    private orders:Order[];
    private user_role:Role;

    private store:Firestore;

    private name:string;
    private id:string;
    private email:string;
    private photo_url:string;
    private verified:boolean;

    constructor(auth:firebase.auth.Auth, store:Firestore) {

        this.client = auth;

        this.store = store;
        this.shop_cart = [];
        this.orders = [];
        this.user_role = new Role();

        this.name = "";
        this.id = "";
        this.email = "";
        this.photo_url = "";
        this.verified = false;
    }

    async signUp(email:string, password:string): Promise<boolean> {

        let added:boolean = false;

        try {

            await this.client.createUserWithEmailAndPassword(email, password);

            added = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return added;
    }

    isAuth(): boolean {
        
        let auth:boolean = false;

        if(this.client.currentUser != null) 
            auth = true;

        return auth;
    }

    isVerified(): boolean {
        return this.verified;
    }

    async signIn(email:string, password:string): Promise<boolean> {

        let exist:boolean = false;

        try {

            await this.client.signInWithEmailAndPassword(email, password);

            exist = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return exist;
    }


    async updateProfile(displayName:string, photoURL:string): Promise<boolean> {

        let changed:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.updateProfile({ displayName, photoURL });
    
                changed = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return changed;
    }

    async updateEmail(email:string): Promise<boolean> {

        let updated:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.updateEmail(email);
    
                updated = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return updated;
    }

    async sendEmailVerification(): Promise<boolean> {

        let sent:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.sendEmailVerification();
    
                sent = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return sent;
    }

    async updatePassword(new_password:string): Promise<boolean> {

        let updated:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.updatePassword(new_password);
    
                updated = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return updated;
    }

    async sendResetPasswordEmail(email:string): Promise<boolean> {

        let sent:boolean = false;

        try {

            await this.client.sendPasswordResetEmail(email);

            sent = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return sent;
    }

    async deleteUser(): Promise<boolean> {

        let deleted:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.delete();
    
                deleted = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return deleted;
    }

    async signOut(): Promise<boolean> {

        let signedOut:boolean = false;

        try {

            await this.client.signOut();

            signedOut = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return signedOut;
    }

    add_to_cart(item:Item) {
        this.shop_cart.push(item);
    }

    remove_frm_cart(item:Item) {

        let idx:number = this.shop_cart.findIndex((curr_item) => curr_item.get_id() === item.get_id());

        this.shop_cart.splice(idx, 1);
    }

    add_order(order:Order) {
        this.orders.push(order);
    }

    get_id(): string {
        return this.id;
    }

    get_email(): string {
        return this.email;
    }

    get_display_name(): string {
        return this.name;
    }

    get_photo(): string {
        return this.photo_url;
    }

    get_role(): Role {
        return this.user_role;
    }

    get_cart(): Item[] {
        return this.shop_cart;
    }

    get_orders(): Order[] {
        return this.orders;
    }

    async set_shop_cart() {

        let info:_firestore = {
            coll: "CARTS",
            id: this.id
        }

        let cart_info:_cart = await this.store.getData(info);

        if(cart_info != null) {

            let item_ids:string[] = cart_info.item_ids;

            for(let i = 0; i < item_ids.length; i++) {

                info = {
                    id : item_ids[i],
                    coll: "ITEMS"
                }

                let item:_item = await this.store.getData(info);

                if(item != null)
                    this.shop_cart.push(new Item(item));
            }
        }
    }

    async set_role() {

        let info:_firestore = {
            coll: "ROLES",
            id: this.id
        }

        let user_role:_role = await this.store.getData(info);

        this.user_role.set_role(user_role);
    }

    async set_orders() {

        let search:_search = {
            key: 'user_id',
            value: this.id
        }

        let orders:_order[] = await this.store.getDocs("ORDERS", search);

        for(let i = 0; i < orders.length; i++) 
            this.orders.push(new Order(orders[i]));
    }

    set_user() {

        if(this.client.currentUser) {

            this.id = this.client.currentUser.uid

            if(this.client.currentUser.displayName)
                this.name = this.client.currentUser.displayName

            if(this.client.currentUser.email)
                this.email = this.client.currentUser.email;

            if(this.client.currentUser.photoURL)
                this.photo_url = this.client.currentUser.photoURL

            this.verified = this.client.currentUser.emailVerified;
        }
    }

    async set_info() {

        if(this.client.currentUser) {

            await this.set_role();
            await this.set_shop_cart();
            await this.set_orders();
        }
    }
}