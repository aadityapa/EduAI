-- Sprint 2: Student Learning Platform

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('video', 'text', 'interactive', 'mixed');
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'review', 'published', 'archived');
CREATE TYPE "LessonProgressStatus" AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE "QuestionType" AS ENUM ('mcq', 'multi_select', 'true_false', 'fill_blank', 'short_answer');
CREATE TYPE "AttemptStatus" AS ENUM ('in_progress', 'submitted', 'graded', 'expired');
CREATE TYPE "ContentResourceType" AS ENUM ('video', 'pdf', 'notes', 'worksheet', 'ebook');
CREATE TYPE "ParentLinkStatus" AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE "SupportedLocale" AS ENUM ('en', 'hi', 'mr');

-- CreateTable
CREATE TABLE "boards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "country" VARCHAR(2) NOT NULL DEFAULT 'IN',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subjects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "board_id" UUID NOT NULL,
    "class_level" SMALLINT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon_url" VARCHAR(500),
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chapters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "chapter_number" SMALLINT NOT NULL,
    "description" TEXT,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "courses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "board_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "class_level" SMALLINT NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "lessons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "chapter_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "LessonType" NOT NULL DEFAULT 'mixed',
    "duration_minutes" SMALLINT,
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "lesson_contents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lesson_id" UUID NOT NULL,
    "body" TEXT,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "lesson_contents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content_resources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lesson_id" UUID NOT NULL,
    "type" "ContentResourceType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "duration_secs" INTEGER,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "content_resources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "course_enrollments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "enrolled_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "lesson_progress" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "status" "LessonProgressStatus" NOT NULL DEFAULT 'not_started',
    "score" DECIMAL(5,2),
    "time_spent_seconds" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quizzes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "lesson_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "time_limit_minutes" SMALLINT,
    "passing_score" DECIMAL(5,2) NOT NULL DEFAULT 70,
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quiz_id" UUID NOT NULL,
    "type" "QuestionType" NOT NULL,
    "stem" TEXT NOT NULL,
    "explanation" TEXT,
    "marks" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "question_options" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question_id" UUID NOT NULL,
    "label" VARCHAR(500) NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quiz_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "score" DECIMAL(5,2),
    "time_spent_seconds" INTEGER,
    "status" "AttemptStatus" NOT NULL DEFAULT 'in_progress',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMPTZ,
    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "parent_student_links" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "parent_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "relationship" VARCHAR(50) NOT NULL DEFAULT 'parent',
    "status" "ParentLinkStatus" NOT NULL DEFAULT 'pending',
    "verified_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "parent_student_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_xp" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "user_xp_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_coins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "user_coins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "badges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon_url" VARCHAR(500),
    "criteria" JSONB NOT NULL,
    "xp_reward" INTEGER NOT NULL DEFAULT 0,
    "category" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_badges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "badge_id" UUID NOT NULL,
    "earned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_streaks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_activity_date" DATE,
    "freeze_tokens" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "namespace" VARCHAR(100) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "locale" "SupportedLocale" NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boards_code_key" ON "boards"("code");
CREATE UNIQUE INDEX "subjects_board_id_class_level_code_key" ON "subjects"("board_id", "class_level", "code");
CREATE INDEX "idx_chapters_subject" ON "chapters"("subject_id");
CREATE INDEX "idx_courses_tenant_status" ON "courses"("tenant_id", "status");
CREATE INDEX "idx_courses_board_class" ON "courses"("board_id", "class_level");
CREATE INDEX "idx_lessons_chapter" ON "lessons"("chapter_id", "status");
CREATE UNIQUE INDEX "course_enrollments_tenant_id_course_id_user_id_key" ON "course_enrollments"("tenant_id", "course_id", "user_id");
CREATE INDEX "idx_enrollments_user" ON "course_enrollments"("tenant_id", "user_id");
CREATE UNIQUE INDEX "lesson_progress_tenant_id_user_id_lesson_id_key" ON "lesson_progress"("tenant_id", "user_id", "lesson_id");
CREATE INDEX "idx_lesson_progress_user" ON "lesson_progress"("tenant_id", "user_id", "status");
CREATE INDEX "idx_quiz_attempts_user" ON "quiz_attempts"("tenant_id", "user_id");
CREATE UNIQUE INDEX "parent_student_links_tenant_id_parent_id_student_id_key" ON "parent_student_links"("tenant_id", "parent_id", "student_id");
CREATE UNIQUE INDEX "user_xp_user_id_key" ON "user_xp"("user_id");
CREATE UNIQUE INDEX "user_xp_tenant_id_user_id_key" ON "user_xp"("tenant_id", "user_id");
CREATE UNIQUE INDEX "user_coins_user_id_key" ON "user_coins"("user_id");
CREATE UNIQUE INDEX "user_coins_tenant_id_user_id_key" ON "user_coins"("tenant_id", "user_id");
CREATE UNIQUE INDEX "badges_tenant_id_code_key" ON "badges"("tenant_id", "code");
CREATE UNIQUE INDEX "user_badges_tenant_id_user_id_badge_id_key" ON "user_badges"("tenant_id", "user_id", "badge_id");
CREATE UNIQUE INDEX "user_streaks_user_id_key" ON "user_streaks"("user_id");
CREATE UNIQUE INDEX "user_streaks_tenant_id_user_id_key" ON "user_streaks"("tenant_id", "user_id");
CREATE INDEX "idx_translations_ns_locale" ON "translations"("namespace", "locale");
CREATE UNIQUE INDEX "translations_tenant_id_namespace_key_locale_key" ON "translations"("tenant_id", "namespace", "key", "locale");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "lesson_contents" ADD CONSTRAINT "lesson_contents_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "content_resources" ADD CONSTRAINT "content_resources_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "parent_student_links" ADD CONSTRAINT "parent_student_links_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "parent_student_links" ADD CONSTRAINT "parent_student_links_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "parent_student_links" ADD CONSTRAINT "parent_student_links_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_xp" ADD CONSTRAINT "user_xp_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_xp" ADD CONSTRAINT "user_xp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_coins" ADD CONSTRAINT "user_coins_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_coins" ADD CONSTRAINT "user_coins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "badges" ADD CONSTRAINT "badges_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "translations" ADD CONSTRAINT "translations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
