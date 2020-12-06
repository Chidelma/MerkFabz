import firebase from 'firebase/app';
import 'firebase/auth';
import { _cart, _cart_item, _firestore, _item, _order, _role, _search,_user } from './Models';
import User from './User';

export default class Auth {

    private client:firebase.auth.Auth;

    private user:User;
    private verified:boolean;

    constructor(auth:firebase.auth.Auth) {

        this.client = auth;

        this.user = new User();
        this.verified = false;
    }

    async signUp(email:string, password:string): Promise<boolean> {

        let added:boolean = false;

        try {

            await this.client.createUserWithEmailAndPassword(email, password);

            await this.set_user(false);

            added = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return added;
    }

    isAuth(): boolean {
        
        let auth:boolean = false;

        if(this.client.currentUser != null) 
            auth = true;

        return auth;
    }

    isVerified(): boolean {
        return this.verified;
    }

    async signIn(email:string, password:string): Promise<boolean> {

        let exist:boolean = false;

        try {

            await this.client.signInWithEmailAndPassword(email, password);

            await this.set_user(true);

            exist = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return exist;
    }


    async updateProfile(displayName:string, photoURL:string): Promise<boolean> {

        let changed:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.updateProfile({ displayName, photoURL });
    
                changed = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return changed;
    }

    async updateEmail(email:string): Promise<boolean> {

        let updated:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.updateEmail(email);
    
                updated = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return updated;
    }

    async sendEmailVerification(): Promise<boolean> {

        let sent:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.sendEmailVerification();
    
                sent = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return sent;
    }

    async updatePassword(new_password:string): Promise<boolean> {

        let updated:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.updatePassword(new_password);
    
                updated = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return updated;
    }

    async sendResetPasswordEmail(email:string): Promise<boolean> {

        let sent:boolean = false;

        try {

            await this.client.sendPasswordResetEmail(email);

            sent = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return sent;
    }

    async deleteUser(): Promise<boolean> {

        let deleted:boolean = false;

        if(this.client.currentUser) {

            try {

                await this.client.currentUser.delete();
    
                deleted = true;
    
            } catch(err:any) {
                console.log(err.code, err.message);
            }
        }

        return deleted;
    }

    async signOut(): Promise<boolean> {

        let signedOut:boolean = false;

        try {

            await this.client.signOut();

            this.unset_user();

            signedOut = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return signedOut;
    }

    async set_user(login:boolean) {

        if(this.client.currentUser) {

            let currUser:any = {};

            currUser.id = this.client.currentUser.uid;

            if(this.client.currentUser.displayName) 
                currUser.display_name = this.client.currentUser.displayName;

            if(this.client.currentUser.email)
                currUser.email = this.client.currentUser.email;

            if(this.client.currentUser.photoURL)
                currUser.photo_url = this.client.currentUser.photoURL;

            this.verified = this.client.currentUser.emailVerified;

            let user:_user = currUser;

            this.user = new User();

            this.user.set_user(user);

            if(login) {
                await this.user.set_role();
                await this.user.set_shop_cart();
                await this.user.set_orders();
            }
        }
    }

    get_user(): User {
        return this.user;
    }

    unset_user() {
        if(!this.client.currentUser) {
            this.user = new User();
        }
    }
}