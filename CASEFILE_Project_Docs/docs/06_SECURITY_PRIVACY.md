# CASEFILE — Security, Privacy & Safety Baseline

## Authentication
- Hash passwords.
- Never store plaintext passwords.
- Use secure cookies/session strategy or short-lived access tokens.
- Rotate secrets when compromised.
- Do not expose auth tokens in logs.

## Authorization
Roles:
- USER
- ADMIN

Every admin endpoint must verify role server-side.

## Input Validation
Validate:
- email,
- username,
- IDs,
- query parameters,
- evidence-board nodes/edges,
- conclusion payloads,
- admin case content.

Reject unexpected fields where practical.

## XSS Protection
Case content may contain rich text. Sanitize HTML before rendering.

Do not render raw user-supplied HTML.

## Rate Limiting
Apply stronger limits to:
- login,
- registration,
- password workflows,
- conclusion submission,
- public search if needed.

## CORS
Production frontend origin must be explicitly configured.

## Database
- least-privilege database credentials,
- backups,
- no database credentials in source control.

## File Uploads
If later implemented:
- allowlist file types,
- enforce size limits,
- scan uploads,
- store outside application source,
- generate safe filenames,
- never execute uploaded files.

## Privacy
Store only information necessary for the application.

Provide a way to hide a user from the leaderboard.

## Real Cases
Historical-case content should not expose unnecessary private information about living individuals.

## Content Moderation
Admin review is required before publication of real cases.

## Logging
Log security-relevant events without logging secrets or sensitive content.

## Environment Variables

Example:

```text
NODE_ENV=
PORT=
MONGODB_URI=
AUTH_SECRET=
FRONTEND_URL=
```

Use `.env.example`, never commit `.env`.
