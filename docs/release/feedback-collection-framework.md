# Beta Feedback Collection Framework

---

## Channels

| Channel | Audience | Frequency |
|---------|----------|-----------|
| In-app feedback form | Students/teachers | Always available |
| Weekly school admin call | Admins | Weekly |
| NPS survey (Typeform/Google) | All roles | End of month 1 |
| App store reviews | Parents | Ongoing |
| AI tutor thumbs up/down | Students | Per session |

---

## Survey Questions (School Admin — Week 2)

1. How easy was onboarding? (1–10)
2. Which feature delivers most value?
3. Top 3 frustrations?
4. Would you recommend to another school? (NPS 0–10)
5. Missing content subjects?

---

## Student/Teacher Micro-Feedback

After quiz completion:
- "Was this quiz fair and clear?" 👍/👎
- Optional free text (max 500 chars)

---

## Data Pipeline

```
Feedback → CRM `feedback_entries` → Weekly product review → GitHub issues
```

Tag with: `tenant_id`, `role`, `feature`, `sentiment`

---

## Action Thresholds

| Signal | Action |
|--------|--------|
| NPS < 30 | Executive review within 48h |
| Same issue from 2+ schools | Promote to `beta/blocker` |
| AI safety report | Immediate engineering + content review |

---

## Privacy

Anonymize student free-text before aggregate analysis. Schools may request deletion per DPA.
