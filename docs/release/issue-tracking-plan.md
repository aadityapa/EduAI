# Beta Issue Tracking Plan

---

## Tooling

- **Engineering:** GitHub Issues + labels
- **Customer-facing:** CRM tickets (billing-service CRM module) or Linear
- **Incidents:** PagerDuty (P1) + `#beta-war-room` Slack

---

## Label Taxonomy

| Label | Use |
|-------|-----|
| `beta/pilot` | Reported by pilot school |
| `beta/blocker` | Prevents school daily use |
| `beta/content` | Curriculum accuracy/language |
| `beta/mobile` | iOS/Android specific |
| `beta/ai` | Tutor safety or quality |
| `beta/billing` | Payments/subscriptions |

---

## SLA (Beta)

| Label | Triage | Fix Target |
|-------|--------|------------|
| blocker | 2 hours | 24–48 hours |
| pilot (normal) | 24 hours | Next sprint |
| content | 48 hours | Content ops queue |

---

## Weekly Ritual

- **Monday:** Triage new issues; assign owners
- **Wednesday:** Pilot school sync — top 3 issues
- **Friday:** Beta metrics review (DAU, crash rate, NPS)

---

## Metrics Dashboard

Track in Grafana + CRM:
- Open beta issues by severity
- Mean time to resolve
- Issues per school
- Reopened rate
