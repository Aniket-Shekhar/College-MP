# CASEFILE — System Architecture

## 1. Architecture

```text
React + Vite + Tailwind
        |
        | HTTPS / JSON REST API
        v
Node.js + Express
        |
        +---- Authentication / Authorization
        +---- Case Service
        +---- Investigation Service
        +---- Scoring Service
        +---- Achievement Service
        +---- Admin Service
        |
        v
MongoDB + Mongoose
```

Optional production services:
- object storage for safe document assets,
- CDN,
- logging/monitoring,
- email provider for account workflows.

Keep the first version modular but not over-engineered.

---

## 2. Frontend Architecture

Suggested stack:
- React
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form + Zod
- React Flow for Evidence Board
- Zustand only if global client state is needed

Suggested structure:

```text
client/
  src/
    app/
      router.jsx
      providers.jsx
    components/
      ui/
      layout/
      case/
      evidence/
      board/
      timeline/
    pages/
      Home/
      Cases/
      CaseDetails/
      Investigation/
      Profile/
      History/
      Leaderboard/
      Admin/
    features/
      auth/
      cases/
      investigation/
      evidenceBoard/
      achievements/
    lib/
      api.js
      validators.js
      constants.js
    hooks/
    styles/
    main.jsx
```

---

## 3. Backend Architecture

```text
server/
  src/
    config/
    middleware/
    modules/
      auth/
      users/
      cases/
      investigations/
      evidence/
      scoring/
      achievements/
      leaderboard/
      admin/
    models/
    routes/
    services/
    validators/
    utils/
    app.js
    server.js
```

Recommended separation:

- Routes: HTTP wiring.
- Controllers: request/response handling.
- Services: business logic.
- Models: database schema.
- Validators: request validation.
- Middleware: authentication, authorization, errors.
- Utils: small reusable functions.

---

## 4. Request Flow

```text
Browser
  -> Route
  -> Auth Middleware
  -> Validation
  -> Controller
  -> Service
  -> Mongoose Model
  -> MongoDB
  -> Service
  -> Controller
  -> JSON Response
```

Business rules such as scoring should never live only in React.

---

## 5. Authentication

Recommended approach:
- short-lived access token,
- secure HTTP-only refresh/session mechanism,
- password hashing,
- role claim validated server-side.

For a college MVP, JWT can be used, but avoid storing long-lived sensitive tokens in localStorage.

---

## 6. Error Contract

All API errors should use a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "CASE_NOT_FOUND",
    "message": "Case was not found."
  }
}
```

Success:

```json
{
  "success": true,
  "data": {}
}
```

---

## 7. Deployment

Suggested:
- Frontend: Vercel/Netlify or equivalent.
- Backend: Render/Railway/Fly.io or equivalent.
- Database: MongoDB Atlas.

Use environment variables for:
- MongoDB URI
- authentication secrets
- frontend origin
- server port
- optional storage configuration

Never commit `.env`.
