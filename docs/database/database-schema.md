# EduAI — Database Schema (SQL DDL Outline)

**Document ID:** EDUAI-DB-001  
**Version:** 1.0.0  
**Date:** June 2025  
**Database:** PostgreSQL 16

---

## 1. Conventions

| Convention | Rule |
|------------|------|
| Primary keys | UUID v4 via `gen_random_uuid()` |
| Naming | `snake_case` for tables and columns |
| Timestamps | `TIMESTAMPTZ` stored in UTC |
| Soft delete | `deleted_at TIMESTAMPTZ` (NULL = active) |
| Audit columns | `created_at`, `updated_at` on all tables |
| Multi-tenant | `tenant_id UUID NOT NULL` on all tenant-scoped tables |
| Foreign keys | Named `{table}_{column}_fkey` |
| Indexes | Named `idx_{table}_{columns}` |

---

## 2. Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";       -- pgvector for RAG embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- fuzzy text search
```

---

## 3. Enum Types

```sql
CREATE TYPE tenant_type AS ENUM ('platform', 'school_group', 'white_label');
CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'professional', 'enterprise');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE user_gender AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE lesson_type AS ENUM ('video', 'text', 'interactive', 'mixed');
CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');
CREATE TYPE lesson_progress_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE question_type AS ENUM ('mcq', 'true_false', 'fill_blank', 'short_answer', 'long_answer');
CREATE TYPE ai_conversation_type AS ENUM ('tutor', 'homework', 'general');
CREATE TYPE ai_message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE attendance_record_status AS ENUM ('draft', 'submitted', 'approved', 'locked');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'cancelled', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE homework_status AS ENUM ('assigned', 'submitted', 'graded', 'late');
CREATE TYPE notification_channel AS ENUM ('email', 'push', 'in_app', 'sms');
CREATE TYPE consent_type AS ENUM ('data_processing', 'ai_interaction', 'marketing', 'third_party');
CREATE TYPE paper_status AS ENUM ('generating', 'draft', 'published', 'archived');
CREATE TYPE mock_test_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'submitted', 'graded', 'expired');
```

---

## 4. Core Platform Tables

```sql
-- ============================================================
-- TENANTS
-- ============================================================
CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(100) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    type            tenant_type NOT NULL DEFAULT 'school_group',
    subscription_tier subscription_tier NOT NULL DEFAULT 'starter',
    custom_domain   VARCHAR(255),
    settings        JSONB NOT NULL DEFAULT '{}',
    ai_monthly_token_budget INTEGER DEFAULT 1000000,
    max_students    INTEGER DEFAULT 500,
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT uq_tenants_slug UNIQUE (slug)
);

CREATE INDEX idx_tenants_custom_domain ON tenants (custom_domain) WHERE custom_domain IS NOT NULL;

CREATE TABLE tenant_branding (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    logo_url        VARCHAR(500),
    favicon_url     VARCHAR(500),
    primary_color   VARCHAR(20) DEFAULT '262 83% 58%',
    secondary_color VARCHAR(20) DEFAULT '220 14% 96%',
    app_name        VARCHAR(100) DEFAULT 'EduAI',
    support_email   VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_branding_tenant UNIQUE (tenant_id)
);

CREATE TABLE tenant_feature_flags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    flag_key        VARCHAR(100) NOT NULL,
    enabled         BOOLEAN NOT NULL DEFAULT false,
    config          JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_flags UNIQUE (tenant_id, flag_key)
);

-- ============================================================
-- SCHOOLS
-- ============================================================
CREATE TABLE schools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50) NOT NULL,
    board_id        UUID NOT NULL,
    address         JSONB DEFAULT '{}',
    phone           VARCHAR(20),
    email           VARCHAR(255),
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT uq_schools_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX idx_schools_tenant ON schools (tenant_id) WHERE deleted_at IS NULL;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id),
    school_id           UUID REFERENCES schools(id),
    email               VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(255),
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100),
    phone               VARCHAR(20),
    date_of_birth       DATE,
    gender              user_gender,
    avatar_url          VARCHAR(500),
    locale              VARCHAR(10) NOT NULL DEFAULT 'en-IN',
    class_level         SMALLINT,
    status              user_status NOT NULL DEFAULT 'pending_verification',
    email_verified_at   TIMESTAMPTZ,
    last_login_at       TIMESTAMPTZ,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_users_tenant_email UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant_school ON users (tenant_id, school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_tenant_status ON users (tenant_id, status) WHERE deleted_at IS NULL;

-- ============================================================
-- RBAC
-- ============================================================
CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id),
    code            VARCHAR(50) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    is_system       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT uq_roles_code_tenant UNIQUE (code, tenant_id)
);

CREATE TABLE permissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(100) NOT NULL UNIQUE,
    resource        VARCHAR(50) NOT NULL,
    action          VARCHAR(50) NOT NULL,
    scope           VARCHAR(20) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role_id         UUID NOT NULL REFERENCES roles(id),
    permission_id   UUID NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    role_id         UUID NOT NULL REFERENCES roles(id),
    school_id       UUID REFERENCES schools(id),
    class_id        UUID,
    granted_by      UUID REFERENCES users(id),
    granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    CONSTRAINT uq_user_roles UNIQUE (user_id, role_id, school_id, class_id)
);

CREATE INDEX idx_user_roles_user ON user_roles (user_id);

-- ============================================================
-- PARENT-STUDENT LINKS
-- ============================================================
CREATE TABLE parent_student_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    parent_id       UUID NOT NULL REFERENCES users(id),
    student_id      UUID NOT NULL REFERENCES users(id),
    relationship    VARCHAR(50) DEFAULT 'parent',
    verified        BOOLEAN NOT NULL DEFAULT false,
    verified_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT uq_parent_student UNIQUE (tenant_id, parent_id, student_id)
);

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TABLE user_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info     JSONB DEFAULT '{}',
    ip_address      INET,
    last_active_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON user_sessions (user_id, expires_at);
```

---

## 5. Curriculum & Content Tables

```sql
CREATE TABLE boards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(20) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    country         VARCHAR(2) NOT NULL DEFAULT 'IN',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id        UUID NOT NULL REFERENCES boards(id),
    class_level     SMALLINT NOT NULL,
    code            VARCHAR(50) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    icon_url        VARCHAR(500),
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_subjects UNIQUE (board_id, class_level, code)
);

CREATE TABLE chapters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES subjects(id),
    name            VARCHAR(255) NOT NULL,
    chapter_number  SMALLINT NOT NULL,
    description     TEXT,
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE topics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id      UUID NOT NULL REFERENCES chapters(id),
    name            VARCHAR(255) NOT NULL,
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE lessons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id),
    topic_id        UUID NOT NULL REFERENCES topics(id),
    title           VARCHAR(255) NOT NULL,
    type            lesson_type NOT NULL DEFAULT 'mixed',
    duration_minutes SMALLINT,
    status          content_status NOT NULL DEFAULT 'draft',
    version         INTEGER NOT NULL DEFAULT 1,
    metadata        JSONB DEFAULT '{}',
    created_by      UUID REFERENCES users(id),
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_lessons_topic ON lessons (topic_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_lessons_tenant ON lessons (tenant_id, status) WHERE deleted_at IS NULL;

CREATE TABLE lesson_contents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id       UUID NOT NULL REFERENCES lessons(id),
    content_type    VARCHAR(30) NOT NULL,
    body            TEXT,
    media_url       VARCHAR(500),
    mux_asset_id    VARCHAR(100),
    mux_playback_id VARCHAR(100),
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quizzes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id),
    lesson_id       UUID REFERENCES lessons(id),
    title           VARCHAR(255) NOT NULL,
    time_limit_minutes SMALLINT,
    passing_score   DECIMAL(5,2) DEFAULT 70.00,
    status          content_status NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id         UUID NOT NULL REFERENCES quizzes(id),
    type            question_type NOT NULL,
    stem            TEXT NOT NULL,
    explanation     TEXT,
    marks           DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE question_options (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id     UUID NOT NULL REFERENCES questions(id),
    label           VARCHAR(500) NOT NULL,
    is_correct      BOOLEAN NOT NULL DEFAULT false,
    sort_order      SMALLINT NOT NULL DEFAULT 0
);
```

---

## 6. Learning Progress Tables

```sql
CREATE TABLE classes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    school_id       UUID NOT NULL REFERENCES schools(id),
    name            VARCHAR(100) NOT NULL,
    class_level     SMALLINT NOT NULL,
    section         VARCHAR(10),
    academic_year   VARCHAR(10) NOT NULL,
    class_teacher_id UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT uq_classes UNIQUE (tenant_id, school_id, class_level, section, academic_year)
);

CREATE TABLE class_enrollments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    class_id        UUID NOT NULL REFERENCES classes(id),
    student_id      UUID NOT NULL REFERENCES users(id),
    enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    CONSTRAINT uq_enrollment UNIQUE (tenant_id, class_id, student_id)
);

CREATE TABLE learning_paths (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id),
    user_id             UUID NOT NULL REFERENCES users(id),
    board_id            UUID NOT NULL REFERENCES boards(id),
    class_level         SMALLINT NOT NULL,
    current_chapter_id  UUID REFERENCES chapters(id),
    completion_pct      DECIMAL(5,2) DEFAULT 0.00,
    weak_topics         JSONB DEFAULT '[]',
    last_activity_at    TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_learning_paths UNIQUE (tenant_id, user_id, board_id, class_level)
);

CREATE TABLE lesson_progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id),
    user_id             UUID NOT NULL REFERENCES users(id),
    lesson_id           UUID NOT NULL REFERENCES lessons(id),
    status              lesson_progress_status NOT NULL DEFAULT 'not_started',
    score               DECIMAL(5,2),
    time_spent_seconds  INTEGER DEFAULT 0,
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_lesson_progress UNIQUE (tenant_id, user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress (tenant_id, user_id, status);

CREATE TABLE quiz_attempts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id),
    user_id             UUID NOT NULL REFERENCES users(id),
    quiz_id             UUID NOT NULL REFERENCES quizzes(id),
    answers             JSONB NOT NULL DEFAULT '{}',
    score               DECIMAL(5,2),
    time_spent_seconds  INTEGER,
    status              attempt_status NOT NULL DEFAULT 'in_progress',
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at        TIMESTAMPTZ
);

CREATE TABLE topic_scores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    topic_id        UUID NOT NULL REFERENCES topics(id),
    score           DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    attempts        INTEGER NOT NULL DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_topic_scores UNIQUE (tenant_id, user_id, topic_id)
);
```

---

## 7. AI Tables

```sql
CREATE TABLE ai_conversations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id),
    user_id             UUID NOT NULL REFERENCES users(id),
    type                ai_conversation_type NOT NULL DEFAULT 'tutor',
    context_lesson_id   UUID REFERENCES lessons(id),
    context_subject_id  UUID REFERENCES subjects(id),
    title               VARCHAR(255),
    expires_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days'),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations (tenant_id, user_id, updated_at DESC);

CREATE TABLE ai_messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID NOT NULL REFERENCES ai_conversations(id),
    role                ai_message_role NOT NULL,
    content             TEXT NOT NULL,
    tokens_used         INTEGER DEFAULT 0,
    model               VARCHAR(50),
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_quota_usage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    usage_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    query_count     INTEGER NOT NULL DEFAULT 0,
    tokens_used     INTEGER NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_ai_quota UNIQUE (tenant_id, user_id, usage_date)
);

CREATE TABLE content_embeddings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id),
    content_id      UUID NOT NULL,
    content_type    VARCHAR(30) NOT NULL,
    chunk_text      TEXT NOT NULL,
    embedding       vector(1536) NOT NULL,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_embeddings_vector ON content_embeddings 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE generated_papers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    created_by      UUID NOT NULL REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    board_id        UUID NOT NULL REFERENCES boards(id),
    class_level     SMALLINT NOT NULL,
    subject_id      UUID NOT NULL REFERENCES subjects(id),
    config          JSONB NOT NULL,
    status          paper_status NOT NULL DEFAULT 'generating',
    total_marks     DECIMAL(6,2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 8. Gamification Tables

```sql
CREATE TABLE user_xp (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    total_xp        INTEGER NOT NULL DEFAULT 0,
    current_level   INTEGER NOT NULL DEFAULT 1,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_xp UNIQUE (tenant_id, user_id)
);

CREATE TABLE badges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id),
    code            VARCHAR(50) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon_url        VARCHAR(500),
    criteria        JSONB NOT NULL,
    xp_reward       INTEGER DEFAULT 0,
    category        VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_badges_code UNIQUE (tenant_id, code)
);

CREATE TABLE user_badges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    badge_id        UUID NOT NULL REFERENCES badges(id),
    earned_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_badges UNIQUE (tenant_id, user_id, badge_id)
);

CREATE TABLE user_streaks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id),
    user_id             UUID NOT NULL REFERENCES users(id),
    current_streak      INTEGER NOT NULL DEFAULT 0,
    longest_streak      INTEGER NOT NULL DEFAULT 0,
    last_activity_date  DATE,
    freeze_tokens       INTEGER NOT NULL DEFAULT 1,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_streaks UNIQUE (tenant_id, user_id)
);
```

---

## 9. ERP, Billing, Audit Tables

```sql
CREATE TABLE attendance_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    school_id       UUID NOT NULL REFERENCES schools(id),
    class_id        UUID NOT NULL REFERENCES classes(id),
    student_id      UUID NOT NULL REFERENCES users(id),
    attendance_date DATE NOT NULL,
    status          attendance_status NOT NULL,
    marked_by       UUID NOT NULL REFERENCES users(id),
    marked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    record_status   attendance_record_status NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_attendance UNIQUE (tenant_id, class_id, student_id, attendance_date)
);

CREATE TABLE subscription_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    tier            subscription_tier NOT NULL,
    billing_cycle   VARCHAR(20) NOT NULL DEFAULT 'monthly',
    price_inr       DECIMAL(10,2) NOT NULL,
    features        JSONB NOT NULL DEFAULT '{}',
    ai_daily_quota  INTEGER NOT NULL DEFAULT 5,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id                   UUID NOT NULL REFERENCES tenants(id),
    user_id                     UUID NOT NULL REFERENCES users(id),
    plan_id                     UUID NOT NULL REFERENCES subscription_plans(id),
    status                      subscription_status NOT NULL DEFAULT 'trial',
    razorpay_subscription_id    VARCHAR(100),
    trial_ends_at               TIMESTAMPTZ,
    current_period_start        TIMESTAMPTZ,
    current_period_end          TIMESTAMPTZ,
    cancelled_at                TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    actor_id        UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    resource_type   VARCHAR(50),
    resource_id     UUID,
    metadata        JSONB DEFAULT '{}',
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant_date ON audit_logs (tenant_id, created_at DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_id, created_at DESC);

CREATE TABLE user_consents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    granted_by      UUID REFERENCES users(id),
    consent_type    consent_type NOT NULL,
    granted         BOOLEAN NOT NULL,
    granted_at      TIMESTAMPTZ,
    revoked_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_consents UNIQUE (tenant_id, user_id, consent_type)
);
```

---

## 10. Row-Level Security

```sql
-- Apply to all tenant-scoped tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tenant-scoped tables

CREATE POLICY tenant_isolation ON users
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY tenant_isolation ON schools
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
```

---

## 11. Triggers

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Apply to all tables with updated_at column
```

---

## 12. Migration Strategy

| Phase | Sprint | Tables |
|-------|--------|--------|
| 1 | Sprint 1 | tenants, schools, users, roles, permissions, sessions |
| 2 | Sprint 2 | boards, subjects, chapters, topics, lessons |
| 3 | Sprint 4 | lesson_progress, learning_paths, classes, enrollments |
| 4 | Sprint 5 | quizzes, questions, quiz_attempts |
| 5 | Sprint 8 | ai_conversations, ai_messages, content_embeddings |
| 6 | Sprint 9 | mock_tests, generated_papers, homework |
| 7 | Sprint 11 | user_xp, badges, user_streaks |
| 8 | Sprint 12 | attendance, timetables |
| 9 | Sprint 13 | subscriptions, payments, consents |
| 10 | Sprint 14 | audit_logs, notifications |

Tool: **Prisma Migrate** with migration files in `packages/database/prisma/migrations/`.

---

*Related: [ERD](./entity-relationship-diagram.md) · [Multi-Tenant Architecture](../architecture/multi-tenant-architecture.md)*
