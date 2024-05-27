import { writable } from "svelte/store";

export const editMode = writable(false)
export const showListingSettings = writable(false)
export const previewMode = writable(false)


export function localStore(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    const data = storedValue ? JSON.parse(storedValue) : initialValue;
    const store = writable(data);

    store.subscribe(value => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}