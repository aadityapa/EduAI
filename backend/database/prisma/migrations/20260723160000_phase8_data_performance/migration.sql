-- Phase 8: Data & performance — additive composite indexes on hot paths
-- Forward-only; no destructive drops. Preserves seed/demo data.

-- Courses (soft-delete aware catalog filters)
CREATE INDEX IF NOT EXISTS "idx_courses_tenant_status_deleted"
  ON "courses" ("tenant_id", "status", "deleted_at");
CREATE INDEX IF NOT EXISTS "idx_courses_tenant_board_class_deleted"
  ON "courses" ("tenant_id", "board_id", "class_level", "deleted_at");

-- Lessons (published + not deleted per chapter)
CREATE INDEX IF NOT EXISTS "idx_lessons_chapter_status_deleted"
  ON "lessons" ("chapter_id", "status", "deleted_at");

-- Lesson contents / resources (ordered by sort)
CREATE INDEX IF NOT EXISTS "idx_lesson_contents_lesson"
  ON "lesson_contents" ("lesson_id", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_content_resources_lesson"
  ON "content_resources" ("lesson_id", "sort_order");

-- Enrollments by status
CREATE INDEX IF NOT EXISTS "idx_enrollments_user_status"
  ON "course_enrollments" ("tenant_id", "user_id", "status");

-- Quizzes
CREATE INDEX IF NOT EXISTS "idx_quizzes_deleted_status"
  ON "quizzes" ("deleted_at", "status");
CREATE INDEX IF NOT EXISTS "idx_quizzes_lesson_status"
  ON "quizzes" ("lesson_id", "deleted_at", "status");
CREATE INDEX IF NOT EXISTS "idx_quizzes_tenant_status"
  ON "quizzes" ("tenant_id", "status");

-- Questions / options
CREATE INDEX IF NOT EXISTS "idx_questions_quiz_sort"
  ON "questions" ("quiz_id", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_question_options_question"
  ON "question_options" ("question_id", "sort_order");

-- Quiz attempts
CREATE INDEX IF NOT EXISTS "idx_quiz_attempts_user_status"
  ON "quiz_attempts" ("tenant_id", "user_id", "status");
CREATE INDEX IF NOT EXISTS "idx_quiz_attempts_quiz_user"
  ON "quiz_attempts" ("quiz_id", "user_id");

-- Parent links
CREATE INDEX IF NOT EXISTS "idx_parent_links_parent_status"
  ON "parent_student_links" ("tenant_id", "parent_id", "status");

-- Leaderboard
CREATE INDEX IF NOT EXISTS "idx_user_xp_tenant_total"
  ON "user_xp" ("tenant_id", "total_xp" DESC);

-- Fee invoices (outstanding / status analytics)
CREATE INDEX IF NOT EXISTS "idx_fee_invoices_tenant_status"
  ON "fee_invoices" ("tenant_id", "status");

-- CRM leads
CREATE INDEX IF NOT EXISTS "idx_leads_tenant_status_created"
  ON "leads" ("tenant_id", "status", "created_at" DESC);
