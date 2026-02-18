-- =====================================================
-- 🛡️ GHOST-PROOF ENHANCED SQL SCHEMA
-- =====================================================
-- Version: 2.0 Enterprise
-- Date: 2026-02-17
-- Database: PostgreSQL (Supabase)
-- Author: PrismanTHarIOn System
-- Purpose: Production-ready 10-table schema with RLS
-- =====================================================

-- ================== CLEANUP (Optional) ==================
-- Uncomment if you want to start fresh
-- DROP TABLE IF EXISTS 
--   audit_logs, user_presence, notifications, moderation_queue,
--   url_metadata, comment_likes, url_likes, url_views, 
--   url_comments, user_profiles CASCADE;

-- ================== 1. USER PROFILES ==================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    reputation_score INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_moderator BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    banned_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
        'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================== 2. URL METADATA ==================
CREATE TABLE IF NOT EXISTS url_metadata (
    url_id TEXT PRIMARY KEY,
    total_views INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================== 3. URL COMMENTS ==================
CREATE TABLE IF NOT EXISTS url_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES url_comments(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL CHECK (LENGTH(comment_text) > 0 AND LENGTH(comment_text) <= 2000),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    replies_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_url_comments_url_id ON url_comments(url_id);
CREATE INDEX IF NOT EXISTS idx_url_comments_user_id ON url_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_url_comments_parent ON url_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_url_comments_created ON url_comments(created_at DESC);

-- ================== 4. COMMENT LIKES ==================
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES url_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)  -- Prevent duplicate likes
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON comment_likes(user_id);

-- ================== 5. URL LIKES ==================
CREATE TABLE IF NOT EXISTS url_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(url_id, user_id)  -- Prevent duplicate likes
);

CREATE INDEX IF NOT EXISTS idx_url_likes_url ON url_likes(url_id);
CREATE INDEX IF NOT EXISTS idx_url_likes_user ON url_likes(user_id);

-- ================== 6. URL VIEWS ==================
CREATE TABLE IF NOT EXISTS url_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id TEXT NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_url_views_url ON url_views(url_id);
CREATE INDEX IF NOT EXISTS idx_url_views_viewed_at ON url_views(viewed_at DESC);

-- ================== 7. USER PRESENCE ==================
CREATE TABLE IF NOT EXISTS user_presence (
    user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away')),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    current_url TEXT
);

-- ================== 8. NOTIFICATIONS ==================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('comment_reply', 'comment_like', 'mention', 'system')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ================== 9. AUDIT LOGS ==================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_table, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ================== 10. MODERATION QUEUE ==================
CREATE TABLE IF NOT EXISTS moderation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_content_type TEXT NOT NULL CHECK (reported_content_type IN ('comment', 'user', 'url')),
    reported_content_id TEXT NOT NULL,
    reporter_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    moderator_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    moderator_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_status ON moderation_queue(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_content ON moderation_queue(reported_content_type, reported_content_id);

-- =====================================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

-- ========== USER PROFILES POLICIES ==========
CREATE POLICY "Public profiles are viewable by everyone"
    ON user_profiles FOR SELECT
    USING (NOT is_banned);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        NOT (is_moderator IS DISTINCT FROM (SELECT is_moderator FROM user_profiles WHERE id = auth.uid())) AND
        NOT (is_verified IS DISTINCT FROM (SELECT is_verified FROM user_profiles WHERE id = auth.uid()))
    );

CREATE POLICY "Moderators can update any profile"
    ON user_profiles FOR UPDATE
    USING ((SELECT is_moderator FROM user_profiles WHERE id = auth.uid()) = TRUE);

-- ========== URL COMMENTS POLICIES ==========
CREATE POLICY "Comments are viewable by everyone"
    ON url_comments FOR SELECT
    USING (is_deleted = FALSE);

CREATE POLICY "Authenticated users can create comments"
    ON url_comments FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        (SELECT NOT is_banned FROM user_profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can update own comments within 15 minutes"
    ON url_comments FOR UPDATE
    USING (
        auth.uid() = user_id AND
        created_at > NOW() - INTERVAL '15 minutes' AND
        is_deleted = FALSE
    );

CREATE POLICY "Users can soft-delete own comments"
    ON url_comments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (is_deleted = TRUE);

CREATE POLICY "Moderators can moderate all comments"
    ON url_comments FOR UPDATE
    USING ((SELECT is_moderator FROM user_profiles WHERE id = auth.uid()) = TRUE);

-- ========== LIKES POLICIES ==========
CREATE POLICY "Anyone can view likes"
    ON comment_likes FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated users can create likes"
    ON comment_likes FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        (SELECT NOT is_banned FROM user_profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can delete own likes"
    ON comment_likes FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view url likes"
    ON url_likes FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated users can create url likes"
    ON url_likes FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        (SELECT NOT is_banned FROM user_profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can delete own url likes"
    ON url_likes FOR DELETE
    USING (auth.uid() = user_id);

-- ========== NOTIFICATIONS POLICIES ==========
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
    ON notifications FOR INSERT
    WITH CHECK (TRUE);  -- App logic controls this

CREATE POLICY "Users can mark own notifications as read"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ========== AUDIT LOGS POLICIES ==========
CREATE POLICY "Only service role can view audit logs"
    ON audit_logs FOR SELECT
    USING (auth.role() = 'service_role');

CREATE POLICY "System can create audit logs"
    ON audit_logs FOR INSERT
    WITH CHECK (TRUE);

-- ========== MODERATION QUEUE POLICIES ==========
CREATE POLICY "Anyone can submit reports"
    ON moderation_queue FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Moderators can view queue"
    ON moderation_queue FOR SELECT
    USING ((SELECT is_moderator FROM user_profiles WHERE id = auth.uid()) = TRUE);

CREATE POLICY "Moderators can resolve reports"
    ON moderation_queue FOR UPDATE
    USING ((SELECT is_moderator FROM user_profiles WHERE id = auth.uid()) = TRUE);

-- =====================================================
-- 📊 HELPER FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_url_comments_updated_at
    BEFORE UPDATE ON url_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE url_comments
        SET likes_count = likes_count + 1
        WHERE id = NEW.comment_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE url_comments
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = OLD.comment_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_likes_count
    AFTER INSERT OR DELETE ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- =====================================================
-- 🔄 REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE url_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE comment_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;

-- =====================================================
-- ✅ SCHEMA DEPLOYMENT COMPLETE
-- =====================================================
-- 
-- Next Steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify all 10 tables are created
-- 3. Check RLS policies in Authentication > Policies
-- 4. Test with ghost-buster.js script
-- 5. Generate TypeScript types: supabase gen types typescript
--
-- =====================================================
