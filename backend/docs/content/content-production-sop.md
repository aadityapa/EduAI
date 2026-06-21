# Content Production SOP — EduAI

**Effective:** Phase 5 Beta  
**Owner:** Content Operations

---

## 1. Intake

1. Curriculum team receives board syllabus mapping (CBSE/ICSE/State)
2. Create content brief: class, subject, chapter, LOs, language(s)
3. Assign author + reviewer in content tracker (Linear/Jira)

---

## 2. Production

### Video Lessons
1. Script from LOs (max 12 min for classes 1–5, 15 min for 6–10)
2. Record → edit → upload to S3/Cloudinary
3. Generate transcript (human review required)
4. Add `ai_tutor_context` summary (200–400 words)

### Worksheets
1. Author in Google Docs → export PDF
2. Upload with naming: `{board}-{class}-{subject}-{chapter}-ws-{n}.pdf`
3. Teacher answer key in separate secure bucket

### Quizzes
1. Minimum 5 questions per lesson checkpoint
2. Map each question to LO
3. Run through `@eduai/ai` content filter before import
4. Import via admin CMS or seed script

---

## 3. Quality Gates

| Gate | Criteria | Sign-off |
|------|----------|----------|
| G1 Accuracy | Subject expert review | Teacher SME |
| G2 Language | Hindi/Marathi translation review | Localization lead |
| G3 Accessibility | Captions, readable fonts | QA |
| G4 Safety | AI tutor context screened | Content lead |
| G5 Technical | Video plays on 3G, mobile | QA |

---

## 4. Publishing

1. Status → `internal_review`
2. Reviewer approves → `pilot` (single school) or `published`
3. CDN cache invalidation on publish
4. Notify pilot schools via CRM

---

## 5. Maintenance

- Quarterly syllabus update review
- Broken link check monthly
- Analytics: completion rate <40% triggers content review

---

## SLAs (Beta)

| Item | SLA |
|------|-----|
| Chapter pack (5 lessons + quiz) | 10 business days |
| Translation (HI/MR) | +3 business days |
| Hotfix (factual error) | 24 hours |
