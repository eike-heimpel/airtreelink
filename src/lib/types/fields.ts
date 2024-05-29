// fields.ts

import { nanoid } from 'nanoid';

export type TextField = {
    id: string;
    type: 'text';
    content: string;
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
}

export type ContentField = TextField | VideoField | AddressField | LinkField | ImageField;

export type FieldTypes = 'text' | 'video' | 'address' | 'link' | 'image';

export function createEmptyField(type: FieldTypes): ContentField {
    const id = nanoid(10);
    switch (type) {
        case 'text':
            return { id, type, content: '' };
        case 'video':
            return { id, type, content: '', url: '' };
        case 'address':
            return { id, type, content: '', showDirections: false, showAddressAsText: false };
        case 'link':
            return { id, type, content: '', url: '' };
        case 'image':
            return { id, type, altText: '', url: '' };
        default:
            throw new Error(`Unsupported field type: ${type}`);
    }
}
