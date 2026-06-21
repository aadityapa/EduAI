# Content Data Model — EduAI Production Framework

**Version:** 1.0 (structure only — not full curriculum content)

---

## Entity Hierarchy

```
Board (CBSE | ICSE | State)
 └── Class (1–10)
      └── Subject (Math, Science, English, ...)
           └── Chapter
                ├── Lesson (video + text)
                ├── Worksheet (PDF/interactive)
                └── Quiz (assessment)
```

---

## Subject Structure

```json
{
  "id": "uuid",
  "tenant_id": "uuid | null (platform catalog)",
  "board": "CBSE",
  "class_level": 8,
  "code": "MATH",
  "name": "Mathematics",
  "name_hi": "गणित",
  "name_mr": "गणित",
  "icon_url": "https://cdn.eduai.in/icons/math.svg",
  "sort_order": 1,
  "status": "draft | review | published | archived"
}
```

---

## Video / Lesson Structure

```json
{
  "id": "uuid",
  "chapter_id": "uuid",
  "title": "Introduction to Algebra",
  "duration_seconds": 720,
  "video_url": "https://cdn.eduai.in/videos/...",
  "thumbnail_url": "https://cdn.eduai.in/thumbs/...",
  "transcript": "...",
  "learning_objectives": ["Define variable", "Solve linear equations"],
  "difficulty": "beginner | intermediate | advanced",
  "language": "en | hi | mr",
  "ai_tutor_context": "Chapter summary for tutor prompts",
  "status": "draft | review | published"
}
```

---

## Worksheet Structure

```json
{
  "id": "uuid",
  "lesson_id": "uuid",
  "title": "Algebra Practice — Set 1",
  "type": "pdf | interactive",
  "file_url": "https://cdn.eduai.in/worksheets/...",
  "total_marks": 20,
  "estimated_minutes": 30,
  "answer_key_url": "https://... (teacher only)",
  "tags": ["practice", "homework"]
}
```

---

## Quiz Structure

```json
{
  "id": "uuid",
  "lesson_id": "uuid",
  "title": "Algebra Checkpoint",
  "time_limit_minutes": 15,
  "passing_score": 60,
  "max_attempts": 3,
  "questions": [
    {
      "type": "mcq | true_false | short_answer",
      "text": "What is 2x when x=3?",
      "options": ["4", "6", "8"],
      "correct_answer": "6",
      "explanation": "Multiply coefficient by variable value",
      "marks": 2,
      "difficulty": "easy"
    }
  ],
  "board_alignment": { "board": "CBSE", "class": 8, "topic_code": "NCERT-08-MATH-02" }
}
```

---

## Board Mapping (Classes 1–10)

| Board | Classes | Primary Subjects | Notes |
|-------|---------|------------------|-------|
| CBSE | 1–10 | Math, EVS/Science, English, Hindi, SST | NCERT alignment |
| ICSE | 1–10 | Math, Science, English, History/Geo, 2nd language | CISCE syllabus codes |
| State (MH) | 1–10 | Marathi medium variants | Balbharati alignment |
| State (Generic) | 1–10 | Configurable per state board | White-label schools |

Each `(board, class_level, subject)` tuple maps to a **curriculum track** in the database `courses` table with metadata JSON for board-specific codes.

---

## Content Status Workflow

`draft → internal_review → pilot → published → archived`

Role permissions:
- **Content author:** draft, submit for review
- **Content lead:** review, approve/reject
- **Platform admin:** publish, archive
