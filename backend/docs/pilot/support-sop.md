# Pilot Support SOP — EduAI

**Hours:** Mon–Sat 8:00–20:00 IST (beta)  
**Channels:** support@eduai.in, WhatsApp Business, in-app help

---

## Ticket Classification

| Priority | Definition | Response | Resolution |
|----------|------------|----------|------------|
| P1 | Platform down, login broken for school | 30 min | 4 hours |
| P2 | Feature broken (fees, quizzes) | 2 hours | 24 hours |
| P3 | How-to, content issue | 8 hours | 3 days |
| P4 | Feature request | 48 hours | Backlog |

---

## L1 Playbook

1. Verify tenant ID and user role
2. Check status page / Grafana dashboards
3. Common fixes:
   - Password reset via admin
   - Clear app cache (mobile)
   - Verify `X-Tenant-Id` header on API calls

---

## Escalation

```
L1 Support → CSM → Engineering On-Call → Platform Lead
```

Log all tickets in CRM with: tenant, user role, steps to reproduce, screenshots.

---

## Pilot Feedback Loop

- Weekly sync with school admin (30 min)
- Bi-weekly product review of top 5 issues
- End-of-pilot NPS survey
