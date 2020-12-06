import { _order } from './Models';
import Cart from './Cart';

export default class Order {

    private id: string;
    private date: string;
    private name: string;
    private email:string;

    private address: string;
    private city: string;
    private province: string;
    private country: string;
    private postal:string;

    private status: string;
    private tracking_id: string | null;
    private items: Cart[];

    private order_prim: _order;

    constructor(order:_order) {

        this.id = order.id;
        this.date = order.date;
        this.name = order.name;
        this.email = order.email;

        this.address = order.address;
        this.city = order.city;
        this.province = order.province;
        this.country = order.country;
        this.postal = order.postal;

        this.status = order.status;
        this.tracking_id = order.tracking_id;

        this.items = [];

        for(let i = 0; i < order.items.length; i++) 
            this.items.push(new Cart(order.items[i]));

        this.order_prim = order;
    }

    get_order_prim(): _order {
        return this.order_prim;
    }

    get_id(): string {
        return this.id;
    }

    get_name(): string {
        return this.name;
    }

    get_email(): string {
        return this.email;
    }

    get_date(): string {
        return this.date;
    }

    get_address(): string {
        return this.address;
    }

    get_city(): string {
        return this.city;
    }

    get_province(): string {
        return this.province;
    }

    get_country(): string {
        return this.country
    }

    get_postal(): string {
        return this.postal;
    }
    
    get_status(): string {
        return this.status;
    }

    set_status(status:string) {
        this.status = status;
        this.order_prim.status = status;
    }

    get_tracking_id(): string | null {
        return this.tracking_id;
    }

    set_tracking_id(tracking_id:string) {
        this.tracking_id = tracking_id;
        this.order_prim.tracking_id = tracking_id;
    }

    get_items(): Cart[] {
        return this.items;
    }

    set_items(items:Cart[]) {
        this.items = items;
    }
}