import { _user, _role } from './Models';
import Role from './Role'; 

export default class User {

    private name:string;
    private id:string;
    private role:Role;
    private email:string;

    constructor(user:_user, role:_role) {

        this.name = user.display_name;
        this.id = user.id;
        this.role = new Role();
        this.email = user.email;

        this.role.set_role(role);
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

    set_role(role:_role) {
        this.role.set_role(role);
    }
}