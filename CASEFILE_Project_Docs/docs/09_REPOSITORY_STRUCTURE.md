# CASEFILE — Repository Structure

```text
casefile/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   └── package.json
│
├── docs/
│   ├── 01_PRD.md
│   ├── 02_SYSTEM_ARCHITECTURE.md
│   ├── 03_DATABASE_SCHEMA.md
│   ├── 04_API_SPEC.md
│   ├── 05_CASE_CONTENT_GUIDE.md
│   ├── 06_SECURITY_PRIVACY.md
│   ├── 07_TEST_PLAN.md
│   ├── 08_IMPLEMENTATION_ROADMAP.md
│   └── 09_REPOSITORY_STRUCTURE.md
│
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

---

## Root Scripts

Suggested:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix client\" \"npm run dev --prefix server\"",
    "client": "npm run dev --prefix client",
    "server": "npm run dev --prefix server"
  }
}
```

Keep client and server independently runnable.
