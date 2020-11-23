import { _role } from './Models';

export default class Role {

    private id:string;

    private view_items:boolean;

    private add_item:boolean;
    private edit_item:boolean;
    private delete_item:boolean;

    private edit_role:boolean;

    constructor() {

        this.id = '';

        this.view_items = false;
        this.add_item = false;
        this.edit_item = false;
        this.delete_item = false;

        this.edit_role = false;
    }

    set_role(role:_role) {

        this.id = role.id;

        this.view_items = role.can_view_items;
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

    can_add_item(): boolean {
        return this.add_item;
    }

    can_edit_item(): boolean {
        return this.edit_item;
    }

    can_delete_item(): boolean {
        return this.delete_item;
    }

    can_edit_role(): boolean {
        return this.edit_role;
    }
}