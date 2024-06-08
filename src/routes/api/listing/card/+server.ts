import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';


const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
});

export const POST: RequestHandler = async ({ request, locals: { session, supabase } }) => {
    console.log("Received POST request to update cards");

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const { cards, images, listingHash } = await request.json();

    if (!cards || !Array.isArray(cards)) {
        console.log("Invalid payload: Cards array is required");
        throw error(400, 'Cards array is required');
    }

    // Upload images and update card data
    const updatedCards = await processImagesAndUpdateCards(cards, images, listingHash, supabaseServiceClient);

    const inserts = updatedCards.map((card) => {
        card.user_id = session.user.id;
        card.last_changed = new Date().toISOString();

        if (!card) {
            console.log("No card provided");
            throw error(400, 'Card is required');
        }

        return supabase
            .from('listing_cards')
            .insert(card);
    });

    try {
        const results = await Promise.all(inserts);

        results.forEach(({ error: cardError }) => {
            if (cardError) {
                console.error('Error inserting card:', cardError);
                throw error(500, 'Error inserting card');
            }
        });

        return json({ message: 'Inserted cards successfully' });
    } catch (err) {
        console.error('Error inserting cards:', err);
        throw error(500, 'Error inserting cards');
    }
};
export const PUT: RequestHandler = async ({ request, locals: { session, supabase } }) => {
    console.log("Received PUT request to update cards");
  
    if (!session) {
      throw error(401, 'Unauthorized');
    }
  
    const { cards, images, imagesToDelete, listingHash } = await request.json();
  
    if (!cards || !Array.isArray(cards)) {
      console.log("Invalid payload: Cards array is required");
      throw error(400, 'Cards array is required');
    }
  
    // Upload images and update card data
    console.log(images)
    console.log(imagesToDelete)
    const updatedCards = await processImagesAndUpdateCards(cards, images, listingHash, supabaseServiceClient);
  
    const updates = updatedCards.map((card) => {
      if (!card.id) {
        console.log("Card ID is required");
        throw error(400, 'Card ID is required');
      }
  
      const updateData = { ...card };
      delete updateData.id;
  
      return supabaseServiceClient
        .from('listing_cards')
        .update(updateData)
        .eq('user_id', session.user.id)
        .eq('id', card.id);
    });
  
    try {
      const results = await Promise.all(updates);
  
      results.forEach(({ error: cardError }) => {
        if (cardError) {
          console.error('Error updating card:', cardError);
          throw error(500, 'Error updating card');
        }
      });
  
      // Delete images marked for deletion
      if (imagesToDelete.length > 0) {
        const { data, error: deleteError } = await supabaseServiceClient.storage
          .from('listing_images')
          .remove(imagesToDelete);
  
        if (deleteError) {
          console.error('Error deleting images:', error);
          throw error(500, 'Error deleting images');
        }

        console.log(`Deleted images: ${imagesToDelete.join(', ')}`);
      }
  
      return json({ message: 'Updated cards successfully' });
    } catch (err) {
      console.error('Error updating cards:', err);
      throw error(500, 'Error updating cards');
    }
  };
  

async function processImagesAndUpdateCards(cards, images, listingHash, supabase) {
  const updatedCards = cards.map(card => ({ ...card }));

  for (const image of images) {
    const { index, file, altText, fileName } = image;

    if (typeof index !== 'number') {
      console.error('Invalid index:', index);
      throw new Error('Invalid index');
    }

    // Convert base64 image to buffer
    const buffer = Buffer.from(file, 'base64');
    const filePath = `${listingHash}/${fileName}`;

    console.log(`Processing image for card content field at index ${index}, path: ${filePath}`);

    try {

        const newFileName = fileName.replace(/\.[^/.]+$/, '.webp');
        const newFilePath = `${listingHash}/${newFileName}`;


      const { data: imageData, error: imageUploadError } = await supabase.storage
        .from('listing_images')
        .upload(newFilePath, buffer, { upsert: true });

      if (imageUploadError) {
        if (imageUploadError.message === 'The resource already exists') {
          updatedCards.forEach(card => {
            if (card.content_fields[index]) {
              card.content_fields[index].fileName = newFileName;
              card.content_fields[index].altText = altText;
            }
          });

          console.log(`Image already exists. Using existing file: ${listingHash}/${newFileName}`);
          continue;
        }

        console.error('Error uploading file:', imageUploadError.message);
        throw new Error(imageUploadError.message);
      }

      updatedCards.forEach(card => {
        if (card.content_fields[index]) {
          card.content_fields[index].fileName = newFileName;
          card.content_fields[index].altText = altText;
        }
      });

    } catch (uploadError) {
      console.error('Error processing image upload:', uploadError);
      throw uploadError;
    }
  }

  return updatedCards;
}