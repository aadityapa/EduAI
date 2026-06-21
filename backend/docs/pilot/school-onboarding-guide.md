# School Onboarding Guide — Pilot Program

**Audience:** School administrators, IT coordinators  
**Duration:** 2–3 weeks to go-live

---

## Prerequisites

- Signed pilot agreement
- Primary contact: School Admin + IT lead
- Minimum: 50 students, 5 teachers
- Internet: 10 Mbps+ recommended

---

## Week 1: Setup

| Day | Task | Owner |
|-----|------|-------|
| 1 | Create tenant in admin CRM | EduAI CS |
| 1 | Configure subdomain (`school.eduai.in`) | EduAI DevOps |
| 2 | Import student/teacher roster (CSV) | School IT |
| 3 | Assign classes and subjects | School Admin |
| 4 | White-label branding (logo, colors) | School Admin |
| 5 | Test login for 3 users per role | Both |

### CSV Template

```
email,first_name,last_name,role,class_id
student1@school.edu,Arjun,Sharma,student,8A
teacher1@school.edu,Priya,Patel,teacher,
```

---

## Week 2: Training

- Schedule 2× 90-min sessions (see `teacher-training.md`, `parent-orientation.md`)
- Enable parent accounts linked to students
- Configure fee module if ERP enabled

---

## Week 3: Go-Live

- [ ] All teachers completed training quiz
- [ ] 80%+ students logged in once
- [ ] Support channel active (WhatsApp/email)
- [ ] Daily check-in for first 5 school days

---

## Support Escalation

1. L1: School IT → EduAI helpdesk (support@eduai.in)
2. L2: Customer Success Manager (<4h response)
3. L3: Engineering on-call (P1 outages)

See `docs/pilot/support-sop.md` for full SOP.
