import { _order } from './Models';
import Item from './Item';

export default class Order {

    private id: string;
    private date: string;

    private address: string;
    private city: string;
    private province: string;

    private status: string;
    private tracking_id: string;
    private items: Item[];

    constructor(order:_order) {

        this.id = order.id;
        this.date = order.date;

        this.address = order.address;
        this.city = order.city;
        this.province = order.province;

        this.status = order.status;
        this.tracking_id = order.tracking_id;

        this.items = [];

        for(let i = 0; i < order.items.length; i++) 
            this.items.push(new Item(order.items[i]))
    }

    get_id(): string {
        return this.id;
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

    get_status(): string {
        return this.status;
    }

    get_tracking_id(): string {
        return this.tracking_id;
    }

    get_items(): Item[] {
        return this.items;
    }

    set_items(items:Item[]) {
        this.items = items;
    }
}