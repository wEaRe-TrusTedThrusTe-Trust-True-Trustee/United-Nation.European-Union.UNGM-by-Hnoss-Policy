// src/lib/supabase.ts
// 🛡️ Ghost-Proof Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { PROJECT_CONFIG } from '@/config/project-constants';

// Environment validation with fallback to mock values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-development-only';

// Development mode detection
const isDevelopment = process.env.NODE_ENV === 'development';
const hasMockCredentials = supabaseUrl.includes('mock') || supabaseAnonKey.includes('mock');

if (hasMockCredentials && isDevelopment) {
  console.warn('⚠️ DEVELOPMENT MODE: Using mock Supabase credentials');
  console.warn('💡 To use real data: Add credentials to .env.local');
}

// Validate URL matches Single Source of Truth (skip for mock)
if (!hasMockCredentials && supabaseUrl !== PROJECT_CONFIG.supabase.url) {
  console.warn('⚠️ WARNING: SUPABASE_URL does not match project-constants.ts!');
  console.warn(`Expected: ${PROJECT_CONFIG.supabase.url}`);
  console.warn(`Got: ${supabaseUrl}`);
}

/**
 * Typed Supabase Client
 * All database operations use the Database type for compile-time safety
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

/**
 * Helper: Get current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Auth error:', error.message);
    return null;
  }
  return user;
}

/**
 * Helper: Get user profile with extended data
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Profile fetch error:', error.message);
    return null;
  }

  return data;
}

/**
 * Helper: Check if user is banned
 */
export async function isUserBanned(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('is_banned, banned_until')
    .eq('id', userId)
    .single();

  if (error || !data) return false;
  
  // Transform: Explicit type check for TypeScript
  const userProfile = data as Database['public']['Tables']['user_profiles']['Row'];
  
  if (userProfile.is_banned) {
    if (userProfile.banned_until) {
      const bannedUntil = new Date(userProfile.banned_until);
      return bannedUntil > new Date();
    }
    return true;
  }

  return false;
}

// Export type for convenience
export type SupabaseClient = typeof supabase;
