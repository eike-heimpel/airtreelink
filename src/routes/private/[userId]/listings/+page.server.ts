import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createHash, randomBytes } from 'crypto';
import type { Database } from '$lib/types/supabase';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
});


type Listing = Database['public']['Tables']['Listings']['Row'];


export const load = async ({ locals: { session }, parent }) => {

    const parentData = await parent();

    if (!session || !session.user || !session.user.email) {
        throw error(403, { message: 'Not authenticated' });
    }

    return { listings: parentData.listings };

}


export const actions: Actions = {
    default: async ({ request, locals }) => {

        const data = await request.formData();

        const name = data.get('name');
        const titleImageBase64 = data.get('titleImageBase64')?.toString() || '';
        const description: string | null = "";

        if (!name || !titleImageBase64) {
            return error(400, { message: 'All fields are required' });
        }

        const randomString = randomBytes(32).toString('hex');
        const hash = createHash('sha256').update(randomString).digest('base64'); // Generate a secure SHA-256 hash and encode in base64
        const imageHash = nanoid(12);

        try {

            const buffer = Buffer.from(titleImageBase64, 'base64');
            const filePath = `${hash}/${imageHash}.webp`;
            const metadata = await sharp(buffer).metadata();

            if (metadata.width && metadata.height && metadata.width < 1920 && metadata.height < 1080) throw error(400, 'Image is too small, please upload at least 1920x1080');

            const optimizedBuffer = await sharp(buffer)
                .resize({ width: 1920, height: 1080, fit: sharp.fit.cover }) 
                .webp({ quality: 75 }) 
                .toBuffer();

                const { data: imageData, error: imageUploadError } = await supabaseServiceClient.storage
                .from('listing_images')
                .upload(filePath, optimizedBuffer, { upsert: true });

    
            if (imageUploadError) {

                if (imageUploadError.message === 'The resource already exists') {
        
                    console.log(`Image already exists. Using existing file: ${filePath}`);

                } else {
                    console.error(`Failed to upload file: ${filePath}`, imageUploadError.message);
                    throw error(500, 'Failed to upload file');
                }
            }

            console.log(`Uploaded image: ${filePath}`);

            const response = await locals.supabase
                .from('Listings')
                .insert([{ name, description, title_image_hash: imageHash, public: false, hash} as Listing]);

            
            if (response.error) {
                console.log(response.error);
                return error(500, { message: 'Failed to add listing' });
            }

            return { success: true };
        } catch (err) {
            console.error('Unexpected error:', err);
            return error(500, { message: 'An unexpected error occurred' });
        }

    }

};
