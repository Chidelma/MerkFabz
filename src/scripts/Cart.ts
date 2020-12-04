import Item from './Item';
import { _cart_item, _item } from './Models';

export default class Cart {

    private item:Item;
    private quantity:number;

    constructor(cart_item:_cart_item) {

        this.item = new Item(cart_item.item);
        this.quantity = cart_item.quantity;
    }

    get_item(): Item {
        return this.item;
    }

    get_primitive_item(): _item {

        let item:_item = {
            id: this.item.get_id(),
            name: this.item.get_name(),
            price: this.item.get_price(),
            sale_price: this.item.get_sale_price(),
            tags: this.item.get_tags(),
            stock: this.item.get_stock(),
            sizes: this.item.get_sizes(),
            photo_urls: this.item.get_photos(),
            categories: this.item.get_categories()
        }

        return item;
    }

    get_quantity(): number {
        return this.quantity;
    }
}