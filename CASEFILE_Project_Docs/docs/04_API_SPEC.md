# CASEFILE — REST API Specification

Base URL:

```text
/api/v1
```

## Authentication

### POST `/auth/register`
Create account.

### POST `/auth/login`
Authenticate.

### POST `/auth/logout`
End session.

### GET `/auth/me`
Return current authenticated user.

---

## Cases

### GET `/cases`
Query:
- category
- difficulty
- search
- page
- limit

### GET `/cases/:caseId`
Return public case information.

### GET `/cases/:caseId/evidence`
Return discoverable evidence metadata.

### GET `/cases/:caseId/timeline`
Return timeline.

### GET `/cases/:caseId/persons`
Return case persons.

### GET `/cases/:caseId/statements`
Return witness statements.

### GET `/cases/:caseId/sources`
Return public source list.

---

## Investigations

### POST `/cases/:caseId/investigations`
Start an investigation.

### GET `/investigations/:investigationId`
Get current investigation.

### PATCH `/investigations/:investigationId`
Update investigation progress.

### POST `/investigations/:investigationId/discoveries`
Record evidence discovery.

### PUT `/investigations/:investigationId/board`
Save board state.

### POST `/investigations/:investigationId/hypotheses`
Create hypothesis.

### PATCH `/investigations/:investigationId/hypotheses/:hypothesisId`
Update hypothesis.

### POST `/investigations/:investigationId/conclusion`
Submit conclusion.

Server calculates final score.

---

## User

### GET `/users/me`
Profile.

### PATCH `/users/me`
Allowed profile settings.

### GET `/users/me/history`
Investigation history.

### GET `/users/me/achievements`
Achievements.

### GET `/users/me/stats`
Statistics.

---

## Leaderboard

### GET `/leaderboard`
Query:
- page
- limit
- period

Only users with leaderboard visibility enabled should be publicly displayed.

---

## Admin

All require authenticated ADMIN role.

### POST `/admin/cases`
Create case.

### PATCH `/admin/cases/:caseId`
Update case.

### POST `/admin/cases/:caseId/publish`
Publish case.

### POST `/admin/cases/:caseId/evidence`
Create evidence.

### PATCH `/admin/evidence/:evidenceId`
Update evidence.

### POST `/admin/cases/:caseId/persons`
Create person.

### POST `/admin/cases/:caseId/timeline`
Create timeline event.

### POST `/admin/cases/:caseId/sources`
Create source.

### PATCH `/admin/cases/:caseId/solution`
Update solution criteria.

---

## Standard Status Codes

- 200 — success
- 201 — created
- 400 — validation error
- 401 — unauthenticated
- 403 — unauthorized
- 404 — not found
- 409 — conflict
- 429 — rate limit
- 500 — unexpected server error
