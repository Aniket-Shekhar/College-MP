# CASEFILE — Product Requirements Document (PRD)

**Project type:** College Mini Project  
**Product:** CASEFILE — Collaborative Mystery Investigation Platform  
**Stack:** React + Vite + Tailwind CSS / Node.js + Express / MongoDB + Mongoose  
**Initial content:** 10 cases — 6 documented historical cases + 4 fictional cases  
**Document status:** Baseline v1.0

---

## 1. Product Vision

CASEFILE is an interactive web platform where users investigate mystery and crime cases by examining evidence, timelines, witness statements, suspects, documents, and locations.

The experience should feel like a digital detective investigation rather than a conventional CRUD application.

The core interaction is an **Evidence Board**. Users collect evidence, connect clues, form hypotheses, and submit a final conclusion. The platform evaluates the investigation using a transparent detective-score system based on evidence discovery, conclusion accuracy, and reasoning quality.

---

## 2. Problem Statement

Typical college CRUD applications demonstrate database operations but provide limited interaction and weak product identity.

CASEFILE solves this by combining:
- structured case data,
- investigative exploration,
- graph-like evidence relationships,
- interactive timelines,
- reasoning,
- scoring,
- achievements,
- investigation history,
- and a leaderboard.

The system must remain practical enough to build and demonstrate as a MERN mini-project.

---

## 3. Goals

### Primary goals
1. Provide a complete end-to-end investigation experience.
2. Support both historical/documented and fictional cases.
3. Make evidence discovery and relationships central to gameplay.
4. Allow users to submit a conclusion.
5. Calculate a repeatable detective score.
6. Track user progress and investigation history.
7. Provide achievements and leaderboard functionality.
8. Maintain a clean MERN architecture suitable for a college project.
9. Handle historical-case information responsibly.
10. Be deployable and demonstrable.

### Non-goals for v1
- Real police or law-enforcement integration.
- Real-time multiplayer investigation.
- Payments/subscriptions.
- AI-generated criminal accusations.
- Facial recognition.
- Predictive crime analytics.
- Uploading arbitrary private/personally identifying evidence.
- Legal advice or real-world investigative assistance.

---

## 4. Target Users

### 4.1 Student / Casual Investigator
Wants an engaging mystery experience and can complete a case in one sitting.

### 4.2 Competitive Investigator
Wants high scores, achievements, completion statistics, and leaderboard placement.

### 4.3 Educator / Demonstrator
Wants a controlled application that demonstrates frontend, backend, database, authentication, APIs, state management, graph interaction, and analytics.

### 4.4 Content/Admin User
Creates and manages case content, evidence, suspects, timelines, sources, and fictional scenarios.

---

## 5. Core User Journey

1. Visitor opens CASEFILE.
2. Visitor sees featured cases and categories.
3. User creates an account or logs in.
4. User selects a case.
5. User reads the case briefing.
6. User explores:
   - evidence,
   - suspects,
   - witness statements,
   - timeline,
   - documents,
   - locations,
   - source references.
7. User discovers evidence and adds useful items to the Evidence Board.
8. User creates connections between evidence items.
9. User writes hypotheses/reasoning.
10. User submits a conclusion.
11. Backend evaluates the conclusion.
12. User receives:
   - score,
   - evidence-discovery result,
   - reasoning result,
   - conclusion result,
   - missed evidence,
   - achievements earned.
13. Investigation is stored in history.
14. User can replay the case subject to case-specific rules.
15. Profile statistics update.
16. Leaderboard updates where applicable.

---

## 6. Case Categories

Each case has:
- `REAL_SOLVED`
- `REAL_UNSOLVED`
- `FICTIONAL`

Difficulty:
- `EASY`
- `MEDIUM`
- `HARD`
- `EXPERT`

Real cases must contain a source record and an editorial note explaining that the case is presented for educational/interactive purposes.

---

## 7. Functional Requirements

### FR-01 — Authentication
The system shall support:
- registration,
- login,
- logout,
- protected routes,
- password hashing,
- session/token authentication,
- profile retrieval.

### FR-02 — Case Discovery
Users shall be able to:
- view all available cases,
- filter by category,
- filter by difficulty,
- search by title/keyword,
- view solved/unsolved/fictional labels,
- open a case detail page.

### FR-03 — Case Briefing
Each case shall display:
- title,
- short summary,
- difficulty,
- category,
- estimated investigation time,
- briefing,
- content warning where appropriate,
- historical/source note where applicable.

### FR-04 — Evidence
Users shall be able to:
- inspect evidence,
- view evidence metadata,
- discover hidden/secondary evidence,
- bookmark evidence,
- add evidence to their investigation board.

### FR-05 — Suspects / Persons of Interest
Users shall be able to inspect case-specific persons of interest.

The UI must avoid presenting fictional accusations as real facts.

For real historical cases, wording must accurately reflect documented status, e.g. "person of interest", "suspect", "convicted", or "investigative theory" only where supported by the source material.

### FR-06 — Witness Statements
Statements shall include:
- speaker,
- statement text,
- timestamp/date when relevant,
- reliability/context note where authored by the content team,
- links to related evidence.

### FR-07 — Timeline
Users shall see chronological case events.

Timeline events may link to:
- evidence,
- persons,
- locations,
- documents.

### FR-08 — Documents
Users can inspect case documents represented as:
- text excerpts,
- document metadata,
- safe public-domain/publicly available material,
- fictional documents.

Do not upload private records.

### FR-09 — Locations
Locations can be represented with:
- name,
- description,
- approximate location,
- relationship to events.

Real cases should avoid unnecessary exact private addresses.

### FR-10 — Evidence Board
The Evidence Board is the signature feature.

Users shall be able to:
- add evidence cards,
- move cards,
- create connections,
- label connections,
- remove connections,
- group related evidence,
- add notes,
- save board state.

Suggested connection types:
- `SUPPORTS`
- `CONTRADICTS`
- `CAUSES`
- `RELATED_TO`
- `SAME_TIME`
- `SAME_PERSON`
- `SAME_LOCATION`

### FR-11 — Hypotheses
Users shall be able to create a hypothesis containing:
- title,
- explanation,
- supporting evidence,
- contradictory evidence,
- confidence indicator.

The confidence indicator is an investigation-game mechanic and must not be presented as a real-world probability.

### FR-12 — Conclusion
A case conclusion may include:
- selected answer/person/event,
- explanation,
- supporting evidence,
- optional timeline theory.

The server must evaluate the submission rather than trusting a client-provided score.

### FR-13 — Detective Score
Score components:
- Evidence Discovery: 40 points
- Conclusion Accuracy: 35 points
- Reasoning / Evidence Links: 25 points

Total: 100.

The exact scoring implementation must be deterministic and stored with the completed investigation.

### FR-14 — Investigation History
The user can see:
- cases started,
- cases completed,
- completion time,
- score,
- evidence discovered,
- conclusion result,
- achievements.

### FR-15 — Profile
Profile contains:
- display name,
- avatar,
- total investigations,
- completed cases,
- average score,
- highest score,
- achievements,
- recent investigations.

Avoid exposing unnecessary personal information.

### FR-16 — Achievements
Initial achievement examples:
- First Case
- Evidence Collector
- Perfect Investigation
- Timeline Master
- Connecting the Dots
- Case Closed
- Persistent Investigator

### FR-17 — Leaderboard
Leaderboard can show:
- display name,
- total score,
- cases completed,
- average score.

Privacy settings should allow a user to hide their profile from public leaderboard display.

### FR-18 — Admin / Content Management
Admin users can:
- create cases,
- edit cases,
- publish/unpublish cases,
- create evidence,
- create suspects/persons,
- create timeline events,
- add source references,
- define solution criteria,
- manage achievements.

Admin APIs must be protected by role-based authorization.

---

## 8. Evidence-Board Requirements

The board should be treated as an investigation workspace rather than merely a database relationship editor.

### Evidence card
Each card can contain:
- evidence ID,
- title,
- type,
- short description,
- discovery state,
- importance indicator,
- source/reference.

### Connection
Each connection contains:
- source evidence ID,
- target evidence ID,
- relationship type,
- optional user note.

### Persistence
Board state should be autosaved with debouncing.

The backend remains authoritative.

### MVP interaction
For a mini project, React Flow (or an equivalent graph library) is recommended.

---

## 9. Scoring Specification

Recommended formula:

### Evidence score
`evidenceScore = discoveredWeightedPoints / availableWeightedPoints * 40`

### Conclusion score
`conclusionScore = correctConclusion ? 35 : partialConclusionPoints`

### Reasoning score
Based on:
- correct supporting links,
- relevant evidence used,
- useful contradiction recognition,
- minimum explanation quality.

`reasoningScore = reasoningPoints / maxReasoningPoints * 25`

### Final
`finalScore = round(evidenceScore + conclusionScore + reasoningScore)`

Rules:
- server calculates score,
- client never submits the final score,
- score calculation version is stored,
- score can be recalculated during development,
- published case scoring rules should be versioned.

---

## 10. Real-Case Editorial Rules

For the six historical cases:
1. Use reliable public sources.
2. Record source URLs and publication/organization details.
3. Separate established facts from unresolved claims.
4. Do not invent evidence.
5. Do not imply guilt where it was not legally established.
6. Avoid unnecessary private information.
7. Avoid publishing sensitive personal data.
8. Clearly label dramatized/gameplay content.
9. Maintain a source list for every factual case section.
10. Include a disclaimer that the platform is an educational interactive project.

---

## 11. Fictional-Case Rules

Fictional cases should:
- be original or properly licensed,
- contain clearly fictional names/identities,
- have internally consistent evidence,
- have a solvable logic chain,
- include at least one misleading clue,
- include enough evidence to support the intended conclusion,
- never intentionally imitate a real victim's private circumstances.

---

## 12. Non-Functional Requirements

### Performance
- Case list should load quickly under normal college-demo traffic.
- API responses should generally target <500 ms under normal local/deployed conditions.
- Evidence Board interactions should remain responsive.

### Security
- Passwords hashed with a modern password-hashing library.
- JWT/session secrets stored in environment variables.
- Input validation on all write endpoints.
- Authorization on protected endpoints.
- Rate limiting on authentication endpoints.
- HTTP security headers.
- CORS restricted to known frontend origin in production.
- No secrets in Git.

### Reliability
- API errors return consistent JSON.
- Database validation is enforced.
- Critical actions are logged.
- Investigation progress should not silently disappear.

### Accessibility
- Keyboard-accessible controls where practical.
- Adequate contrast.
- Visible focus states.
- Descriptive buttons and labels.
- Evidence Board should have a non-drag fallback for essential information.

### Responsive design
Target:
- desktop,
- tablet,
- mobile.

The Evidence Board may provide a simplified mobile layout.

---

## 13. Suggested Pages

### Public
- `/`
- `/cases`
- `/cases/:slug`
- `/leaderboard`
- `/about`

### Authenticated
- `/investigate/:caseId`
- `/investigate/:caseId/board`
- `/profile`
- `/history`
- `/achievements`

### Admin
- `/admin`
- `/admin/cases`
- `/admin/cases/new`
- `/admin/cases/:id/edit`
- `/admin/cases/:id/evidence`
- `/admin/cases/:id/solution`

---

## 14. MVP Scope

The first fully functional milestone should contain:
1. Authentication.
2. Case listing.
3. Case details.
4. One complete fictional case.
5. Evidence discovery.
6. Timeline.
7. Suspects/persons.
8. Evidence Board.
9. Conclusion submission.
10. Server-side scoring.
11. Investigation history.
12. Basic profile.
13. Basic achievements.
14. Seeded database.
15. Admin case management.

After this works end-to-end, add the remaining nine cases and advanced polish.

---

## 15. Success Criteria

The mini project is considered functionally complete when:
- a new user can register,
- select a case,
- investigate it,
- discover evidence,
- build an Evidence Board,
- submit a conclusion,
- receive a deterministic score,
- see the completed investigation in history,
- earn achievements,
- see profile statistics,
- and an admin can manage case content.

---

## 16. Demo Scenario

A good college demonstration should show:

1. Landing page.
2. Case filtering.
3. Open a fictional case.
4. Explore evidence and timeline.
5. Add evidence to board.
6. Connect three or more clues.
7. Create a hypothesis.
8. Submit conclusion.
9. Show score breakdown.
10. Show achievement unlock.
11. Open profile/history.
12. Show admin case-management screen.

---

## 17. Future Enhancements

Possible post-MVP features:
- co-op investigations,
- live collaborative Evidence Boards,
- case discussion rooms,
- hints,
- daily mystery,
- seasonal cases,
- advanced graph analytics,
- optional AI-assisted clue explanations,
- PWA/offline case packs,
- multilingual content.

These should not block the MVP.
