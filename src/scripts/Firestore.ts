import firebase from 'firebase/app';
import 'firebase/firestore';
import { _user, _firestore, _search, _item, _cart, _role, _order } from './Models';

export default class Firestore {

    private client:firebase.firestore.Firestore;

    constructor(store:firebase.firestore.Firestore) {
        this.client = store;
    }

    async addData(coll:string, data:_user | _item | _cart | _role | _order): Promise<boolean> {

        let added:boolean = false;

        try {

            await this.client.collection(coll).doc(data.id).set(data);

            added = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return added;
    }

    async getData(info:_firestore): Promise<any> {

        let data:any = null;

        let doc = await this.client.collection(info.coll).doc(info.id).get();

        if(doc.exists)
            data = doc.data();

        return data;
    }

    async updateData(info:_firestore, search:_search): Promise<boolean> {

        let updated:boolean = false;

        try {

            await this.client.collection(info.coll).doc(info.id).update({ [search.key] : search.value });

            updated = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return updated;
    }

    async getDocs(coll:string, search:_search): Promise<any[]> {

        let results:any[] = [];

        try {

            let snap_shot = await this.client.collection(coll).where(search.key, "==", search.value).get();

            snap_shot.forEach((doc:any) => {
                results.push(doc.data());
            });

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return results;
    }

    async getAllDocs(coll:string): Promise<any[]> {

        let results:any[] = [];

        try {

            let snap_shot = await this.client.collection(coll).get();

            snap_shot.forEach((doc:any) => {
                results.push(doc.data());
            });
            
        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return results;
    }

    async removeData(info:_firestore): Promise<boolean> {

        let removed:boolean = false;

        try {

            await this.client.collection(info.coll).doc(info.id).delete();

            removed = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return removed;
    }

    arrayUnion(info:_firestore, search:_search): boolean {

        let modified:boolean = false;

        try {

            this.client.collection(info.coll).doc(info.id).update({
                [search.key] : firebase.firestore.FieldValue.arrayUnion(search.value)
            });

            modified = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return modified;
    }

    arrayRemove(info:_firestore, search:_search): boolean {

        let modified:boolean = false;

        try {

            this.client.collection(info.coll).doc(info.id).update({
                [search.key] : firebase.firestore.FieldValue.arrayRemove(search.value)
            });

            modified = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return modified;
    }

    incrementItem(info:_firestore, search:_search): boolean {

        let incremented:boolean = false;

        try {

            this.client.collection(info.coll).doc(info.id).update({
                [search.key] : firebase.firestore.FieldValue.increment(+search.value)
            });

            incremented = true;

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return incremented;
    } 
}