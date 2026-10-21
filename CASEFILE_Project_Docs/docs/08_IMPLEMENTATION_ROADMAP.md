# CASEFILE — Implementation Roadmap

## Phase 0 — Documentation
- PRD
- architecture
- schema
- API contract
- case content guide
- security plan
- test plan

**Exit condition:** requirements frozen for MVP.

## Phase 1 — Project Foundation
- initialize Git repository,
- initialize Vite client,
- initialize Express server,
- configure MongoDB,
- configure environment variables,
- configure linting/formatting,
- create API health endpoint.

## Phase 2 — Authentication
- User model,
- registration,
- login,
- logout,
- protected routes,
- role middleware.

## Phase 3 — Case Engine
- Case model,
- Evidence,
- Persons,
- Timeline,
- Sources,
- case listing/detail APIs,
- admin CRUD.

## Phase 4 — Investigation Engine
- Investigation model,
- start/resume investigation,
- evidence discovery,
- progress persistence.

## Phase 5 — Evidence Board
- React Flow,
- nodes,
- edges,
- connection labels,
- autosave,
- restore board.

## Phase 6 — Conclusion & Scoring
- conclusion form,
- server-side scoring,
- score breakdown,
- completion state.

## Phase 7 — Gamification
- achievements,
- profile stats,
- investigation history,
- leaderboard.

## Phase 8 — Content
- build/test 4 fictional cases,
- research and safely build 6 historical cases,
- source every factual claim.

## Phase 9 — Testing & Hardening
- API tests,
- UI tests,
- security checks,
- responsive testing,
- performance checks,
- error handling.

## Phase 10 — Deployment
- frontend deployment,
- backend deployment,
- MongoDB Atlas,
- environment configuration,
- production smoke test.

---

## Recommended Build Order

Do not build all pages first.

Build one complete vertical slice:

```text
Login
 -> Case
 -> Investigation
 -> Evidence
 -> Board
 -> Conclusion
 -> Score
 -> History
```

Once this works end-to-end, expand the feature set.

This reduces the risk of having a visually complete frontend with an unfinished backend.
