// fields.ts

import { nanoid } from 'nanoid';

export type TextField = {
    id: string;
    type: 'text';
    content: string;
    delta?: string;
};

export type VideoField = {
    id: string;
    type: 'video';
    content: string;
    url: string;
};

export type AddressField = {
    id: string;
    type: 'address';
    content: string;
    showDirections?: boolean;
    showAddressAsText?: boolean;
};

export type LinkField = {
    id: string;
    type: 'link';
    content: string;
    url: string;
};

export type ImageField = {
    id: string;
    type: "image"; 
    altText: string;
    url: string;
    path: string;
}

export type ContentField = TextField | VideoField | AddressField | LinkField | ImageField;
export type ArrivalContentField = TextField | AddressField;

export type FieldTypes = 'text' | 'video' | 'address' | 'link' | 'image';

export function createEmptyField(type: FieldTypes): ContentField {
    const id = nanoid(10);
    switch (type) {
        case 'text':
            return { id, type, content: '', delta: "" } as TextField;
        case 'video':
            return { id, type, content: '', url: '' } as VideoField;
        case 'address':
            return { id, type, content: '', showDirections: true } as AddressField;
        case 'link':
            return { id, type, content: '', url: '' } as  LinkField;
        case 'image':
            return { id, type, altText: '', url: '', path: '' } as ImageField;
        default:
            throw new Error(`Unsupported field type: ${type}`);
    }
}
