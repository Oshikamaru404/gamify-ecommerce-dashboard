export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          created_backup_codes_at: string | null
          id: string
          role: string | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          created_backup_codes_at?: string | null
          id?: string
          role?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          created_backup_codes_at?: string | null
          id?: string
          role?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      blog_articles: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_date: string | null
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_date?: string | null
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_date?: string | null
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          comment: string
          created_at: string
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          id: string
          name: string
          status: Database["public"]["Enums"]["feedback_status"]
          updated_at: string | null
        }
        Insert: {
          comment: string
          created_at?: string
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          id?: string
          name: string
          status?: Database["public"]["Enums"]["feedback_status"]
          updated_at?: string | null
        }
        Update: {
          comment?: string
          created_at?: string
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["feedback_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      iptv_packages: {
        Row: {
          category: Database["public"]["Enums"]["package_category"]
          created_at: string | null
          description: string | null
          features: string[] | null
          icon: string | null
          icon_url: string | null
          id: string
          name: string
          price_1_month: number | null
          price_10_credits: number | null
          price_100_credits: number | null
          price_12_months: number | null
          price_25_credits: number | null
          price_3_months: number | null
          price_50_credits: number | null
          price_6_months: number | null
          sort_order: number | null
          status: Database["public"]["Enums"]["package_status"] | null
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["package_category"]
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          name: string
          price_1_month?: number | null
          price_10_credits?: number | null
          price_100_credits?: number | null
          price_12_months?: number | null
          price_25_credits?: number | null
          price_3_months?: number | null
          price_50_credits?: number | null
          price_6_months?: number | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["package_status"] | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["package_category"]
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          price_1_month?: number | null
          price_10_credits?: number | null
          price_100_credits?: number | null
          price_12_months?: number | null
          price_25_credits?: number | null
          price_3_months?: number | null
          price_50_credits?: number | null
          price_6_months?: number | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["package_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_whatsapp: string | null
          duration_months: number
          id: string
          order_type: string
          package_category: string
          package_id: string | null
          package_name: string
          payment_status: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_whatsapp?: string | null
          duration_months: number
          id?: string
          order_type?: string
          package_category: string
          package_id?: string | null
          package_name: string
          payment_status?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_whatsapp?: string | null
          duration_months?: number
          id?: string
          order_type?: string
          package_category?: string
          package_id?: string | null
          package_name?: string
          payment_status?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "iptv_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_credit_options: {
        Row: {
          created_at: string | null
          credits: number
          id: string
          months: number
          package_id: string
          price: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits: number
          id?: string
          months: number
          package_id: string
          price: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits?: number
          id?: string
          months?: number
          package_id?: string
          price?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_credit_options_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "subscription_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_packages: {
        Row: {
          created_at: string | null
          credits_12_months: number | null
          credits_3_months: number | null
          credits_6_months: number | null
          description: string | null
          features: string[] | null
          icon: string | null
          icon_url: string | null
          id: string
          name: string
          price_12_credits: number | null
          price_3_credits: number | null
          price_6_credits: number | null
          sort_order: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits_12_months?: number | null
          credits_3_months?: number | null
          credits_6_months?: number | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          name: string
          price_12_credits?: number | null
          price_3_credits?: number | null
          price_6_credits?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits_12_months?: number | null
          credits_3_months?: number | null
          credits_6_months?: number | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          price_12_credits?: number | null
          price_3_credits?: number | null
          price_6_credits?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      translated_content: {
        Row: {
          content_key: string
          content_value: string
          created_at: string
          id: string
          language_code: string
          updated_at: string
        }
        Insert: {
          content_key: string
          content_value: string
          created_at?: string
          id?: string
          language_code: string
          updated_at?: string
        }
        Update: {
          content_key?: string
          content_value?: string
          created_at?: string
          id?: string
          language_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: string
          language_code: string
          translation_key: string
          translation_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language_code: string
          translation_key: string
          translation_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language_code?: string
          translation_key?: string
          translation_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          created_at: string
          id: string
          template_key: string
          template_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          template_key: string
          template_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          template_key?: string
          template_value?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_all_published_feedback: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      reset_product_sales: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      upsert_site_setting: {
        Args: { p_setting_key: string; p_setting_value: string }
        Returns: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
      }
    }
    Enums: {
      feedback_status: "pending" | "approved" | "rejected"
      feedback_type: "positive" | "neutral" | "negative"
      package_category:
        | "subscription"
        | "reseller"
        | "player"
        | "panel-iptv"
        | "activation-player"
      package_status: "active" | "inactive" | "featured"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      feedback_status: ["pending", "approved", "rejected"],
      feedback_type: ["positive", "neutral", "negative"],
      package_category: [
        "subscription",
        "reseller",
        "player",
        "panel-iptv",
        "activation-player",
      ],
      package_status: ["active", "inactive", "featured"],
    },
  },
} as const
