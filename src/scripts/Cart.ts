import Item from './Item';
import { _cart, _cart_item, _item } from './Models';

export default class Cart {

    private item:Item;
    private quantity:number;
    private cart_prim:_cart_item;

    constructor(cart_item:_cart_item) {

        this.item = new Item(cart_item.item);
        this.quantity = cart_item.quantity;
        this.cart_prim = cart_item
    }

    get_cart(): _cart_item {
        return this.cart_prim;
    }

    get_item(): Item {
        return this.item;
    }

    get_quantity(): number {
        return this.quantity;
    }

    set_quanity(quantity:number) {
        if(0 <= quantity && quantity <= this.item.get_stock()) {
            this.quantity = quantity;
            this.cart_prim.quantity = quantity;
        }
    }
}