import { _item } from './Models';

export default class Item {

    private id: string;
    private name: string;
    private price: number;
    private sale_price: number | null;
    private photo_urls: string[];
    private stock: number;
    private sizes: string[];
    private categories: string[];
    private tags: string[];

    private item_prim:_item;

    constructor(item:_item) {

        this.id = item.id;
        this.name = item.name;
        this.price = item.price;
        this.sale_price = item.sale_price;
        this.photo_urls = item.photo_urls;
        this.stock = item.stock;
        this.sizes = item.sizes;
        this.categories = item.categories;
        this.tags = item.tags;

        this.item_prim = item;
    }

    get_item_prim(): _item {
        return this.item_prim;
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

    get_sale_price(): number | null {
        return this.sale_price;
    }

    get_photos(): string[] {
        return this.photo_urls;
    }

    get_stock(): number {
        return this.stock;
    }

    get_sizes(): string[] {
        return this.sizes;
    }

    get_categories(): string[] {
        return this.categories;
    }

    get_tags(): string[] {
        return this.tags;
    }
}
