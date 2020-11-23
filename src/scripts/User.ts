import { _key_val, _user, _item, _cart, _firestore, _role, _order } from './Models';
import Item from './Item';
import Role from './Role';
import Order from './Order';
import { firestore } from './Init';

export default class User {

    private id:string;
    private email:string;
    private display_name:string;
    private verified:boolean;
    private photo_url:string;

    private shop_cart:Item[];
    private orders:Order[];
    private user_role:Role;

    constructor() {  
        this.id = '';
        this.email = '';
        this.display_name = '';
        this.verified = false;
        this.photo_url = '';
        this.shop_cart = [];
        this.user_role = new Role();
        this.orders = [];
    }

    async set_user(user:_user) {

        this.id = user.id;
        this.email = user.email;
        this.display_name = user.display_name;
        this.verified = user.email_verified;
        this.photo_url = user.photo_url;

        await this.set_role();
        await this.set_shop_cart();
        await this.set_orders();
    }

    async set_shop_cart() {

        let info:_firestore = {
            coll: "CARTS",
            id: this.id
        }

        let cart_info:_cart = await firestore.getData(info);

        if(cart_info != null) {

            let item_ids:string[] = cart_info.item_ids;

            for(let i = 0; i < item_ids.length; i++) {

                info = {
                    id : item_ids[i],
                    coll: "ITEMS"
                }

                let item:_item = await firestore.getData(info);

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

        let user_role:_role = await firestore.getData(info);

        this.user_role.set_role(user_role);
    }

    async set_orders() {

        let search:_key_val = {
            key: 'user_id',
            value: this.id
        }

        let orders:_order[] = await firestore.getDocs("ORDERS", search);

        for(let i = 0; i < orders.length; i++) 
            this.orders.push(new Order(orders[i]));
    }

    get_id(): string {
        return this.id;
    }

    get_email(): string {
        return this.email;
    }

    get_display_name(): string {
        return this.display_name;
    }

    is_verified(): boolean {
        return this.verified;
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
}