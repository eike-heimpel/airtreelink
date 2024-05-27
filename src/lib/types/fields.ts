// fields.ts

export type TextField = {
	type: 'text';
	content: string;
};

export type VideoField = {
	type: 'video';
	content: string;
	url: string;
};

export type AddressField = {
	type: 'address';
	content: string;
    showDirections?: boolean;
    showAddressAsText?: boolean;
};

export type LinkField = {
	type: 'link';
	content: string;
	url: string;
};

export type ContentField = TextField | VideoField | AddressField | LinkField;


