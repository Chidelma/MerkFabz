import { _item } from './Models';

export default class Item {

    private id: string;
    private name: string;
    private price: number;
    private photo_urls: string[];
    private stock: number;
    private size: string | number;
    private category: string;

    constructor(item:_item) {

        this.id = item.id;
        this.name = item.name;
        this.price = item.price;
        this.photo_urls = item.photo_urls;
        this.stock = item.stock;
        this.size = item.size;
        this.category = item.category;
    }

    get_id(): string {
        return this.id;
    }

    get_name(): string {
        return this.name;
    }

    get_price(): number {
        return this.price;
    }

    get_photos(): string[] {
        return this.photo_urls;
    }

    get_stock(): number {
        return this.stock;
    }

    get_size(): number | string {
        return this.size;
    }

    get_category(): string {
        return this.category;
    }

    increment_stock(count:number) {
        this.stock += count;
    }

    decrement_stock(count:number) {
        this.stock -= count;
    }
}
