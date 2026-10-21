# CASEFILE — Digital Crime Scene

CASEFILE is a MERN-based interactive crime and mystery investigation platform. Its core experience is a persistent, interactive Evidence Board backed by server-authoritative detective scoring.

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local installation or MongoDB Atlas connection string)

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `server/.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Set `AUTH_SECRET` to a secure random string (at least 32 bytes)
   - Set `FRONTEND_URL` to your frontend URL (default: http://localhost:5173)

4. Start the application:
   ```bash
   # From root directory
   npm run dev
   ```
   Or run separately:
   ```bash
   npm run server  # Terminal 1
   npm run client  # Terminal 2
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/api/v1/health

### Environment Variables

#### Server (`server/.env`)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/casefile
AUTH_SECRET=your-secret-key-at-least-32-bytes
SESSION_MAX_AGE=86400000
FRONTEND_URL=http://localhost:5173
```

### Available Scripts

```bash
# Development
npm run dev          # Run both client and server
npm run server       # Run server only
npm run client       # Run client only

# Code Quality
npm run lint         # Lint both client and server
npm run format       # Format both client and server

# Testing
cd server && npm test  # Run server tests
```

## Documentation

Full documentation is available in the `CASEFILE_Project_Docs/docs/` directory:

- `docs/01_PRD.md` — product requirements
- `docs/02_SYSTEM_ARCHITECTURE.md` — system architecture
- `docs/03_DATABASE_SCHEMA.md` — database design
- `docs/04_API_SPEC.md` — REST API outline
- `docs/05_CASE_CONTENT_GUIDE.md` — case content requirements
- `docs/06_SECURITY_PRIVACY.md` — security and privacy baseline
- `docs/07_TEST_PLAN.md` — test plan
- `docs/08_IMPLEMENTATION_ROADMAP.md` — implementation phases
- `docs/09_REPOSITORY_STRUCTURE.md` — repository layout
- `docs/10_MVP_BACKLOG.md` — MVP backlog
- `docs/00_PROJECT_STATUS_AND_HANDOFF.md` — status and starting instructions
- `docs/11_DECISION_LOG.md` — decisions and approvals
- `docs/12_SCORING_CONTRACT.md` — scoring contract
- `docs/13_ACCEPTANCE_CRITERIA.md` — acceptance criteria

## Implementation Status

- ✅ Phase 1: Project Foundation (Complete)
- ✅ Phase 2: Authentication (In Progress)
- ⏳ Phase 3: Case Management (Pending)
- ⏳ Phase 4: Investigation & Evidence Discovery (Pending)
- ⏳ Phase 5: Evidence Board (Pending)
- ⏳ Phase 6: Conclusions & Scoring (Pending)
- ⏳ Phase 7: History & Profile (Pending)
- ⏳ Phase 8: Testing & Acceptance (Pending)

## Important

These files describe the intended product and planned behavior. Implementation status is updated only when supported by repository inspection or test evidence.
