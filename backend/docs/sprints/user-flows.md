# EduAI — User Flows

**Document ID:** EDUAI-UF-001  
**Version:** 1.0.0  
**Status:** Approved for Pre-Development  
**Date:** June 2025  
**Owner:** Product Design

---

## 1. Overview

This document defines key user journeys as Mermaid flowcharts. Each flow maps to user stories in [User Stories](./user-stories.md) and sprint assignments in [Sprint Planning](./sprint-planning.md).

**Conventions:**
- `{decision}` — diamond decision node
- `[action]` — process step
- `((start/end))` — terminal nodes
- Error paths shown where critical for security or compliance

---

## 2. Registration & Onboarding

Covers B2C student/parent registration, parental consent (DPDP), and first-time onboarding wizard.

```mermaid
flowchart TD
    START((Landing Page)) --> CHOICE{User type?}

    CHOICE -->|Student| STU_REG[Enter email + password or Google OAuth]
    CHOICE -->|Parent| PAR_REG[Enter email + password or Google OAuth]
    CHOICE -->|School invite| INVITE[Click school enrollment link]

    STU_REG --> VERIFY[Verify email via link]
    PAR_REG --> VERIFY
    INVITE --> VERIFY

    VERIFY --> AGE{User under 18?}

    AGE -->|Yes| CONSENT[Request parental consent flow]
    AGE -->|No| PROFILE[Complete profile: name, board, class]

    CONSENT --> SEND_LINK[Send consent link to parent email]
    SEND_LINK --> PARENT_APPROVE{Parent approves?}
    PARENT_APPROVE -->|No| BLOCKED[Account limited until consent]
    PARENT_APPROVE -->|Yes| PROFILE

    PROFILE --> LINK{Parent linking?}
    LINK -->|Parent adds child| LINK_CHILD[Enter enrollment code / scan QR]
    LINK -->|Student only| ONBOARD

    LINK_CHILD --> CONFIRM_LINK[Parent confirms link request]
    CONFIRM_LINK --> ONBOARD[Onboarding wizard]

    ONBOARD --> DIAG{Diagnostic available?}
    DIAG -->|Yes| DIAG_TEST[Take diagnostic assessment]
    DIAG -->|No| DASHBOARD[Student dashboard]

    DIAG_TEST --> ADAPTIVE[Generate adaptive learning path]
    ADAPTIVE --> DASHBOARD

    DASHBOARD --> END((Onboarding complete))
    BLOCKED --> END
```

**Key touchpoints:** US-011, US-012, US-013, US-016, US-017, US-055, US-056

---

## 3. Student Learning Session

End-to-end flow from dashboard to lesson completion with XP and progress sync.

```mermaid
flowchart TD
    START((Student Dashboard)) --> CONTINUE{Continue learning?}

    CONTINUE -->|Yes| RESUME[Resume last incomplete lesson]
    CONTINUE -->|Browse| BROWSE[Navigate board → class → subject → chapter]

    RESUME --> LESSON[Open lesson]
    BROWSE --> LESSON

    LESSON --> TYPE{Lesson type?}

    TYPE -->|Video| VIDEO[Watch Mux video with progress tracking]
    TYPE -->|Interactive| INTERACTIVE[Complete interactive exercises]
    TYPE -->|Text + Quiz| TEXT[Read content + embedded quiz]

    VIDEO --> CHECKPOINT{Checkpoint quiz?}
    INTERACTIVE --> CHECKPOINT
    TEXT --> CHECKPOINT

    CHECKPOINT -->|Yes| QUIZ[Take checkpoint quiz]
    CHECKPOINT -->|No| COMPLETE

    QUIZ --> PASS{Score ≥ passing threshold?}
    PASS -->|No| REMEDIATE[Show remediation content]
    REMEDIATE --> QUIZ
    PASS -->|Yes| COMPLETE[Mark lesson complete]

    COMPLETE --> XP[Award XP + update streak]
    XP --> SYNC[Sync progress to Smart Learning Hub]
    SYNC --> REC{Recommendation engine}

    REC --> NEXT[Suggest next lesson]
    NEXT --> END((Return to dashboard))

    LESSON --> AI_HELP{Need help?}
    AI_HELP -->|Yes| TUTOR[Open AI Tutor with chapter context]
    TUTOR --> LESSON
```

**Key touchpoints:** US-041, US-043, US-044, US-046, US-056, US-060, US-171

---

## 4. AI Tutor Chat

Streaming conversational help with RAG, quota enforcement, and content safety.

```mermaid
flowchart TD
    START((Student in lesson or dashboard)) --> OPEN[Open AI Tutor panel]

    OPEN --> CONTEXT[Load chapter context + student profile]
    CONTEXT --> QUOTA{Daily quota remaining?}

    QUOTA -->|No| UPGRADE[Show upgrade prompt / quota exhausted message]
    UPGRADE --> END((Exit))

    QUOTA -->|Yes| INPUT[Student types question or uploads photo OCR]

    INPUT --> RAG[RAG retrieval from board-aligned content index]
    RAG --> ROUTE{Query complexity?}

    ROUTE -->|Simple| MINI[Route to mini model tier]
    ROUTE -->|Complex| FULL[Route to full model tier]

    MINI --> STREAM[Stream response via WebSocket]
    FULL --> STREAM

    STREAM --> SAFETY{Content safety filter pass?}

    SAFETY -->|Fail| BLOCK[Block response + show safe fallback message]
    SAFETY -->|Pass| DISPLAY[Display response to student]

    DISPLAY --> FOLLOW{Follow-up question?}
    FOLLOW -->|Yes| INPUT
    FOLLOW -->|No| LOG[Log conversation with 90-day retention policy]

    LOG --> METER[Decrement quota + log token spend]
    METER --> END

    BLOCK --> END
```

**Key touchpoints:** US-096, US-098, US-099, US-103, US-104, US-106

---

## 5. Homework Submission

Student submission through teacher grading workflow.

```mermaid
flowchart TD
    START((Student Dashboard)) --> TASKS[View assigned homework in Tasks widget]

    TASKS --> SELECT[Select homework assignment]
    SELECT --> READ[Read instructions + due date]

    READ --> WORK[Complete work offline/on-device]
    WORK --> SUBMIT_TYPE{Submission type?}

    SUBMIT_TYPE -->|Text| TEXT[Enter text response]
    SUBMIT_TYPE -->|Photo| PHOTO[Capture/upload photo to S3]
    SUBMIT_TYPE -->|Both| BOTH[Text + photo upload]

    TEXT --> VALIDATE{Valid submission?}
    PHOTO --> VALIDATE
    BOTH --> VALIDATE

    VALIDATE -->|No| ERROR[Show validation errors]
    ERROR --> WORK

    VALIDATE -->|Yes| UPLOAD[Upload to S3 + create submission record]
    UPLOAD --> STATUS[Status: Submitted — pending grade]

    STATUS --> NOTIFY_T[Notify teacher of new submission]
    NOTIFY_T --> TEACHER[Teacher reviews in grading queue]

    TEACHER --> GRADE{Grade with rubric}
    GRADE --> FEEDBACK[Add feedback comments]
    FEEDBACK --> PUBLISH[Publish grade to student]

    PUBLISH --> NOTIFY_S[Notify student + parent]
    NOTIFY_S --> VIEW[Student views grade + feedback]

    VIEW --> END((Homework complete))

    READ --> AI_HINT{Need hint?}
    AI_HINT -->|Yes| HINT[Homework Assistant — hints only, no direct answer]
    HINT --> WORK
```

**Key touchpoints:** US-100, US-101, US-102, US-132, US-133, US-152

---

## 6. Parent Progress Review

Multi-child dashboard, weekly AI reports, and consent controls.

```mermaid
flowchart TD
    START((Parent Login)) --> DASH[Multi-child dashboard]

    DASH --> SELECT{Select child?}
    SELECT -->|Overview| OVERVIEW[View all children summary cards]
    SELECT -->|Specific child| CHILD[Child detail view]

    OVERVIEW --> METRICS[Streak, XP, homework status, mock test scores]
    CHILD --> DETAIL[Progress heatmap + recent activity feed]

    METRICS --> REPORT{Weekly report available?}
    DETAIL --> REPORT

    REPORT -->|Yes| AI_REPORT[View AI-generated narrative progress report]
    REPORT -->|No| ACTIONS

    AI_REPORT --> DOWNLOAD{Download PDF?}
    DOWNLOAD -->|Yes| PDF[Generate and download PDF report]
    DOWNLOAD -->|No| ACTIONS

    PDF --> ACTIONS{Parent action?}
    ACTIONS -->|Screen time| SCREEN[Configure screen time limits]
    ACTIONS -->|Consent| CONSENT[Manage DPDP consent preferences]
    ACTIONS -->|Features| FEATURES[Enable/disable AI tutor, leaderboard]
    ACTIONS -->|Message teacher| MSG[Send message to teacher]
    ACTIONS -->|Subscription| BILL[Manage subscription + payment]

    SCREEN --> SAVE[Save preferences]
    CONSENT --> SAVE
    FEATURES --> SAVE
    MSG --> SAVE
    BILL --> SAVE

    SAVE --> END((Return to dashboard))
```

**Key touchpoints:** US-146, US-147, US-149, US-150, US-157, US-158

---

## 7. Teacher Question Paper Generator (QPG)

AI-assisted exam paper creation with teacher review and publish.

```mermaid
flowchart TD
    START((Teacher Portal)) --> QPG[Open Question Paper Generator]

    QPG --> CONFIG[Configure: board, class, subject, exam type]
    CONFIG --> FILTERS[Set filters: topics, difficulty mix, question types]

    FILTERS --> PATTERN[Select board exam pattern template]
    PATTERN --> GENERATE[AI generates question paper draft]

    GENERATE --> PREVIEW[Preview generated paper]
    PREVIEW --> REVIEW{Teacher satisfied?}

    REVIEW -->|No| EDIT[Edit questions manually]
    EDIT --> ADD[Add/remove/replace questions]
    ADD --> PREVIEW

    REVIEW -->|Yes| REGEN{Regenerate section?}
    REGEN -->|Yes| PARTIAL[Regenerate specific section only]
    PARTIAL --> PREVIEW
    REGEN -->|No| FINALIZE

    FINALIZE[Finalize paper] --> SAVE{Action?}

    SAVE -->|Save draft| DRAFT[Save to drafts]
    SAVE -->|Publish| PUBLISH[Publish to class or question bank]
    SAVE -->|Print| PRINT[Export PDF for printing]

    PUBLISH --> ASSIGN{Assign to class?}
    ASSIGN -->|Yes| DEADLINE[Set deadline + notify students]
    ASSIGN -->|No| BANK[Add to curated question bank]

    DEADLINE --> END((QPG complete))
    BANK --> END
    DRAFT --> END
    PRINT --> END
```

**Key touchpoints:** US-114, US-115, US-116, US-119

---

## 8. School Onboarding

B2B tenant provisioning, bulk user import, and white-label configuration.

```mermaid
flowchart TD
    START((Sales closes B2B contract)) --> ADMIN[Platform admin creates tenant]

    ADMIN --> CONFIG[Configure tenant: name, plan, feature flags]
    CONFIG --> BRAND[Set white-label branding: logo, colors, domain]

    BRAND --> SCHOOL[Create school entity under tenant]
    SCHOOL --> IMPORT[Bulk import students + teachers via CSV]

    IMPORT --> VALIDATE{Import validation pass?}
    VALIDATE -->|Errors| FIX[Download error report + fix CSV]
    FIX --> IMPORT
    VALIDATE -->|Pass| ACCOUNTS[Provision user accounts + send invite emails]

    ACCOUNTS --> ROLES[Assign roles: school admin, teachers, students]
    ROLES --> LINK[Generate parent linking codes / QR sheets]

    LINK --> TRAIN[Schedule teacher training session]
    TRAIN --> PILOT[Pilot launch with selected classes]

    PILOT --> FEEDBACK{Pilot feedback positive?}
    FEEDBACK -->|Adjust| CONFIG
    FEEDBACK -->|Yes| GOLIVE[Full school rollout]

    GOLIVE --> BILLING[Activate B2B billing / invoicing]
    BILLING --> MONITOR[Monitor adoption via tenant dashboard]
    MONITOR --> END((School live on EduAI))
```

**Key touchpoints:** US-026, US-027, US-034, US-037, US-161, US-169, US-199

---

## 9. Subscription Purchase

B2C freemium trial through Razorpay payment and feature activation.

```mermaid
flowchart TD
    START((Parent or Student hits paywall)) --> PLAN[View subscription plans: Free, Pro, Family]

    PLAN --> SELECT{Select plan?}
    SELECT -->|Free| FREE[Continue with freemium limits]
    SELECT -->|Pro/Family| TRIAL[Start 7-day free trial]

    FREE --> END_FREE((Use freemium features))

    TRIAL --> CHECKOUT[Razorpay checkout: UPI / card / netbanking]
    CHECKOUT --> PAY{Payment authorized?}

    PAY -->|Failed| RETRY[Show error + retry option]
    RETRY --> CHECKOUT

    PAY -->|Success| WEBHOOK[Razorpay webhook → billing service]
    WEBHOOK --> ACTIVATE[Activate subscription tier + feature flags]

    ACTIVATE --> FAMILY{Family plan?}
    FAMILY -->|Yes| LINK_KIDS[Link up to 5 children]
    FAMILY -->|No| CONFIRM

    LINK_KIDS --> CONFIRM[Send confirmation email + receipt]
    CONFIRM --> UNLOCK[Unlock Pro features: unlimited AI, offline, etc.]

    UNLOCK --> AUTOPAY{Enable UPI autopay?}
    AUTOPAY -->|Yes| MANDATE[Create Razorpay subscription mandate]
    AUTOPAY -->|No| END_PAID

    MANDATE --> END_PAID((Subscription active))

    ACTIVATE --> RENEW[Schedule renewal reminders]
    RENEW --> END_PAID
```

**Key touchpoints:** US-154, US-158, US-159, US-196, US-197, US-198

---

## 10. Cross-Flow Dependencies

```mermaid
graph LR
    REG[Registration] --> ONBOARD[Onboarding]
    ONBOARD --> LEARN[Learning Session]
    LEARN --> AI[AI Tutor]
    LEARN --> HW[Homework]
    HW --> TEACHER[Teacher Grading]
    LEARN --> PARENT[Parent Review]
    TEACHER --> PARENT
    SCHOOL[School Onboarding] --> REG
    SUB[Subscription] --> AI
    SUB --> LEARN
```

---

## 11. Error & Edge Case Flows

### 11.1 Session Expiry During Learning

```mermaid
flowchart TD
    ACTIVE[Active learning session] --> EXPIRE{JWT expired?}
    EXPIRE -->|Yes| REFRESH[Attempt silent refresh token]
    REFRESH --> OK{Refresh success?}
    OK -->|Yes| ACTIVE
    OK -->|No| LOGIN[Redirect to login with return URL]
    EXPIRE -->|No| ACTIVE
```

### 11.2 AI Quota Exhausted Mid-Conversation

```mermaid
flowchart TD
    CHAT[AI chat in progress] --> QUOTA{Quota check on each message}
    QUOTA -->|Remaining| RESPOND[Process and respond]
    QUOTA -->|Exhausted| STOP[Graceful stop + upgrade CTA]
    STOP --> SAVE[Save conversation history]
```

---

*Related: [User Stories](./user-stories.md) · [Sprint Planning](./sprint-planning.md) · [PRD](../prd/product-requirements-document.md)*
