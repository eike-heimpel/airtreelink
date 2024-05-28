// fields.ts

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

export type ContentField = TextField | VideoField | AddressField | LinkField;


