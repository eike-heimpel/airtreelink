import type { ContentField } from '$lib/types/fields';
import type { Database } from '$lib/types/supabase';

export type ListingCard = Omit<
Database['public']['Tables']['listing_cards']['Row'],
'content_fields'
> & {
content_fields: ContentField[];
};


// lets add a listing card type that omits the id field and the created_at field
export type ListingCardCreate = Omit<ListingCard, 'id' | 'created_at' | 'user_id' | 'last_changed' | "sort_order">;