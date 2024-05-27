export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      listing_cards: {
        Row: {
          content_fields: Json | null
          created_at: string
          decription: string | null
          id: number
          is_recommended: boolean
          last_changed: string
          listing_id: number
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          content_fields?: Json | null
          created_at?: string
          decription?: string | null
          id?: number
          is_recommended?: boolean
          last_changed?: string
          listing_id: number
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content_fields?: Json | null
          created_at?: string
          decription?: string | null
          id?: number
          is_recommended?: boolean
          last_changed?: string
          listing_id?: number
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Listing_Cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ListingCards_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "Listings"
            referencedColumns: ["id"]
          },
        ]
      }
      Listings: {
        Row: {
          cards: Json | null
          created_at: string
          description: string | null
          hash: string
          id: number
          last_changed: string
          name: string
          public: boolean
          title_image_url: string | null
          user_id: string
        }
        Insert: {
          cards?: Json | null
          created_at?: string
          description?: string | null
          hash: string
          id?: number
          last_changed?: string
          name: string
          public: boolean
          title_image_url?: string | null
          user_id?: string
        }
        Update: {
          cards?: Json | null
          created_at?: string
          description?: string | null
          hash?: string
          id?: number
          last_changed?: string
          name?: string
          public?: boolean
          title_image_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          account_id: string
          created_at: string
          email: string | null
          id: string
          profile_status: string | null
        }
        Insert: {
          account_id?: string
          created_at?: string
          email?: string | null
          id?: string
          profile_status?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string
          email?: string | null
          id?: string
          profile_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_logs: {
        Row: {
          amount: number
          charge_id: string
          created_at: string
          customer_email: string | null
          description: string | null
          event_type: string
          id: number
          status: string | null
        }
        Insert: {
          amount: number
          charge_id: string
          created_at: string
          customer_email?: string | null
          description?: string | null
          event_type: string
          id?: number
          status?: string | null
        }
        Update: {
          amount?: number
          charge_id?: string
          created_at?: string
          customer_email?: string | null
          description?: string | null
          event_type?: string
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      stripe_disputes: {
        Row: {
          amount: number
          charge_id: string
          created_at: string
          customer_email: string | null
          event_type: string
          id: number
          reason: string | null
          status: string | null
        }
        Insert: {
          amount: number
          charge_id: string
          created_at: string
          customer_email?: string | null
          event_type: string
          id?: number
          reason?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          charge_id?: string
          created_at?: string
          customer_email?: string | null
          event_type?: string
          id?: number
          reason?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
