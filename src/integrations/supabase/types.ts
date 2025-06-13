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
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
          username?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_all_published_feedback: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      reset_product_sales: {
        Args: Record<PropertyKey, never>
        Returns: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
