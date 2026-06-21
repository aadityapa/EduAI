# EduAI — Wireframes (ASCII / Text)

**Document ID:** EDUAI-WF-001  
**Version:** 1.0.0  
**Date:** June 2025  
**Owner:** Product Design

---

## 1. Purpose

Low-fidelity wireframes for major EduAI screens across all portals. These define layout regions, content hierarchy, and primary actions before high-fidelity Figma work. Dimensions assume desktop (1280×800) unless noted as mobile (390×844).

**Legend:**

```
[ Button ]     Primary action
( Link )       Secondary navigation
|xxx|          Progress bar
[*]            Notification indicator
===            Section divider
```

---

## 2. Student Portal

### 2.1 Student Dashboard (Class 5–7 Band — Web)

Target persona: Arjun, Class 5, gamified layout with streak emphasis.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  EduAI          🔍 Search    🔔(2)   🔥 7-day streak   [Avatar ▼]   │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  नमस्ते, Arjun! 👋                              XP: 2,450  Lv.12 │
│  🏠 Home │  ─────────────────────────────────────────────────────────────── │
│  📚 Learn│                                                                  │
│  ✨ AI   │  ┌─ CONTINUE LEARNING ─────────────────────────────────────────┐ │
│  📝 Tests│  │  [▶ Thumbnail]   Fractions — Introduction                   │ │
│  🏆 Rewards│  │                  Mathematics · Ch. 4                        │ │
│  📋 HW   │  │                  |████████░░░░░░░░| 45%                     │ │
│  👤 Profile│  │                  [ Continue Lesson ]                       │ │
│          │  └─────────────────────────────────────────────────────────────┘ │
│          │                                                                  │
│          │  ┌─ TODAY'S TASKS ──────┐  ┌─ STREAK ────────┐  ┌─ BADGES ────┐ │
│          │  │ 📋 Algebra WS        │  │  🔥 7 days      │  │ 🏅 Math Whiz│ │
│          │  │    Due: 22 Jun       │  │  ❄ 1 freeze     │  │ 🏅 Streak 7 │ │
│          │  │ 📊 Science Quiz      │  │  [ Keep it up! ]│  │ ( View all )│ │
│          │  │    Tomorrow          │  └─────────────────┘  └─────────────┘ │
│          │  └──────────────────────┘                                        │
│          │                                                                  │
│          │  ┌─ SUBJECTS ──────────────────────────────────────────────────┐ │
│          │  │ [Math 📐]  [Science 🔬]  [English 📖]  [Hindi 🇮🇳]  [+More]│ │
│          │  └─────────────────────────────────────────────────────────────┘ │
│          │                                                                  │
│          │  ┌─ CLASS LEADERBOARD (Weekly) ────────────────────────────────┐ │
│          │  │  1. Arjun P.  ████████████ 450 XP  ← You                   │ │
│          │  │  2. Priya S.  ██████████░░ 420 XP                          │ │
│          │  │  3. Rahul K.  ████████░░░░ 380 XP                          │ │
│          │  └─────────────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

**Key interactions:** Continue Learning is the hero CTA. Streak widget links to `/student/rewards/streak`. Subject tiles navigate to chapter list.

---

### 2.2 Student Dashboard (Class 8–10 Band — Mobile)

Exam-focused, compact layout for mobile-first teens.

```
┌──────────────────────────────┐
│ EduAI          🔔  🔥7  [Av] │
├──────────────────────────────┤
│ Hi, Arjun                    │
│ Board: CBSE · Class 10       │
│                              │
│ ┌─ CONTINUE ────────────────┐│
│ │ Quadratic Equations       ││
│ │ Math · 62% |███████░░░|   ││
│ │ [ Continue ]              ││
│ └───────────────────────────┘│
│                              │
│ ┌─ UPCOMING ────────────────┐│
│ │ 📝 Mock Test · 25 Jun     ││
│ │ 📋 Physics HW · Due today ││
│ └───────────────────────────┘│
│                              │
│ QUICK ACTIONS                │
│ ┌────────┐ ┌────────┐       │
│ │ ✨ AI  │ │ 📝 Test│       │
│ │ Tutor  │ │  Mode  │       │
│ └────────┘ └────────┘       │
│ ┌────────┐ ┌────────┐       │
│ │ 📚 Learn│ │ 🏆 Rank│       │
│ └────────┘ └────────┘       │
│                              │
│ STUDY PLANNER (This Week)    │
│ Mon Tue Wed Thu Fri Sat Sun  │
│  ●   ●   ○   ○   ○   ○   ○  │
├──────────────────────────────┤
│ 🏠  📚  ✨  📝  🏆           │
│ Home Learn AI  Tests Rewards │
└──────────────────────────────┘
```

---

### 2.3 AI Tutor Chat (Web)

Conversational interface with chapter context and RAG source citations.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard          AI Tutor                    Quota: 47/50 today │
├─────────────────────────────────────────────────────────────────────────────┤
│ CONTEXT: Mathematics › Fractions › Ch. 4 — Introduction          [ Change ] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 AI Tutor · 3:15 PM                                               │   │
│  │ Hi Arjun! I see you're learning about fractions. What would you     │   │
│  │ like help with today?                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                    ┌─────────────────────────────────────────────────────┐  │
│                    │ भिन्न क्या होते हैं? आसान भाषा में समझाओ।          │  │
│                    │                                    You · 3:16 PM │  │
│                    └─────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 AI Tutor · 3:16 PM                                               │   │
│  │ भिन्न एक whole को equal parts में बाँटने का तरीका है...              │   │
│  │                                                                     │   │
│  │ 📎 Sources:                                                         │   │
│  │    · Fractions — Introduction (Lesson)                              │   │
│  │    · NCERT Class 5 Math, Ch. 7                                      │   │
│  │                                                                     │   │
│  │ [ 👍 Helpful ]  [ 👎 Not helpful ]  [ 🔊 Read aloud ]              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Suggested:  [ What is numerator? ]  [ Practice problem ]  [ Give hint ]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────┐ [ Send ] │
│ │ Type your question... (Hindi / English)                       │          │
│ └───────────────────────────────────────────────────────────────┘          │
│ 🎤 Voice input    📷 Upload homework image    ⚠️ Hints only, not answers   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.4 Lesson Player (Web)

Video lesson with checkpoint quiz sidebar.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Fractions — Introduction                              |███████░░░| 70%    │
├────────────────────────────────────────────┬────────────────────────────────┤
│                                            │  CHAPTER OUTLINE              │
│                                            │  ✓ 1. What is a fraction?     │
│         ┌──────────────────────┐           │  ● 2. Numerator & denominator │
│         │                      │           │  ○ 3. Like fractions          │
│         │    VIDEO PLAYER      │           │  ○ 4. Practice quiz           │
│         │    (Mux embed)       │           │                               │
│         │                      │           │  ─────────────────────────    │
│         └──────────────────────┘           │  CHECKPOINT QUIZ              │
│  ▶ ━━━━━━━●━━━━━━━━━━  08:24 / 12:00      │                               │
│  [ ◀◀ ] [ ▶/❚❚ ] [ ▶▶ ]  CC  1x  ⛶       │  Q: Which is greater?         │
│                                            │  ○ 1/4    ○ 1/2               │
│  [ ← Previous ]          [ Next Lesson → ] │  ○ 3/4    ○ 2/3               │
│                                            │                               │
│                                            │  [ Submit Answer ]            │
└────────────────────────────────────────────┴────────────────────────────────┘
```

---

### 2.5 Mock Test Attempt (Mobile)

Timed exam mode with question navigator.

```
┌──────────────────────────────┐
│ Mock Test: Science Unit 2    │
│ ⏱ 1:23:45 remaining    [Exit]│
├──────────────────────────────┤
│ Question 12 of 40     [ 3 marks]│
│                              │
│ Which gas is released during │
│ photosynthesis?              │
│                              │
│ ○ Carbon dioxide             │
│ ○ Nitrogen                   │
│ ● Oxygen                     │
│ ○ Hydrogen                   │
│                              │
│ [ Flag for review ]          │
│                              │
├──────────────────────────────┤
│ Q: 1 2 3 ... 11 [12] 13 ... 40│
│    ✓  ✓ ✓     ✓  ●   ○       │
│    (green=done, blue=current) │
├──────────────────────────────┤
│ [ ← Prev ]        [ Next → ] │
│                              │
│ [ Submit Test ]              │
└──────────────────────────────┘
```

---

### 2.6 Gamification Hub (Web)

Duolingo-inspired rewards center.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏆 Rewards Center                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─ STREAK ──────────────────────────────────────────────────────────────┐  │
│  │     🔥 7 Day Streak!                                                  │  │
│  │     M   T   W   T   F   S   S                                         │  │
│  │     ✓   ✓   ✓   ✓   ✓   ✓   ✓                                         │  │
│  │     Freeze tokens: ❄❄ (2 remaining)    [ Use Freeze ]               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ XP & LEVEL ──────────────┐  ┌─ RECENT BADGES ────────────────────────┐  │
│  │  Level 12                 │  │  🏅 Math Whiz      18 Jun              │  │
│  │  |████████████████░░|     │  │  🏅 7-Day Streak   15 Jun              │  │
│  │  2,450 / 2,600 XP         │  │  🏅 Quiz Master    10 Jun              │  │
│  │  +50 XP from last lesson  │  │  ( View all 24 badges )               │  │
│  └───────────────────────────┘  └────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ LEADERBOARD — Class 8-A (Weekly) ───────────────────────────────────┐  │
│  │  Rank  Name           XP      Trend                                   │  │
│  │  ────  ─────────────  ────    ─────                                   │  │
│  │   1    Arjun P.       450     ▲ +120                                  │  │
│  │   2    Priya S.       420     ▲ +95                                   │  │
│  │   3    Rahul K.       380     ▼ -10                                   │  │
│  │  ...                                                                  │  │
│  │  12    You            210     ▲ +45                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Parent Portal

### 3.1 Parent Dashboard (Web)

Multi-child overview for Meera persona (two children, Class 3 and Class 8).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  Parent Portal        🔍    🔔(3)    [ Meera K. ▼ ]                  │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  Good evening, Meera                                           │
│ 🏠 Home  │  Family Plan: Professional · Renews 15 Jul        [ Manage ]  │
│ 👨‍👩‍👧 Children│  ─────────────────────────────────────────────────────────────── │
│ 📊 Reports│                                                                 │
│ 💬 Messages│  YOUR CHILDREN                                                  │
│ ⚙ Controls│  ┌─────────────────────────┐  ┌─────────────────────────┐     │
│ 💳 Billing│  │ [Avatar] Arjun          │  │ [Avatar] Kavya          │     │
│ 📋 Consent│  │ Class 5 · CBSE          │  │ Class 8 · CBSE          │     │
│ 👤 Profile│  │ 🔥 7-day streak         │  │ 🔥 3-day streak         │     │
│          │  │ Last active: 2 hrs ago  │  │ Last active: Today 4pm  │     │
│          │  │ Math: 78%  Sci: 65%     │  │ Math: 82%  Sci: 71%     │     │
│          │  │ ⚠ HW due tomorrow       │  │ ✓ All caught up         │     │
│          │  │ [ View Progress ]       │  │ [ View Progress ]       │     │
│          │  └─────────────────────────┘  └─────────────────────────┘     │
│          │                                                                 │
│          │  ┌─ WEEKLY AI REPORT ──────────────────────────────────────────┐ │
│          │  │  "Arjun showed strong improvement in fractions this week,   │ │
│          │  │   completing 5 lessons with 85% avg quiz score. Kavya       │ │
│          │  │   should focus on Science Ch. 5 — photosynthesis..."        │ │
│          │  │  Generated: 16 Jun 2025          [ Read Full ] [ Archive ]  │ │
│          │  └─────────────────────────────────────────────────────────────┘ │
│          │                                                                 │
│          │  ┌─ ALERTS ────────────────────────────────────────────────────┐ │
│          │  │  ⚠ Arjun: Algebra homework due 22 Jun                       │ │
│          │  │  💬 Message from Mr. Sharma (Math teacher)                  │ │
│          │  │  📊 Kavya: Mock test score available                        │ │
│          │  └─────────────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Child Progress Detail (Web)

Drill-down for a single child with subject breakdown.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard     Arjun's Progress · Class 5 · CBSE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ Overview ]  [ Subjects ]  [ Activity ]  [ Screen Time ]                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  THIS WEEK                          OVERALL (Term)                          │
│  ┌──────────────────────────┐       ┌──────────────────────────┐           │
│  │ Lessons: 5 completed     │       │ Avg Quiz Score: 78%      │           │
│  │ Time: 2h 45m             │       │ Skills Improved: 3       │           │
│  │ AI Queries: 8            │       │ Badges Earned: 2         │           │
│  │ Streak: 7 days 🔥        │       │ Rank: #3 in class        │           │
│  └──────────────────────────┘       └──────────────────────────┘           │
│                                                                             │
│  SUBJECT BREAKDOWN                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Mathematics    |████████████████░░░░| 78%   ↑ +5%    [ Details ]  │   │
│  │ Science        |████████████░░░░░░░░| 65%   → 0%     [ Details ]  │   │
│  │ English        |██████████████░░░░░░| 72%   ↑ +3%    [ Details ]  │   │
│  │ Hindi          |█████████████████░░░| 85%   ↑ +8%    [ Details ]  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  SKILL GAPS (AI Identified)                                                 │
│  · Fractions — unlike denominators (Medium priority)                        │
│  · Science — plant reproduction (Low priority)                              │
│                                                                             │
│  [ Message Teacher ]    [ Set Screen Time Limit ]    [ Download Report ]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Screen Time Controls (Web)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Screen Time & Usage Controls                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Child: [ Arjun ▼ ]                                                         │
│                                                                             │
│  DAILY LIMIT                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Weekdays:  [ 1 hr 30 min ▼ ]                                       │   │
│  │  Weekends:  [ 2 hr 30 min ▼ ]                                       │   │
│  │  ☑ Block access when limit reached                                  │   │
│  │  ☑ Send me notification at 80% usage                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ALLOWED HOURS                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Mon-Fri:  4:00 PM ────────── 8:00 PM                               │   │
│  │  Sat-Sun:  9:00 AM ────────── 8:00 PM                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  FEATURE RESTRICTIONS                                                       │
│  ☑ AI Tutor    ☑ Lessons    ☑ Tests    ☐ Leaderboard (competitive)         │
│                                                                             │
│  [ Save Changes ]                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Teacher Portal

### 4.1 Teacher Dashboard (Web)

Rajesh persona — today's schedule and pending grading.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  Teacher Portal       🔍    🔔(5)    [ Mr. Rajesh Sharma ▼ ]       │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  Good morning, Rajesh · Thursday, 20 Jun 2025                    │
│ 🏠 Home  │  ─────────────────────────────────────────────────────────────── │
│ 📚 Classes│                                                                 │
│ 📝 Assign│  TODAY'S SCHEDULE                                               │
│ 📄 QPG   │  ┌────────────────────────────────────────────────────────────┐ │
│ 📊 Analytics│  │ 8:00  Class 6-A  Mathematics   Room 201   [ Attendance ]│ │
│ 📖 Content│  │ 9:00  Class 7-B  Mathematics   Room 203   [ Attendance ]│ │
│ 💬 Comms │  │ 11:00 Class 8-A  Mathematics   Lab 1      [ Attendance ]│ │
│ 👤 Profile│  └────────────────────────────────────────────────────────────┘ │
│          │                                                                 │
│          │  PENDING ACTIONS                                                │
│          │  ┌─ GRADING (12 submissions) ────┐  ┌─ QUICK ACTIONS ────────┐ │
│          │  │ Class 8-A · Algebra WS         │  │ [ Create Assignment ]  │ │
│          │  │ Due: Yesterday · 12 pending    │  │ [ Generate Q. Paper ]  │ │
│          │  │ [ Grade Now ]                  │  │ [ Mark Attendance ]    │ │
│          │  └────────────────────────────────┘  └────────────────────────┘ │
│          │                                                                 │
│          │  CLASS SNAPSHOT                                                   │
│          │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│          │  │ Class 6-A    │ │ Class 7-B    │ │ Class 8-A    │             │
│          │  │ 32 students  │ │ 28 students  │ │ 31 students  │             │
│          │  │ Avg: 72%     │ │ Avg: 68%     │ │ Avg: 75%     │             │
│          │  │ 2 at risk    │ │ 4 at risk    │ │ 1 at risk    │             │
│          │  │ [ View ]     │ │ [ View ]     │ │ [ View ]     │             │
│          │  └──────────────┘ └──────────────┘ └──────────────┘             │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Class View (Web)

Central hub for a single class — roster, performance, actions.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← My Classes    Class 8-A · Mathematics · ICSE · 31 students                │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ Overview ]  [ Roster ]  [ Attendance ]  [ Assignments ]  [ Analytics ]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CLASS PERFORMANCE (This Term)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Avg Score: 75%    Completion: 82%    Attendance: 91%              │   │
│  │  ▁▂▃▅▆▇ Chart: Weekly avg scores (last 8 weeks)                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  STUDENTS AT RISK (AI Flagged)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⚠ Amit K.   — 3 missed assignments, Math avg 42%    [ View ] [Msg]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  RECENT ASSIGNMENTS                                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Assignment          Due        Submitted   Avg Score   Status       │  │
│  │  ──────────────────  ─────────  ─────────   ─────────   ──────────   │  │
│  │  Algebra WS Ch.3     22 Jun     19/31       71%         Open         │  │
│  │  Linear Eq Quiz      15 Jun     31/31       78%         Graded       │  │
│  │  Fractions Test      8 Jun      30/31       82%         Graded       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [ + New Assignment ]  [ Generate Q. Paper ]  [ Send Announcement ]        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Question Paper Generator (Web)

AI-assisted paper creation with teacher review step.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Question Paper Generator                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  STEP 1: CONFIGURE                          STEP 2: REVIEW (after generate) │
│  ┌─────────────────────────────┐                                              │
│  │ Title: [ Class 8 Math UT2  ]│            (Preview panel appears here     │
│  │ Class:  [ 8-A ▼ ]           │             after generation completes)     │
│  │ Board:  [ ICSE ▼ ]          │                                              │
│  │ Topics: [x Algebra] [x Linear Eq] [+ Add]                                   │
│  │                             │                                              │
│  │ Difficulty Mix:             │                                              │
│  │ Easy:   [===░░] 30%         │                                              │
│  │ Medium: [=====░] 50%        │                                              │
│  │ Hard:   [==░░░] 20%         │                                              │
│  │                             │                                              │
│  │ Question Types:             │                                              │
│  │ MCQ: 10  Short: 5  Long: 2  │                                              │
│  │ Total Marks: [ 50 ]         │                                              │
│  │ Duration: [ 90 min ]        │                                              │
│  │                             │                                              │
│  │ [ Generate Paper ✨ ]       │                                              │
│  └─────────────────────────────┘                                              │
│                                                                             │
│  Status: Ready to generate · Est. time: ~45 seconds                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Grading Interface (Web)

Split view for homework submission review.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Grade: Algebra Worksheet Ch.3 · Class 8-A · Submission 8 of 12              │
├──────────────────────────────────┬──────────────────────────────────────────┤
│  STUDENT SUBMISSION              │  GRADING PANEL                           │
│  Arjun Patil · Submitted 19 Jun  │                                          │
│                                  │  Student: Arjun Patil                    │
│  ┌────────────────────────────┐  │  Score: [ 18 ] / 20                      │
│  │                            │  │                                          │
│  │  [Uploaded worksheet       │  │  Rubric:                                 │
│  │   image — zoomable]        │  │  ☑ Correct method (5/5)                  │
│  │                            │  │  ☑ Accurate calculation (8/8)            │
│  └────────────────────────────┘  │  ☐ Neat presentation (3/5) → 3/5        │
│                                  │  ☑ All questions attempted (5/5)         │
│  Student notes:                  │                                          │
│  "Used formula from Ch. 3"       │  Feedback:                               │
│                                  │  ┌────────────────────────────────────┐  │
│                                  │  │ Good work on Q3-Q5. Review         │  │
│                                  │  │ presentation for Q7.               │  │
│                                  │  └────────────────────────────────────┘  │
│                                  │  [ AI Suggest Feedback ]                 │
│                                  │                                          │
│                                  │  [ ← Prev ]  [ Save & Next → ]           │
└──────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 5. Admin Portal

### 5.1 Platform Admin — Tenant Management (Web)

Dr. Sharma / Platform Admin persona for white-label provisioning.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  Platform Admin       🔍    🔔    [ Admin User ▼ ]                   │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  Tenant Management                              [ + New Tenant ]│
│ 🏠 Dashboard│  ─────────────────────────────────────────────────────────────── │
│ 🏢 Tenants│                                                                 │
│ 📊 Analytics│  Filter: [ All ▼ ] [ Active ▼ ] [ Professional ▼ ]  🔍 Search  │
│ 📚 CMS   │                                                                 │
│ 🤖 AI Ops│  ┌──────────────────────────────────────────────────────────────┐ │
│ 💳 Billing│  │ Tenant          Type         Students  AI Budget  Status     │ │
│ 🎫 Support│  │ ──────────────  ───────────  ────────  ─────────  ────────  │ │
│ 📋 Audit │  │ DPS Pune          White-label  4,200    78%       ● Active  │ │
│ ⚙ System │  │ Ryan Int'l Mumbai White-label  8,100    92% ⚠     ● Active  │ │
│          │  │ EduAI Demo        Platform     150      12%       ● Active  │ │
│          │  │ St. Mary's BLR    White-label  0        —         ○ Pending │ │
│          │  └──────────────────────────────────────────────────────────────┘ │
│          │  Showing 1-4 of 12 tenants          [ < ] Page 1 of 3 [ > ]     │
│          │                                                                 │
│          │  ┌─ SELECTED: DPS Pune ─────────────────────────────────────────┐ │
│          │  │  Domain: learn.dpspune.edu.in                                │ │
│          │  │  Plan: Professional · 5,000 max students                     │ │
│          │  │  [ Branding ] [ Users ] [ Feature Flags ] [ Suspend ]      │ │
│          │  └─────────────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

### 5.2 Tenant Branding Configuration (Web)

White-label customization panel.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Tenants › DPS Pune › Branding Configuration                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─ PREVIEW ─────────────────────┐  ┌─ SETTINGS ──────────────────────────┐ │
│  │  ┌─────────────────────────┐  │  │  App Name: [ DPS Learn           ]  │ │
│  │  │ [Logo] DPS Learn        │  │  │  Support Email: [ help@dpspune.in]  │ │
│  │  │                         │  │  │                                     │ │
│  │  │  ┌───────────────────┐  │  │  │  Logo: [ Upload ] logo.svg ✓       │ │
│  │  │  │  Dashboard Preview│  │  │  │  Favicon: [ Upload ] favicon.ico   │ │
│  │  │  │  (live preview)   │  │  │  │                                     │ │
│  │  │  └───────────────────┘  │  │  │  Primary Color:   [#6366F1] 🎨     │ │
│  │  └─────────────────────────┘  │  │  Secondary Color: [#F1F5F9] 🎨     │ │
│  │  [ Light ] [ Dark ]           │  │                                     │ │
│  └─────────────────────────────────┘  │  Custom Domain:                    │ │
│                                       │  [ learn.dpspune.edu.in        ]   │ │
│                                       │  DNS Status: ✓ Verified            │ │
│                                       │                                     │ │
│                                       │  [ Save Changes ]  [ Reset ]        │ │
│                                       └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.3 School Admin — ERP Dashboard (Web)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ School Admin · Delhi Public School Pune                                     │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  ERP Overview                                                    │
│ 🏠 Dashboard│  ─────────────────────────────────────────────────────────────── │
│ 👥 Users │                                                                 │
│ 📋 Enroll│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│ 🏫 Classes│  │ Enrollment │ │ Attendance │ │ Fee Coll.  │ │ Announce.  │   │
│ 📊 ERP   │  │ 1,180      │ │ 91% today  │ │ ₹12.4L/mo  │ │ 3 active   │   │
│ 📈 Reports│  │ students   │ │ present    │ │ collected  │ │            │   │
│ ⚙ Settings│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│          │                                                                 │
│          │  TODAY'S ATTENDANCE SUMMARY                                       │
│          │  ┌─────────────────────────────────────────────────────────────┐ │
│          │  │ Class    Present  Absent  Late   Status                       │ │
│          │  │ 6-A      30/32    2       0      ✓ Submitted                  │ │
│          │  │ 7-B      27/28    1       0      ✓ Submitted                  │ │
│          │  │ 8-A      —        —       —      ⏳ Pending (Mr. Sharma)       │ │
│          │  └─────────────────────────────────────────────────────────────┘ │
│          │                                                                 │
│          │  FEE COLLECTION (June 2025)                                       │
│          │  |████████████████░░░░| 78% · ₹12.4L / ₹15.9L target             │
│          │  [ View Defaulters ]  [ Send Reminders ]                          │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## 6. Mobile App

### 6.1 Mobile Home — Student (Class 8–10)

Primary entry point; optimized for thumb reach and quick actions.

```
┌──────────────────────────────┐
│ ☰  EduAI           🔔(2)  [Av]│
├──────────────────────────────┤
│                              │
│  🔥 7-day streak!            │
│  Keep learning to maintain   │
│                              │
│  ┌─ PICK UP WHERE YOU LEFT ─┐│
│  │ ▶ Quadratic Equations    ││
│  │   Math · 62% complete    ││
│  │   [ Continue → ]         ││
│  └──────────────────────────┘│
│                              │
│  TODAY                       │
│  ┌──────────────────────────┐│
│  │ 📝 Physics HW · Due 6pm  ││
│  │ 🧪 Mock Test · Fri 9am   ││
│  └──────────────────────────┘│
│                              │
│  EXPLORE                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │  📚  │ │  ✨  │ │  🧠  │ │
│  │Learn │ │ AI   │ │ Brain│ │
│  └──────┘ └──────┘ └──────┘ │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │  📝  │ │  🏆  │ │  📥  │ │
│  │Tests │ │Rewards│ │Offline│ │
│  └──────┘ └──────┘ └──────┘ │
│                              │
├──────────────────────────────┤
│  🏠    📚    ✨    📝    🏆  │
│ Home  Learn   AI   Tests Rew │
└──────────────────────────────┘
```

---

### 6.2 Mobile Home — Parent

```
┌──────────────────────────────┐
│ Parent Portal        🔔  [Av]│
├──────────────────────────────┤
│ Good evening, Meera          │
│                              │
│ ┌─ ARJUN · Class 5 ─────────┐│
│ │ 🔥 7 streak · Active 2h ago││
│ │ Math 78% · ⚠ HW due tmrw  ││
│ │ [ View → ]                 ││
│ └────────────────────────────┘│
│                              │
│ ┌─ KAVYA · Class 8 ─────────┐│
│ │ 🔥 3 streak · Active today ││
│ │ Math 82% · ✓ On track     ││
│ │ [ View → ]                 ││
│ └────────────────────────────┘│
│                              │
│ WEEKLY REPORT                │
│ ┌──────────────────────────┐│
│ │ "Arjun improved in       ││
│ │  fractions this week..." ││
│ │ [ Read Full Report ]     ││
│ └──────────────────────────┘│
│                              │
│ QUICK ACTIONS                │
│ [ 💬 Message Teacher ]       │
│ [ ⚙ Screen Time ]            │
│ [ 💳 Billing ]               │
│                              │
├──────────────────────────────┤
│  🏠    👨‍👩‍👧    📊    ⚙        │
│ Home  Kids  Reports Settings │
└──────────────────────────────┘
```

---

### 6.3 Mobile AI Tutor (Full Screen)

```
┌──────────────────────────────┐
│ ← AI Tutor          ⋮  47/50 │
├──────────────────────────────┤
│ 📚 Math › Fractions › Ch.4  │
├──────────────────────────────┤
│                              │
│  🤖 Hi! What can I help      │
│     you with today?          │
│                              │
│              ┌─────────────┐ │
│              │ What is 1/2 │ │
│              │ + 1/4?      │ │
│              └─────────────┘ │
│                              │
│  🤖 To add fractions, we    │
│     need a common            │
│     denominator...           │
│                              │
│     📎 Fractions — Intro     │
│                              │
│  [ 👍 ] [ 👎 ] [ 🔊 ]        │
│                              │
├──────────────────────────────┤
│ [What is numerator?] [Hint]  │
├──────────────────────────────┤
│ ┌────────────────────┐ [ ➤ ] │
│ │ Ask a question...  │      │
│ └────────────────────┘       │
│  🎤        📷                │
└──────────────────────────────┘
```

---

### 6.4 Mobile Offline Downloads

```
┌──────────────────────────────┐
│ ← Offline Downloads          │
├──────────────────────────────┤
│ Storage: 1.2 GB / 5 GB used  │
│ |████████░░░░░░░░░░░░░░░░|   │
├──────────────────────────────┤
│                              │
│ DOWNLOADED (4)               │
│ ┌──────────────────────────┐│
│ │ ▶ Fractions — Intro      ││
│ │   245 MB · Math · ✓ Ready││
│ │   [ Play ]  [ Delete ]   ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ ▶ Photosynthesis         ││
│ │   312 MB · Science       ││
│ │   [ Play ]  [ Delete ]   ││
│ └──────────────────────────┘│
│                              │
│ DOWNLOADING (1)              │
│ ┌──────────────────────────┐│
│ │ ↓ Algebra Ch. 3          ││
│ │   |██████████░░| 78%     ││
│ └──────────────────────────┘│
│                              │
│ [ Browse Lessons to Download]│
└──────────────────────────────┘
```

---

## 7. Shared Components (Cross-Portal)

### 7.1 Notification Panel (Slide-over)

```
                    ┌─────────────────────────┐
                    │ Notifications      [ ✕ ]│
                    ├─────────────────────────┤
                    │ [ All ] [ Unread (3) ]  │
                    ├─────────────────────────┤
                    │ ● Homework due tomorrow │
                    │   Algebra WS · 2h ago   │
                    │                         │
                    │ ● New badge earned!     │
                    │   Math Whiz · Yesterday │
                    │                         │
                    │ ○ Mock test scheduled   │
                    │   Science · 25 Jun      │
                    │                         │
                    │ ( Mark all as read )    │
                    └─────────────────────────┘
```

### 7.2 Command Palette (⌘K)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Search commands, pages, content...                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  RECENT                                                                     │
│  → Continue: Fractions — Introduction                                       │
│  → AI Tutor                                                                 │
│                                                                             │
│  PAGES                                                                      │
│  → Mock Tests                                                               │
│  → Leaderboard                                                              │
│  → Settings                                                                 │
│                                                                             │
│  CONTENT                                                                    │
│  → "Quadratic equations" — 12 results                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Adaptation |
|------------|-------|-------------------|
| Mobile | < 640px | Bottom nav, single column, stacked cards |
| Tablet | 640–1024px | Collapsible sidebar, 2-column grids |
| Desktop | > 1024px | Persistent sidebar, 3-column dashboards |
| Wide | > 1440px | Max-width container (1280px), centered |

---

## 9. Wireframe → Figma Handoff Notes

1. All wireframes map to Figma pages listed in [Figma Structure](./figma-structure.md).
2. Glass morphism treatment applied in high-fidelity only — wireframes use flat regions.
3. Hindi/Marathi strings shown in wireframes indicate i18n layout testing requirements (text expansion ~30% for Hindi).
4. Age band variants share wireframe structure; Figma component variants handle density differences.

---

*Related: [Information Architecture](./information-architecture.md) · [Figma Structure](./figma-structure.md) · [Design System](./design-system.md)*
