// src/types/supabase.ts
// 🛡️ Ghost-Proof Database Types - Auto-generated from Enhanced Schema
// Generated: 2026-02-17
// Database: xblewwjjqvwerypvttfh.supabase.co (C3Yz3ye2)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          reputation_score: number
          is_verified: boolean
          is_moderator: boolean
          is_banned: boolean
          ban_reason: string | null
          banned_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          reputation_score?: number
          is_verified?: boolean
          is_moderator?: boolean
          is_banned?: boolean
          ban_reason?: string | null
          banned_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          avatar_url?: string | null
          bio?: string | null
          reputation_score?: number
          is_verified?: boolean
          is_moderator?: boolean
          is_banned?: boolean
          ban_reason?: string | null
          banned_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      url_metadata: {
        Row: {
          url_id: string
          total_views: number
          total_comments: number
          total_likes: number
          last_activity: string
          is_trending: boolean
          created_at: string
        }
        Insert: {
          url_id: string
          total_views?: number
          total_comments?: number
          total_likes?: number
          last_activity?: string
          is_trending?: boolean
          created_at?: string
        }
        Update: {
          url_id?: string
          total_views?: number
          total_comments?: number
          total_likes?: number
          last_activity?: string
          is_trending?: boolean
          created_at?: string
        }
      }
      url_comments: {
        Row: {
          id: string
          url_id: string
          user_id: string
          parent_comment_id: string | null
          comment_text: string
          is_edited: boolean
          is_deleted: boolean
          is_pinned: boolean
          replies_count: number
          likes_count: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          url_id: string
          user_id: string
          parent_comment_id?: string | null
          comment_text: string
          is_edited?: boolean
          is_deleted?: boolean
          is_pinned?: boolean
          replies_count?: number
          likes_count?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          url_id?: string
          user_id?: string
          parent_comment_id?: string | null
          comment_text?: string
          is_edited?: boolean
          is_deleted?: boolean
          is_pinned?: boolean
          replies_count?: number
          likes_count?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          created_at?: string
        }
      }
      url_likes: {
        Row: {
          id: string
          url_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          url_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          url_id?: string
          user_id?: string
          created_at?: string
        }
      }
      url_views: {
        Row: {
          id: string
          url_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          url_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          url_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          viewed_at?: string
        }
      }
      user_presence: {
        Row: {
          user_id: string
          status: 'online' | 'offline' | 'away'
          last_seen: string
          current_url: string | null
        }
        Insert: {
          user_id: string
          status?: 'online' | 'offline' | 'away'
          last_seen?: string
          current_url?: string | null
        }
        Update: {
          user_id?: string
          status?: 'online' | 'offline' | 'away'
          last_seen?: string
          current_url?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'comment_reply' | 'comment_like' | 'mention' | 'system'
          title: string
          content: string
          url: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'comment_reply' | 'comment_like' | 'mention' | 'system'
          title: string
          content: string
          url?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'comment_reply' | 'comment_like' | 'mention' | 'system'
          title?: string
          content?: string
          url?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          target_table: string
          target_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          target_table: string
          target_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          target_table?: string
          target_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      moderation_queue: {
        Row: {
          id: string
          reported_content_type: 'comment' | 'user' | 'url'
          reported_content_id: string
          reporter_id: string | null
          reason: string
          status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          priority: number
          moderator_id: string | null
          moderator_notes: string | null
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reported_content_type: 'comment' | 'user' | 'url'
          reported_content_id: string
          reporter_id?: string | null
          reason: string
          status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          priority?: number
          moderator_id?: string | null
          moderator_notes?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reported_content_type?: 'comment' | 'user' | 'url'
          reported_content_id?: string
          reporter_id?: string | null
          reason?: string
          status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          priority?: number
          moderator_id?: string | null
          moderator_notes?: string | null
          resolved_at?: string | null
          created_at?: string
        }
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
  }
}

// Type helpers for easier usage
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type NewUserProfile = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type UrlComment = Database['public']['Tables']['url_comments']['Row']
export type NewUrlComment = Database['public']['Tables']['url_comments']['Insert']
export type UrlCommentUpdate = Database['public']['Tables']['url_comments']['Update']

export type CommentLike = Database['public']['Tables']['comment_likes']['Row']
export type NewCommentLike = Database['public']['Tables']['comment_likes']['Insert']

export type UrlLike = Database['public']['Tables']['url_likes']['Row']
export type NewUrlLike = Database['public']['Tables']['url_likes']['Insert']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NewNotification = Database['public']['Tables']['notifications']['Insert']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type NewAuditLog = Database['public']['Tables']['audit_logs']['Insert']

export type ModerationReport = Database['public']['Tables']['moderation_queue']['Row']
export type NewModerationReport = Database['public']['Tables']['moderation_queue']['Insert']
export type ModerationReportUpdate = Database['public']['Tables']['moderation_queue']['Update']

// Extended types with relations
export type CommentWithProfile = UrlComment & {
  user_profiles: UserProfile
  replies?: CommentWithProfile[]
}

export type NotificationWithProfile = Notification & {
  user_profiles: UserProfile
}
