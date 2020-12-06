import { Writable, writable } from 'svelte/store';

export default class State<T> {

    private store:Writable<T>;

    constructor(obj:T) {
        this.store = writable(obj);
    }

    set(obj:T) {
        this.store.set(obj);
    }

    get(): T {

        let obj:any;

        this.store.update((state:T) => {
            obj = state;
            return state;
        });

        return obj;
    }
}