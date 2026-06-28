export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
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
          password_hash: string | null
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
          password_hash?: string | null
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
          password_hash?: string | null
          role?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      affiliate_commissions: {
        Row: {
          affiliate_id: string
          amount: number
          approved_at: string | null
          commission_type: string
          commission_value: number
          created_at: string
          currency: string
          id: string
          order_id: string
          paid_at: string | null
          payout_id: string | null
          referred_user_id: string | null
          rejected_at: string | null
          rejection_reason: string | null
          status: string
          validation_available_at: string | null
        }
        Insert: {
          affiliate_id: string
          amount: number
          approved_at?: string | null
          commission_type: string
          commission_value: number
          created_at?: string
          currency?: string
          id?: string
          order_id: string
          paid_at?: string | null
          payout_id?: string | null
          referred_user_id?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string
          validation_available_at?: string | null
        }
        Update: {
          affiliate_id?: string
          amount?: number
          approved_at?: string | null
          commission_type?: string
          commission_value?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string
          paid_at?: string | null
          payout_id?: string | null
          referred_user_id?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string
          validation_available_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_payout_fk"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "affiliate_payouts"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_fraud_flags: {
        Row: {
          affiliate_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          order_id: string | null
          reason: string
          referred_user_id: string | null
          severity: string
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          reason: string
          referred_user_id?: string | null
          severity?: string
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          reason?: string
          referred_user_id?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_fraud_flags_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          admin_note: string | null
          affiliate_id: string
          amount: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          payout_method: string | null
          payout_reference: string | null
          status: string
        }
        Insert: {
          admin_note?: string | null
          affiliate_id: string
          amount: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payout_method?: string | null
          payout_reference?: string | null
          status?: string
        }
        Update: {
          admin_note?: string | null
          affiliate_id?: string
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payout_method?: string | null
          payout_reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referral_clicks: {
        Row: {
          affiliate_id: string | null
          cookie_id: string | null
          created_at: string
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          landing_page: string | null
          referral_code: string
          user_agent: string | null
        }
        Insert: {
          affiliate_id?: string | null
          cookie_id?: string | null
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          landing_page?: string | null
          referral_code: string
          user_agent?: string | null
        }
        Update: {
          affiliate_id?: string | null
          cookie_id?: string | null
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          landing_page?: string | null
          referral_code?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referral_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          converted_at: string | null
          cookie_id: string | null
          created_at: string
          device_fingerprint: string | null
          first_click_id: string | null
          id: string
          ip_address: string | null
          referral_code: string
          referred_user_id: string
          status: string
        }
        Insert: {
          affiliate_id: string
          converted_at?: string | null
          cookie_id?: string | null
          created_at?: string
          device_fingerprint?: string | null
          first_click_id?: string | null
          id?: string
          ip_address?: string | null
          referral_code: string
          referred_user_id: string
          status?: string
        }
        Update: {
          affiliate_id?: string
          converted_at?: string | null
          cookie_id?: string | null
          created_at?: string
          device_fingerprint?: string | null
          first_click_id?: string | null
          id?: string
          ip_address?: string | null
          referral_code?: string
          referred_user_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_first_click_id_fkey"
            columns: ["first_click_id"]
            isOneToOne: false
            referencedRelation: "affiliate_referral_clicks"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          commission_type: string
          commission_value: number
          created_at: string
          default_coupon_id: string | null
          id: string
          payout_details: Json | null
          payout_method: string | null
          referral_code: string
          status: string
          total_approved: number
          total_paid: number
          total_pending: number
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_type?: string
          commission_value?: number
          created_at?: string
          default_coupon_id?: string | null
          id?: string
          payout_details?: Json | null
          payout_method?: string | null
          referral_code: string
          status?: string
          total_approved?: number
          total_paid?: number
          total_pending?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_type?: string
          commission_value?: number
          created_at?: string
          default_coupon_id?: string | null
          id?: string
          payout_details?: Json | null
          payout_method?: string | null
          referral_code?: string
          status?: string
          total_approved?: number
          total_paid?: number
          total_pending?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliates_default_coupon_id_fkey"
            columns: ["default_coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_articles: {
        Row: {
          author: string
          auto_generated: boolean
          category: string
          content: string
          created_at: string
          excerpt: string | null
          faq: Json | null
          featured_image_url: string | null
          id: string
          language_code: string
          meta_description: string | null
          published: boolean
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          auto_generated?: boolean
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          faq?: Json | null
          featured_image_url?: string | null
          id?: string
          language_code?: string
          meta_description?: string | null
          published?: boolean
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          auto_generated?: boolean
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          faq?: Json | null
          featured_image_url?: string | null
          id?: string
          language_code?: string
          meta_description?: string | null
          published?: boolean
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_automation_config: {
        Row: {
          ai_model: string
          articles_per_run: number
          auto_publish: boolean
          cron_schedule: string
          id: string
          image_model: string
          is_active: boolean
          languages: string[]
          last_run_at: string | null
          schedule_description: string | null
          updated_at: string
        }
        Insert: {
          ai_model?: string
          articles_per_run?: number
          auto_publish?: boolean
          cron_schedule?: string
          id?: string
          image_model?: string
          is_active?: boolean
          languages?: string[]
          last_run_at?: string | null
          schedule_description?: string | null
          updated_at?: string
        }
        Update: {
          ai_model?: string
          articles_per_run?: number
          auto_publish?: boolean
          cron_schedule?: string
          id?: string
          image_model?: string
          is_active?: boolean
          languages?: string[]
          last_run_at?: string | null
          schedule_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_generation_logs: {
        Row: {
          article_id: string | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          language: string
          status: string
          topic_id: string | null
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          language: string
          status: string
          topic_id?: string | null
        }
        Update: {
          article_id?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          language?: string
          status?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_generation_logs_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "blog_topics_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_topics_queue: {
        Row: {
          angle: string
          category: string
          created_at: string
          id: string
          last_attempted_at: string | null
          published_languages: string[] | null
          sort_order: number
          status: string
          target_keywords: string[] | null
          topic_ar: string | null
          topic_en: string | null
          topic_fr: string | null
        }
        Insert: {
          angle?: string
          category?: string
          created_at?: string
          id?: string
          last_attempted_at?: string | null
          published_languages?: string[] | null
          sort_order?: number
          status?: string
          target_keywords?: string[] | null
          topic_ar?: string | null
          topic_en?: string | null
          topic_fr?: string | null
        }
        Update: {
          angle?: string
          category?: string
          created_at?: string
          id?: string
          last_attempted_at?: string | null
          published_languages?: string[] | null
          sort_order?: number
          status?: string
          target_keywords?: string[] | null
          topic_ar?: string | null
          topic_en?: string | null
          topic_fr?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string
          display_name: string | null
          guest_email: string
          guest_name: string | null
          guest_token: string
          id: string
          last_message_at: string
          priority: string
          status: string
          subcategory: string | null
          tags: string[]
          unread_admin: number
          unread_user: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          category: string
          created_at?: string
          display_name?: string | null
          guest_email: string
          guest_name?: string | null
          guest_token?: string
          id?: string
          last_message_at?: string
          priority?: string
          status?: string
          subcategory?: string | null
          tags?: string[]
          unread_admin?: number
          unread_user?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          display_name?: string | null
          guest_email?: string
          guest_name?: string | null
          guest_token?: string
          id?: string
          last_message_at?: string
          priority?: string
          status?: string
          subcategory?: string | null
          tags?: string[]
          unread_admin?: number
          unread_user?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          attachments: Json
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_name: string | null
          sender_type: string
        }
        Insert: {
          attachments?: Json
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_name?: string | null
          sender_type: string
        }
        Update: {
          attachments?: Json
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_name?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          cookie_id: string | null
          coupon_id: string
          currency: string | null
          device_fingerprint: string | null
          discount_amount: number
          final_amount: number
          id: string
          ip_address: string | null
          order_id: string | null
          original_amount: number
          redeemed_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          cookie_id?: string | null
          coupon_id: string
          currency?: string | null
          device_fingerprint?: string | null
          discount_amount: number
          final_amount: number
          id?: string
          ip_address?: string | null
          order_id?: string | null
          original_amount: number
          redeemed_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          cookie_id?: string | null
          coupon_id?: string
          currency?: string | null
          device_fingerprint?: string | null
          discount_amount?: number
          final_amount?: number
          id?: string
          ip_address?: string | null
          order_id?: string | null
          original_amount?: number
          redeemed_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage_attempts: {
        Row: {
          code: string
          cookie_id: string | null
          coupon_id: string | null
          created_at: string
          device_fingerprint: string | null
          failure_reason: string | null
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          code: string
          cookie_id?: string | null
          coupon_id?: string | null
          created_at?: string
          device_fingerprint?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          cookie_id?: string | null
          coupon_id?: string | null
          created_at?: string
          device_fingerprint?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          allowed_user_ids: string[] | null
          applicable_product_ids: string[] | null
          applicable_product_types: string[] | null
          code: string
          created_at: string
          created_by_admin_id: string | null
          currency: string | null
          description: string | null
          discount_type: string
          discount_value: number
          excluded_product_ids: string[] | null
          excluded_user_ids: string[] | null
          expires_at: string | null
          id: string
          is_trial: boolean
          linked_affiliate_id: string | null
          max_total_uses: number | null
          max_uses_per_device: number | null
          max_uses_per_user: number | null
          minimum_order_amount: number | null
          name: string | null
          starts_at: string | null
          status: string
          total_uses: number
          updated_at: string
        }
        Insert: {
          allowed_user_ids?: string[] | null
          applicable_product_ids?: string[] | null
          applicable_product_types?: string[] | null
          code: string
          created_at?: string
          created_by_admin_id?: string | null
          currency?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          excluded_product_ids?: string[] | null
          excluded_user_ids?: string[] | null
          expires_at?: string | null
          id?: string
          is_trial?: boolean
          linked_affiliate_id?: string | null
          max_total_uses?: number | null
          max_uses_per_device?: number | null
          max_uses_per_user?: number | null
          minimum_order_amount?: number | null
          name?: string | null
          starts_at?: string | null
          status?: string
          total_uses?: number
          updated_at?: string
        }
        Update: {
          allowed_user_ids?: string[] | null
          applicable_product_ids?: string[] | null
          applicable_product_types?: string[] | null
          code?: string
          created_at?: string
          created_by_admin_id?: string | null
          currency?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          excluded_product_ids?: string[] | null
          excluded_user_ids?: string[] | null
          expires_at?: string | null
          id?: string
          is_trial?: boolean
          linked_affiliate_id?: string | null
          max_total_uses?: number | null
          max_uses_per_device?: number | null
          max_uses_per_user?: number | null
          minimum_order_amount?: number | null
          name?: string | null
          starts_at?: string | null
          status?: string
          total_uses?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_linked_affiliate_fk"
            columns: ["linked_affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_payment_intents: {
        Row: {
          amount_usd: number
          coin: string
          confirmations: number
          confirmed_at: string | null
          created_at: string
          detected_amount: number | null
          expected_amount: number
          expires_at: string
          id: string
          last_checked_at: string | null
          min_confirmations: number
          network: string
          order_id: string
          receiving_address: string
          status: string
          tolerance_pct: number
          tx_hash: string | null
          updated_at: string
        }
        Insert: {
          amount_usd: number
          coin: string
          confirmations?: number
          confirmed_at?: string | null
          created_at?: string
          detected_amount?: number | null
          expected_amount: number
          expires_at: string
          id?: string
          last_checked_at?: string | null
          min_confirmations?: number
          network: string
          order_id: string
          receiving_address: string
          status?: string
          tolerance_pct?: number
          tx_hash?: string | null
          updated_at?: string
        }
        Update: {
          amount_usd?: number
          coin?: string
          confirmations?: number
          confirmed_at?: string | null
          created_at?: string
          detected_amount?: number | null
          expected_amount?: number
          expires_at?: string
          id?: string
          last_checked_at?: string | null
          min_confirmations?: number
          network?: string
          order_id?: string
          receiving_address?: string
          status?: string
          tolerance_pct?: number
          tx_hash?: string | null
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
      email_template_overrides: {
        Row: {
          enabled: boolean
          overrides: Json
          template_name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          enabled?: boolean
          overrides?: Json
          template_name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          enabled?: boolean
          overrides?: Json
          template_name?: string
          updated_at?: string
          updated_by?: string | null
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
      homepage_content: {
        Row: {
          content_data: Json
          created_at: string
          id: string
          is_enabled: boolean
          section_key: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          content_data?: Json
          created_at?: string
          id?: string
          is_enabled?: boolean
          section_key: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          content_data?: Json
          created_at?: string
          id?: string
          is_enabled?: boolean
          section_key?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      iptv_credit_options: {
        Row: {
          created_at: string | null
          credits: number
          id: string
          package_id: string
          price: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits: number
          id?: string
          package_id: string
          price: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits?: number
          id?: string
          package_id?: string
          price?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iptv_credit_options_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "iptv_packages"
            referencedColumns: ["id"]
          },
        ]
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
          low_stock_threshold: number
          name: string
          price_1_month: number | null
          price_10_credits: number | null
          price_100_credits: number | null
          price_12_months: number | null
          price_25_credits: number | null
          price_3_months: number | null
          price_50_credits: number | null
          price_6_months: number | null
          quantity_promo_mode: string
          quantity_promos: Json
          sort_order: number | null
          status: Database["public"]["Enums"]["package_status"] | null
          stock_by_plan: Json
          stock_enabled: boolean
          stock_quantity: number
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
          low_stock_threshold?: number
          name: string
          price_1_month?: number | null
          price_10_credits?: number | null
          price_100_credits?: number | null
          price_12_months?: number | null
          price_25_credits?: number | null
          price_3_months?: number | null
          price_50_credits?: number | null
          price_6_months?: number | null
          quantity_promo_mode?: string
          quantity_promos?: Json
          sort_order?: number | null
          status?: Database["public"]["Enums"]["package_status"] | null
          stock_by_plan?: Json
          stock_enabled?: boolean
          stock_quantity?: number
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
          low_stock_threshold?: number
          name?: string
          price_1_month?: number | null
          price_10_credits?: number | null
          price_100_credits?: number | null
          price_12_months?: number | null
          price_25_credits?: number | null
          price_3_months?: number | null
          price_50_credits?: number | null
          price_6_months?: number | null
          quantity_promo_mode?: string
          quantity_promos?: Json
          sort_order?: number | null
          status?: Database["public"]["Enums"]["package_status"] | null
          stock_by_plan?: Json
          stock_enabled?: boolean
          stock_quantity?: number
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
          affiliate_id: string | null
          amount: number
          coupon_code: string | null
          coupon_id: string | null
          created_at: string | null
          credentials_delivered_at: string | null
          credentials_expiration: string | null
          credentials_notes: string | null
          customer_email: string
          customer_name: string
          customer_whatsapp: string | null
          discount_amount: number | null
          duration_months: number
          id: string
          m3u_url: string | null
          mac_addresses: Json
          order_type: string
          original_amount: number | null
          package_category: string
          package_id: string | null
          package_name: string
          payment_status: string
          quantity: number
          referral_cookie_id: string | null
          status: string
          updated_at: string | null
          xtream_host: string | null
          xtream_password: string | null
          xtream_port: string | null
          xtream_username: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string | null
          credentials_delivered_at?: string | null
          credentials_expiration?: string | null
          credentials_notes?: string | null
          customer_email: string
          customer_name: string
          customer_whatsapp?: string | null
          discount_amount?: number | null
          duration_months: number
          id?: string
          m3u_url?: string | null
          mac_addresses?: Json
          order_type?: string
          original_amount?: number | null
          package_category: string
          package_id?: string | null
          package_name: string
          payment_status?: string
          quantity?: number
          referral_cookie_id?: string | null
          status?: string
          updated_at?: string | null
          xtream_host?: string | null
          xtream_password?: string | null
          xtream_port?: string | null
          xtream_username?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string | null
          credentials_delivered_at?: string | null
          credentials_expiration?: string | null
          credentials_notes?: string | null
          customer_email?: string
          customer_name?: string
          customer_whatsapp?: string | null
          discount_amount?: number | null
          duration_months?: number
          id?: string
          m3u_url?: string | null
          mac_addresses?: Json
          order_type?: string
          original_amount?: number | null
          package_category?: string
          package_id?: string | null
          package_name?: string
          payment_status?: string
          quantity?: number
          referral_cookie_id?: string | null
          status?: string
          updated_at?: string | null
          xtream_host?: string | null
          xtream_password?: string | null
          xtream_port?: string | null
          xtream_username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "iptv_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          provider: string | null
          saved_profiles: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
          provider?: string | null
          saved_profiles?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          provider?: string | null
          saved_profiles?: Json
          updated_at?: string
        }
        Relationships: []
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
          low_stock_threshold: number
          name: string
          price_12_credits: number | null
          price_3_credits: number | null
          price_6_credits: number | null
          quantity_promo_mode: string
          quantity_promos: Json
          sort_order: number | null
          status: string | null
          stock_by_plan: Json
          stock_enabled: boolean
          stock_quantity: number
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
          low_stock_threshold?: number
          name: string
          price_12_credits?: number | null
          price_3_credits?: number | null
          price_6_credits?: number | null
          quantity_promo_mode?: string
          quantity_promos?: Json
          sort_order?: number | null
          status?: string | null
          stock_by_plan?: Json
          stock_enabled?: boolean
          stock_quantity?: number
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
          low_stock_threshold?: number
          name?: string
          price_12_credits?: number | null
          price_3_credits?: number | null
          price_6_credits?: number | null
          quantity_promo_mode?: string
          quantity_promos?: Json
          sort_order?: number | null
          status?: string | null
          stock_by_plan?: Json
          stock_enabled?: boolean
          stock_quantity?: number
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
      delete_all_published_feedback: { Args: never; Returns: number }
      is_admin_user: { Args: never; Returns: boolean }
      reset_product_sales: { Args: never; Returns: number }
      update_blog_cron_schedule: {
        Args: { new_schedule: string }
        Returns: undefined
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
        SetofOptions: {
          from: "*"
          to: "site_settings"
          isOneToOne: true
          isSetofReturn: false
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
