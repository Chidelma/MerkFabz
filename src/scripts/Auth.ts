import firebase from 'firebase/app';
import 'firebase/auth';
import { _firebase } from './Models';

export default class Auth {

    private client:firebase.auth.Auth;

    constructor(config:_firebase) {
        this.client = firebase.initializeApp(config).auth();
    }

    async signUp(email:string, password:string): Promise<boolean> {

        let added:boolean = false;

        try {

            await this.client.createUserWithEmailAndPassword(email, password);

            added = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return added;
    }

    retriveCurrUser(): firebase.User | null {
        return this.client.currentUser;
    } 

    async signIn(email:string, password:string): Promise<boolean> {

        let exist:boolean = false;

        try {

            await this.client.signInWithEmailAndPassword(email, password);

            exist = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return exist;
    }


    async updateProfile(displayName:string, photoURL:string): Promise<boolean> {

        let changed:boolean = false;

        try {

            await this.retriveCurrUser()?.updateProfile({ displayName, photoURL });

            changed = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return changed;
    }

    async updateEmail(email:string): Promise<boolean> {

        let updated:boolean = false;

        try {

            await this.retriveCurrUser()?.updateEmail(email);

            updated = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return updated;
    }

    async sendEmailVerification(): Promise<boolean> {

        let sent:boolean = false;

        try {

            await this.retriveCurrUser()?.sendEmailVerification();

            sent = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return sent;
    }

    async updatePassword(new_password:string): Promise<boolean> {

        let updated:boolean = false;

        try {

            await this.retriveCurrUser()?.updatePassword(new_password);

            updated = true;

        } catch(err:any) {
            console.log(err.code, err.message);
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

        try {

            await this.retriveCurrUser()?.delete();

            deleted = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return deleted;
    }

    async signOut(): Promise<boolean> {

        let signedOut:boolean = false;

        try {

            await this.client.signOut();

            signedOut = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return signedOut;
    }
}