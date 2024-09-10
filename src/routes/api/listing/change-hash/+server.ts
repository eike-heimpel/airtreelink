import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { randomBytes, createHash } from 'crypto';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { createFolder } from '@supabase/storage-helpers';



const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
});


export const POST: RequestHandler = async ({ request, locals: { session, supabase } }) => {

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const { listingId } = await request.json();

    if (!listingId) {
        throw error(400, 'Listing ID is required');
    }

    // Generate a secure SHA-256 hash and encode in base64
    const randomString = randomBytes(32).toString('hex');
    const newHash = createHash('sha256').update(randomString).digest('base64');

    // Retrieve the current listing details to get the old hash
    const { data: listingData, error: fetchError } = await supabase
        .from('Listings')
        .select('hash')
        .eq('id', listingId)
        .single();

    if (fetchError) {
        console.error('Error fetching listing:', fetchError);
        throw error(500, 'Error fetching listing');
    }

    const oldHash = listingData.hash;

    // Update the listing with the new hash
    const { data, error: updateError } = await supabase
        .from('Listings')
        .update({ hash: newHash })
        .eq('id', listingId)
        .eq('user_id', session.user.id);

    if (updateError) {
        console.error('Error updating hash:', updateError);
        throw error(500, 'Error updating hash');
    }

    // Rename the folder in the storage bucket
    const bucketName = 'listing_images';
    const oldFolderPath = oldHash;
    const newFolderPath = newHash;

    const { error: moveError } = await moveFolder(bucketName, oldFolderPath, newFolderPath);

    if (moveError) {
        console.error('Error renaming folder:', moveError);

        // Revert the listing hash update
        
        const { error: revertError } = await supabase
            .from('Listings')
            .update({ hash: oldHash })
            .eq('id', listingId)
            .eq('user_id', session.user.id);

        if (revertError) {
            console.error('Error reverting hash update:', revertError);
            throw error(500, 'Error reverting hash update');
        }

        console.log('Hash update reverted successfully');

        throw error(500, 'Error renaming folder');
    }

    return json({ message: 'Hash updated successfully' });
};



async function moveFolder( bucketName: string, oldFolderPath: string, newFolderPath: string) {
    try {
        // List all files in the old folder
        const { data: files, error: listError } = await supabaseServiceClient
            .storage
            .from(bucketName)
            .list(oldFolderPath, { limit: 100 });

        if (listError) {
            console.error('Error listing files:', listError);
            throw listError;
        }

        // Copy each file to the new folder
        for (const file of files) {
            const oldFilePath = `${oldFolderPath}/${file.name}`;
            const newFilePath = `${newFolderPath}/${file.name}`;

            const { error: copyError } = await supabaseServiceClient
                .storage
                .from(bucketName)
                .copy(oldFilePath, newFilePath);

            if (copyError) {
                console.error('Error copying file:', copyError);
                throw copyError;
            }
        }

        // Delete the old files
        let filePaths = [];
        for (const file of files) {
            const oldFilePath = `${oldFolderPath}/${file.name}`;
            filePaths.push(oldFilePath);
        }

        const { error: deleteError }= await supabaseServiceClient
                    .storage
                    .from(bucketName)
                    .remove(filePaths);

        if (deleteError) {
            console.error('Error deleting files:', deleteError);
            throw deleteError;
        }

        return { error: null };
    } catch (error) {
        return { error };
    }
}
