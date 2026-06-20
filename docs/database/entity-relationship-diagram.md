# EduAI — Entity Relationship Diagram (ERD)

**Document ID:** EDUAI-ERD-001  
**Version:** 1.0.0  
**Date:** June 2025

---

## 1. Overview

This document defines the core entity relationships for EduAI's PostgreSQL database. All tenant-scoped tables include `tenant_id`. All tables include audit columns (`created_at`, `updated_at`, `deleted_at`).

---

## 2. Core Platform ERD

```mermaid
erDiagram
    TENANTS ||--o{ SCHOOLS : contains
    TENANTS ||--o{ USERS : has
    TENANTS ||--|| TENANT_BRANDING : has
    TENANTS ||--o{ TENANT_FEATURE_FLAGS : has
    
    SCHOOLS ||--o{ CLASSES : contains
    SCHOOLS ||--o{ USER_ROLES : scopes
    
    USERS ||--o{ USER_ROLES : assigned
    USERS ||--o{ USER_SESSIONS : has
    USERS ||--o{ PARENT_STUDENT_LINKS : "parent side"
    USERS ||--o{ PARENT_STUDENT_LINKS : "student side"
    
    ROLES ||--o{ USER_ROLES : assigned_via
    ROLES ||--o{ ROLE_PERMISSIONS : has
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : granted
    
    TENANTS {
        uuid id PK
        string slug UK
        string name
        enum type
        enum subscription_tier
        string custom_domain
        jsonb settings
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    SCHOOLS {
        uuid id PK
        uuid tenant_id FK
        string name
        string code UK
        string board_id FK
        jsonb address
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    USERS {
        uuid id PK
        uuid tenant_id FK
        uuid school_id FK
        string email UK
        string password_hash
        string first_name
        string last_name
        string phone
        date date_of_birth
        enum gender
        string avatar_url
        string locale
        enum status
        timestamptz email_verified_at
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    CLASSES {
        uuid id PK
        uuid tenant_id FK
        uuid school_id FK
        string name
        int class_level
        string section
        uuid academic_year_id FK
        uuid class_teacher_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
```

---

## 3. Curriculum & Content ERD

```mermaid
erDiagram
    BOARDS ||--o{ CLASSES_CURRICULUM : defines
    SUBJECTS ||--o{ CHAPTERS : contains
    CHAPTERS ||--o{ TOPICS : contains
    TOPICS ||--o{ LESSONS : contains
    LESSONS ||--o{ LESSON_CONTENT : has
    LESSONS ||--o{ QUIZZES : has
    QUIZZES ||--o{ QUESTIONS : contains
    QUESTIONS ||--o{ QUESTION_OPTIONS : has
    
    BOARDS {
        uuid id PK
        string code UK
        string name
        string country
    }
    
    SUBJECTS {
        uuid id PK
        uuid board_id FK
        int class_level
        string code
        string name
        string icon_url
        int sort_order
    }
    
    CHAPTERS {
        uuid id PK
        uuid subject_id FK
        string name
        int chapter_number
        string description
        int sort_order
    }
    
    TOPICS {
        uuid id PK
        uuid chapter_id FK
        string name
        int sort_order
    }
    
    LESSONS {
        uuid id PK
        uuid topic_id FK
        uuid tenant_id FK
        string title
        enum type
        int duration_minutes
        enum status
        int version
        jsonb metadata
    }
    
    LESSON_CONTENT {
        uuid id PK
        uuid lesson_id FK
        enum content_type
        text body
        string media_url
        string mux_asset_id
        int sort_order
    }
    
    QUESTIONS {
        uuid id PK
        uuid quiz_id FK
        enum type
        text stem
        text explanation
        int marks
        int sort_order
        jsonb metadata
    }
```

---

## 4. Learning Progress ERD

```mermaid
erDiagram
    USERS ||--o{ LEARNING_PATHS : has
    USERS ||--o{ LESSON_PROGRESS : tracks
    USERS ||--o{ QUIZ_ATTEMPTS : takes
    USERS ||--o{ TOPIC_SCORES : has
    
    LEARNING_PATHS ||--o{ PATH_ITEMS : contains
    LESSONS ||--o{ LESSON_PROGRESS : tracked_by
    QUIZZES ||--o{ QUIZ_ATTEMPTS : attempted
    
    LESSON_PROGRESS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid lesson_id FK
        enum status
        decimal score
        int time_spent_seconds
        timestamptz started_at
        timestamptz completed_at
        timestamptz created_at
        timestamptz updated_at
    }
    
    QUIZ_ATTEMPTS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid quiz_id FK
        jsonb answers
        decimal score
        int time_spent_seconds
        timestamptz started_at
        timestamptz submitted_at
    }
    
    TOPIC_SCORES {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid topic_id FK
        decimal score
        int attempts
        timestamptz last_attempt_at
    }
    
    LEARNING_PATHS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid board_id FK
        int class_level
        uuid current_chapter_id FK
        decimal completion_pct
        jsonb weak_topics
        timestamptz last_activity_at
    }
```

---

## 5. AI Ecosystem ERD

```mermaid
erDiagram
    USERS ||--o{ AI_CONVERSATIONS : has
    AI_CONVERSATIONS ||--o{ AI_MESSAGES : contains
    USERS ||--o{ AI_QUOTA_USAGE : tracked
    USERS ||--o{ GENERATED_PAPERS : creates
    GENERATED_PAPERS ||--o{ PAPER_QUESTIONS : contains
    
    AI_CONVERSATIONS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        enum type
        uuid context_lesson_id FK
        uuid context_subject_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz expires_at
    }
    
    AI_MESSAGES {
        uuid id PK
        uuid conversation_id FK
        enum role
        text content
        int tokens_used
        string model
        jsonb metadata
        timestamptz created_at
    }
    
    AI_QUOTA_USAGE {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        date usage_date
        int query_count
        int tokens_used
        timestamptz updated_at
    }
    
    GENERATED_PAPERS {
        uuid id PK
        uuid tenant_id FK
        uuid created_by FK
        string title
        uuid board_id FK
        int class_level
        uuid subject_id FK
        jsonb config
        enum status
        timestamptz created_at
    }
    
    CONTENT_EMBEDDINGS {
        uuid id PK
        uuid tenant_id FK
        uuid content_id FK
        enum content_type
        vector embedding
        text chunk_text
        jsonb metadata
    }
```

---

## 6. Assessment & Mock Tests ERD

```mermaid
erDiagram
    MOCK_TESTS ||--o{ MOCK_TEST_SECTIONS : has
    MOCK_TEST_SECTIONS ||--o{ MOCK_TEST_QUESTIONS : contains
    USERS ||--o{ MOCK_TEST_ATTEMPTS : takes
    MOCK_TEST_ATTEMPTS ||--o{ MOCK_TEST_ANSWERS : contains
    
    MOCK_TESTS {
        uuid id PK
        uuid tenant_id FK
        string title
        uuid board_id FK
        int class_level
        uuid subject_id FK
        int duration_minutes
        int total_marks
        enum generated_by
        enum status
        timestamptz created_at
    }
    
    MOCK_TEST_ATTEMPTS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid mock_test_id FK
        decimal score
        int time_spent_seconds
        enum status
        timestamptz started_at
        timestamptz submitted_at
    }
    
    HOMEWORK_ASSIGNMENTS ||--o{ HOMEWORK_SUBMISSIONS : receives
    USERS ||--o{ HOMEWORK_ASSIGNMENTS : creates
    USERS ||--o{ HOMEWORK_SUBMISSIONS : submits
    
    HOMEWORK_ASSIGNMENTS {
        uuid id PK
        uuid tenant_id FK
        uuid teacher_id FK
        uuid class_id FK
        string title
        text description
        timestamptz due_at
        enum status
    }
    
    HOMEWORK_SUBMISSIONS {
        uuid id PK
        uuid tenant_id FK
        uuid assignment_id FK
        uuid student_id FK
        text content
        string attachment_url
        decimal grade
        text feedback
        enum status
        timestamptz submitted_at
        timestamptz graded_at
    }
```

---

## 7. Gamification ERD

```mermaid
erDiagram
    USERS ||--|| USER_XP : has
    USERS ||--o{ USER_BADGES : earns
    USERS ||--|| USER_STREAKS : has
    BADGES ||--o{ USER_BADGES : awarded
    
    USER_XP {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK UK
        int total_xp
        int current_level
        timestamptz updated_at
    }
    
    BADGES {
        uuid id PK
        uuid tenant_id FK
        string code UK
        string name
        string description
        string icon_url
        jsonb criteria
        int xp_reward
        enum category
    }
    
    USER_BADGES {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid badge_id FK
        timestamptz earned_at
    }
    
    USER_STREAKS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK UK
        int current_streak
        int longest_streak
        date last_activity_date
        int freeze_tokens
        timestamptz updated_at
    }
```

---

## 8. ERP ERD

```mermaid
erDiagram
    SCHOOLS ||--o{ ACADEMIC_YEARS : has
    SCHOOLS ||--o{ FEE_STRUCTURES : defines
    CLASSES ||--o{ ATTENDANCE_RECORDS : tracks
    USERS ||--o{ ATTENDANCE_RECORDS : marked_for
    FEE_STRUCTURES ||--o{ FEE_PAYMENTS : generates
    
    ATTENDANCE_RECORDS {
        uuid id PK
        uuid tenant_id FK
        uuid school_id FK
        uuid class_id FK
        uuid student_id FK
        date attendance_date
        enum status
        uuid marked_by FK
        timestamptz marked_at
        enum record_status
    }
    
    FEE_STRUCTURES {
        uuid id PK
        uuid tenant_id FK
        uuid school_id FK
        uuid academic_year_id FK
        string name
        jsonb components
        decimal total_amount
        enum frequency
    }
    
    FEE_PAYMENTS {
        uuid id PK
        uuid tenant_id FK
        uuid student_id FK
        uuid fee_structure_id FK
        decimal amount
        string razorpay_order_id
        string razorpay_payment_id
        enum status
        timestamptz paid_at
    }
    
    TIMETABLES {
        uuid id PK
        uuid tenant_id FK
        uuid school_id FK
        uuid class_id FK
        int day_of_week
        time start_time
        time end_time
        uuid subject_id FK
        uuid teacher_id FK
    }
```

---

## 9. Billing & Subscription ERD

```mermaid
erDiagram
    USERS ||--o{ SUBSCRIPTIONS : has
    SUBSCRIPTION_PLANS ||--o{ SUBSCRIPTIONS : defines
    SUBSCRIPTIONS ||--o{ PAYMENT_TRANSACTIONS : generates
    
    SUBSCRIPTION_PLANS {
        uuid id PK
        string code UK
        string name
        enum tier
        enum billing_cycle
        decimal price_inr
        jsonb features
        int ai_daily_quota
        boolean is_active
    }
    
    SUBSCRIPTIONS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid plan_id FK
        enum status
        string razorpay_subscription_id
        timestamptz trial_ends_at
        timestamptz current_period_start
        timestamptz current_period_end
        timestamptz cancelled_at
    }
    
    PAYMENT_TRANSACTIONS {
        uuid id PK
        uuid tenant_id FK
        uuid subscription_id FK
        uuid user_id FK
        decimal amount
        string currency
        string razorpay_payment_id
        enum status
        jsonb metadata
        timestamptz created_at
    }
```

---

## 10. Audit & Notifications ERD

```mermaid
erDiagram
    USERS ||--o{ AUDIT_LOGS : generates
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ USER_CONSENTS : grants
    
    AUDIT_LOGS {
        uuid id PK
        uuid tenant_id FK
        uuid actor_id FK
        string action
        string resource_type
        uuid resource_id
        jsonb metadata
        inet ip_address
        timestamptz created_at
    }
    
    NOTIFICATIONS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        enum channel
        string title
        text body
        jsonb data
        boolean is_read
        timestamptz sent_at
        timestamptz read_at
    }
    
    USER_CONSENTS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid granted_by FK
        enum consent_type
        boolean granted
        timestamptz granted_at
        timestamptz revoked_at
    }
```

---

## 11. Key Relationships Summary

| Relationship | Cardinality | Notes |
|--------------|-------------|-------|
| Tenant → Schools | 1:N | School belongs to one tenant |
| Tenant → Users | 1:N | User belongs to one tenant |
| School → Classes | 1:N | Class belongs to one school |
| User → Roles | M:N | Via user_roles with scope |
| Parent → Student | M:N | Via parent_student_links |
| Subject → Chapters → Topics → Lessons | 1:N chain | Curriculum hierarchy |
| User → Lesson Progress | 1:N | One progress record per lesson per user |
| User → AI Conversations | 1:N | Multiple conversation threads |
| Class → Homework Assignments | 1:N | Teacher assigns to class |
| User → Subscriptions | 1:N | History of subscriptions |

---

## 12. Indexing Strategy

| Table | Index | Purpose |
|-------|-------|---------|
| All tenant tables | `(tenant_id)` | Tenant isolation queries |
| users | `(tenant_id, email)` UNIQUE | Login lookup |
| users | `(tenant_id, school_id)` | School user lists |
| lesson_progress | `(tenant_id, user_id, lesson_id)` UNIQUE | Progress lookup |
| attendance_records | `(tenant_id, class_id, attendance_date)` | Daily attendance |
| ai_quota_usage | `(tenant_id, user_id, usage_date)` UNIQUE | Quota check |
| audit_logs | `(tenant_id, created_at DESC)` | Audit queries |
| content_embeddings | `(embedding vector_cosine_ops)` | RAG similarity search |

---

*Related: [Database Schema](./database-schema.md) · [Multi-Tenant Architecture](../architecture/multi-tenant-architecture.md)*
