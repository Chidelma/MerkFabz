import { _role } from './Models';

export default class Role {

    private id:string;

    private view_items:boolean;
    private view_orders:boolean;
    private view_users:boolean;

    private add_item:boolean;
    private edit_item:boolean;
    private delete_item:boolean;

    private edit_role:boolean;

    constructor() {

        this.id = '';

        this.view_items = false;
        this.view_orders = false;
        this.view_users = false;

        this.add_item = false;
        this.edit_item = false;
        this.delete_item = false;

        this.edit_role = false;
    }

    set_role(role:_role) {

        this.id = role.id;

        this.view_items = role.can_view_items;
        this.view_orders = role.can_view_orders;
        this.view_users = role.can_view_users;
        this.add_item = role.can_add_item;
        this.edit_item = role.can_edit_item;
        this.delete_item = role.can_delete_item;

        this.edit_role = role.can_edit_role;
    }

    get_id(): string {
        return this.id;
    }

    can_view_items(): boolean {
        return this.view_items;
    }

    set_view_items(truth:boolean) {
        this.view_items = truth;
    }

    can_view_orders(): boolean {
        return this.view_orders;
    }

    set_view_orders(truth:boolean) {
        this.view_orders = truth;
    }

    can_view_users(): boolean {
        return this.view_users;
    }

    set_view_users(truth:boolean) {
        this.view_users = truth;
    }

    can_add_item(): boolean {
        return this.add_item;
    }

    set_add_item(truth:boolean) {
        this.add_item = truth;
    }

    can_edit_item(): boolean {
        return this.edit_item;
    }

    set_edit_item(truth:boolean) {
        this.edit_item = truth
    }

    can_delete_item(): boolean {
        return this.delete_item;
    }

    set_delete_item(truth:boolean) {
        this.delete_item = truth;
    }

    can_edit_role(): boolean {
        return this.edit_role;
    }

    set_edit_role(truth:boolean) {
        this.edit_role = truth;
    }
}