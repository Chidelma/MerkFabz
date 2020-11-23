import firebase from 'firebase/app';
import 'firebase/firestore';
import { _firebase, _user, _firestore, _key_val, _item, _cart, _role, _order } from './Models';

export default class Firestore {

    private client:firebase.firestore.Firestore;

    constructor(config:_firebase) {
        this.client = firebase.initializeApp(config).firestore();
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

        if(doc.exists) {
            data = doc.data();
        }

        return data;
    }

    async getDocs(coll:string, search:_key_val): Promise<any[]> {

        let results:any[] = [];

        let snap_shot = await this.client.collection(coll).where(search.key, "==", search.value).get();

        try {

            snap_shot.forEach((doc:any) => {
                results.push(doc.data());
            });

        } catch(err:any) {
            console.log(err.code, err.message);
        }

        return results;
    }
}