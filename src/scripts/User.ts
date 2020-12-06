import { _user, _role, _firestore, _cart, _cart_item, _order, _search } from './Models';
import Role from './Role'; 
import { store } from './Init';
import Cart from './Cart';
import Order from './Order';
import Item from './Item';

export default class User {

    private name:string;
    private id:string;
    private role:Role;
    private email:string;
    private photo_url:string;

    private shop_cart:Cart[];
    private orders:Order[];
    private user_prim:any;

    constructor() {

        this.name = '';
        this.id = '';
        this.role = new Role();
        this.email = '';
        this.photo_url = '';

        this.shop_cart = [];
        this.orders = [];
    }

    set_user(user:_user) {

        this.name = user.display_name;
        this.id = user.id;
        this.email = user.email;
        this.photo_url = user.photo_url;

        this.user_prim = user;
    }

    get_user_prim(): _user {
        return this.user_prim;
    }

    async set_role() {

        let info:_firestore = {
            coll: "ROLES",
            id: this.id
        }

        this.role.set_role(await store.get().getData(info))
    }

    rmv_cart_item(item:Item) {
        this.shop_cart.splice(this.shop_cart.findIndex((cart) => cart.get_item().get_id() === item.get_id()), 1);
    }

    get_photo_url():string {
        return this.photo_url;
    }

    get_id(): string {
        return this.id;
    }

    get_name(): string {
        return this.name;
    }

    get_role(): Role {
        return this.role
    }

    get_email(): string {
        return this.email;
    }

    add_order(order:Order) {
        this.orders.push(order);
    }

    get_cart(): Cart[] {
        return this.shop_cart;
    }

    set_cart(cart:Cart[]) {
        this.shop_cart = cart;
    }

    async set_shop_cart() {

        let info:_firestore = {
            coll: "CARTS",
            id: this.id
        }

        let cart_info:_cart = await store.get().getData(info);

        for(let i = 0; i < cart_info.items.length; i++)
            this.shop_cart.push(new Cart(cart_info.items[i]));
    }

    get_orders(): Order[] {
        return this.orders;
    }

    async set_orders() {

        let search:_search = {
            key: 'user_id',
            value: this.id
        }

        let orders:_order[] = await store.get().getDocs("ORDERS", search);

        for(let i = 0; i < orders.length; i++) 
            this.orders.push(new Order(orders[i]));
    }
    
    get_cart_prim(): _cart_item[] {

        let cart:_cart_item[] = [];

        this.shop_cart.forEach((curr_cart) => {

            let user_cart:_cart_item = {
                item: curr_cart.get_item().get_item_prim(),
                quantity: curr_cart.get_quantity()
            }

            cart.push(user_cart);
        });

        return cart;
    }
}