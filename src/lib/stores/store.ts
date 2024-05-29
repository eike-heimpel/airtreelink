import { writable } from "svelte/store";

export const editMode = writable(false)
export const showListingSettings = writable(false)
export const previewMode = writable(false)

export const toastPromiseDelayMs = writable(100) // time to delay toasts after a successful page update to allow the page to actually update in the background before the success message


export function localStore(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    const data = storedValue ? JSON.parse(storedValue) : initialValue;
    const store = writable(data);

    store.subscribe(value => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}