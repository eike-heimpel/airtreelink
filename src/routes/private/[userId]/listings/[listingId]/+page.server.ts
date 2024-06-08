
import { error } from "@sveltejs/kit";
import { nanoid } from "nanoid";
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import sharp from 'sharp';

const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
});

export const load = async ({ request, cookies, parent, params, locals: { supabase, session } }) => {


    const listingId = parseInt(params.listingId);

    const parents = await parent();
    const currentListingInfo = parents.listings.find(listing => listing.id === listingId);

    const { data: listingCards, error: listingCardsError } = await supabase.from('listing_cards').select('*').eq('listing_id', listingId).order('sort_order', { ascending: true });
    ;

    if (listingCardsError) {
        throw error(500, listingCardsError);
    }

    const cards = Object.values(listingCards);


    return { currentListingInfo, cards};
};

export const actions = {

    publish: async ({ request, locals }) => {
        const formData = await request.formData();

        const id = parseInt(formData.get('id')?.toString() || '');

        const publicStatus = formData.get('public') === 'true';
        try {
            const response = await locals.supabase.from('Listings').update({ public: publicStatus }).eq('id', id);
            if (response.error) throw new Error(response.error.message);
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    },

    delete: async ({ request, locals }) => {
        const formData = await request.formData();

        const id = parseInt(formData.get('id')?.toString() || '');
        const imageHash = formData.get('imageHash')?.toString() || '';
        const listingHash = formData.get('listingHash')?.toString() || '';

        try {
            const response = await locals.supabase.from('Listings').delete().eq('id', id);

            if (response.error) throw new Error(response.error.message);

            // delete the image now
            const { data: deleteImage, error: deleteImageError } = await supabaseServiceClient.storage
                .from('listing_images')
                .remove([`${listingHash}/${imageHash}.webp`]);

            if (deleteImageError) {
                console.error('Error deleting image:', deleteImageError);
            }

            return { success: true };
        } catch (error) {
            console.log("could not delete listing", error);
            return { error: error.message };
        }
    },

    updateListing: async ({ request, locals, params }) => {


        const formData = await request.formData();

        const id = parseInt(params.listingId);
        
        const name = formData.get('name') as string;
        const titleImageBase64 = formData.get('titleImageBase64') as string;
        const listingHash = formData.get('listingHash') as string;
        const oldImageHash = formData.get('oldImageHash') as string;
        const description = "";
        const imageHash = nanoid(12);

        try {


            if (titleImageBase64) {
                const buffer = Buffer.from(titleImageBase64, 'base64');
                const filePath = `${listingHash}/${imageHash}.webp`;


                    const { data: imageData, error: imageUploadError } = await supabaseServiceClient.storage
                    .from('listing_images')
                    .upload(filePath, buffer, { upsert: true });

        
                if (imageUploadError) {

                    if (imageUploadError.message === 'The resource already exists') {
            
                        console.log(`Image already exists. Using existing file: ${filePath}`);

                    } else {
                        console.error(`Failed to upload file: ${filePath}`, imageUploadError.message);
                        throw error(500, 'Failed to upload file');
                    }
                }

                console.log(`Uploaded image: ${filePath}`);

                // now we need to delete the old image
                const { data: deleteImage, error: deleteImageError } = await supabaseServiceClient.storage
                    .from('listing_images')
                    .remove([`${listingHash}/${oldImageHash}.webp`]);

                if (deleteImageError) {
                    console.error('Error deleting old image:', deleteImageError);
                }

            }

            const response = await locals.supabase.from('Listings').update({ name, description, title_image_hash: imageHash }).eq('id', id);

            if (response.error) throw new Error(response.error.message);
            return { success: true };
        } catch (error) {
            console.log("could not update listing", error);
            return { error: error.message };
        }
    },

    deleteCard: async ({ request, locals }) => {
        const formData = await request.formData();
        const cardId = parseInt(formData.get('cardId')?.toString() || '');

        if (!cardId) {
            error(400, { message: 'Invalid card id' });
        }

        const { data: card, error: cardError } = await locals.supabase.from('listing_cards').delete().eq('id', cardId);

        if (cardError) {
            return error(500, { message: 'Failed to delete card' });
        }

        console.log("card deleted")
        return { success: true };



    },

};
