# CASEFILE — Decision Log

This file prevents undocumented assumptions from becoming accidental requirements. Decisions marked **Proposed** are recommendations, not confirmed user choices. Record approvals and changes here.

## P0 — resolve before implementing affected contracts

### D-001: Scoring formula
**Status:** Approved.

- Evidence discovery: 40 points.
- Conclusion accuracy: 35 points.
- Reasoning and evidence links: 25 points.
- Maximum total: 100.
- The server is the sole authority for scoring.
- Persist component scores, final score, scoring version, and submission timestamp.
- Identical normalized inputs under the same scoring version must yield the same score.

**Chosen approach:** Adopt the weighted evidence-discovery formula, binary conclusion scoring by default, and rubric-based reasoning scoring.

**Clarifications:**
- Evidence discovery uses proportional credit based on eligible evidence weights.
- Conclusion partial credit is permitted only through explicit case configuration.
- Reasoning uses three independently evaluated criteria worth 15, 5, and 5 points.
- Explanation completeness must use a defined case-specific rubric.
- Component scores are calculated at full precision; the final total is rounded once and clamped to 0–100.
- Scoring configuration is versioned, validated, and kept server-side.
- Scoring must be deterministic, and only legitimately discovered evidence can earn discovery credit.
- Published cases must have valid scoring configuration before they become playable.

**Reason:** Provides a complete, deterministic scoring system suitable for a college mini-project demonstrating sophisticated backend business logic while maintaining security and testability.

**Date:** 2026-10-17

**Affected files/contracts:**
- `12_SCORING_CONTRACT.md` (scoring formulas)
- `03_DATABASE_SCHEMA.md` (Case.solution, Evidence.discoveryWeight, Investigation.score fields)
- `04_API_SPEC.md` (conclusion submission and scoring endpoints)
- `07_TEST_PLAN.md` (scoring test requirements)

**Outstanding follow-up:** Define the exact structured rubric schema and validation rules before implementing the scoring service.

### D-002: Authentication/session mechanism
**Status:** Approved.

**Chosen approach:** Use HTTP-only cookie-based authentication with `express-session`.

**Configuration:**
- Use in-memory session storage for local development and a persistent shared session store for production.
- Configure the session cookie with `httpOnly: true`, `sameSite: 'strict'`, and `secure: true` in production.
- Set the session lifetime to 24 hours, configurable through `SESSION_MAX_AGE`.
- Hash passwords with bcrypt using 12 salt rounds.
- Store the session secret in the `AUTH_SECRET` environment variable.
- Limit failed login attempts to five per IP within a 15-minute window. Configure registration rate limiting separately.
- Use a maintained CSRF protection implementation for state-changing requests.
- Regenerate the session ID after successful authentication and invalidate the session on logout.
- Enforce authentication, investigation ownership, and role-based authorization on the server.
- Never store authentication credentials in browser localStorage.

**Implementation requirements:** Configure secure cookie handling, session expiration, credential validation, centralized authorization middleware, and automated security tests.

**Outstanding follow-up:** Select the production session store and maintained CSRF implementation during backend foundation setup. Configure cookie, CORS, and proxy settings according to the deployment topology.

**Rationale:** This approach provides straightforward session revocation and fits the project's browser-based MERN application without the additional complexity of JWT refresh-token rotation.

**Date:** 2026-10-17

**Affected files/contracts:**
- `06_SECURITY_PRIVACY.md` (authentication section)
- `04_API_SPEC.md` (auth endpoints and session requirements)
- `02_SYSTEM_ARCHITECTURE.md` (middleware and authentication layer)
- `07_TEST_PLAN.md` (security tests)

### D-003: Investigation lifecycle and replay
**Status:** Approved.

**Chosen approach:** Multiple attempts allowed, completed investigations immutable.

**Policies:**
- Users can create unlimited investigation attempts for the same case.
- Each attempt is stored as a separate investigation record with its own ID and attempt number.
- Investigations have three states: `IN_PROGRESS`, `COMPLETED`, and `ABANDONED`.
- Completed investigations are immutable. Users must start a new attempt to replay a case.
- Autosave updates the existing in-progress investigation rather than creating duplicate records.
- Completion is idempotent. Repeated completion requests return the existing result without recalculating or changing the score.
- The leaderboard uses the best score per case, with the metric configurable for future changes.
- Profile statistics track best score, total attempts, and average score. Investigation history retains all attempts, including their statuses and scores.
- Abandoned investigations remain in history but do not count as completed attempts for scoring or completion-based achievements.

**Implementation requirements:**
- Enforce investigation ownership and state transitions on the server.
- Concurrent completion requests must not produce duplicate results.
- Completed investigations must not be modifiable through any update endpoint.
- Investigation model includes `status` enum and `attemptNumber` field.
- No unique constraint on `(userId, caseId)` to allow multiple attempts.
- Index on `(userId, caseId)` for querying user's attempts.
- Index on `(userId, status)` for filtering in-progress investigations.

**Reason:** Allows users to learn from mistakes and retry cases while maintaining score integrity through immutability and idempotent completion. Suitable for an educational investigation platform.

**Date:** 2026-10-17

**Affected files/contracts:**
- `03_DATABASE_SCHEMA.md` (Investigation model: status, attemptNumber, indexes)
- `04_API_SPEC.md` (investigation endpoints with state transition rules)
- `02_SYSTEM_ARCHITECTURE.md` (investigation service lifecycle)
- `07_TEST_PLAN.md` (investigation lifecycle and idempotency tests)

### D-004: Evidence Board payload
**Status:** Approved.

**Chosen approach:** React Flow-Compatible JSON Structure.

**Configuration:**
- Board structure: Store `nodes`, `edges`, `groups`, and `version` in the `Investigation.board` field.
- Node types: Support `evidenceCard` and `noteNode` in the initial implementation. Defer `personNode` until a later phase.
- Relationship types: Support all seven approved types: `SUPPORTS`, `CONTRADICTS`, `CAUSES`, `RELATED_TO`, `SAME_TIME`, `SAME_PERSON`, and `SAME_LOCATION`.
- Coordinate bounds: Restrict both `x` and `y` coordinates to -5000 through 5000.
- Resource limits: Allow a maximum of 100 nodes and 200 edges per board.
- Payload size: Limit the serialized board payload to 100 KB.
- Notes: Enforce a maximum length of 500 characters per note.
- Evidence validation: Every evidence reference must identify valid evidence belonging to the current case and already discovered by the current investigation.
- Ownership and authorization: Verify investigation ownership and ensure completed investigations cannot be modified through the board-save endpoint.
- Save semantics: Use full replacement semantics. Each save replaces the existing board state after complete server-side validation.
- Autosave: Implement a two-second debounce on the frontend, with clear saving, saved, and error states.
- Validation: Reject duplicate node or edge IDs, invalid node types, unsupported relationship types, dangling edge references, malformed coordinates, oversized payloads, and invalid group memberships.
- Versioning: Include `version: "1.0"` and validate supported versions to allow future migrations.
- Persistence: Store the board as an embedded JSON-compatible object in `Investigation.board`. Do not create a separate Board collection for the MVP.

**Implementation requirements:**
- Treat all client-supplied board data as untrusted.
- Validate the complete board before persisting any changes.
- Sanitize note text and enforce strict field allowlists to prevent arbitrary properties from being stored.
- Ensure board reads and writes respect investigation ownership and the case's discovery rules.
- Make board updates atomic so a failed validation never leaves partially updated state.
- Test save-and-restore fidelity, authorization failures, invalid evidence references, resource limits, malformed relationships, and completed-investigation restrictions.

**Reason:** Direct React Flow compatibility minimizes transformation code, while comprehensive validation ensures security and data integrity. The structure supports the approved scoring contract's relationship evaluation requirements.

**Date:** 2026-10-17

**Affected files/contracts:**
- `03_DATABASE_SCHEMA.md` (Investigation.board field structure)
- `04_API_SPEC.md` (board save/retrieve endpoints and validation rules)
- `02_SYSTEM_ARCHITECTURE.md` (board validation service)
- `13_ACCEPTANCE_CRITERIA.md` (board validation and save/restore tests)

### D-005: Public case response and secret solution
**Status:** Approved.

**Chosen approach:** Separate Fields with Projection with defense-in-depth safeguards.

**Database structure:**
- Maintain a single `Case` collection containing public case content and private solution configuration.
- Keep the solution data separate from the public response contract, even though both reside in the same document.
- Document all private fields explicitly in the Mongoose schema.

**Private fields (never appear in public responses):**
- `solution.acceptedAnswerIds`
- `solution.scoringVersion`
- `solution.partialCreditRules`
- `evidence.isHidden`
- `evidence.unlockConditions`
- Any additional fields containing answer keys, expected conclusions, hidden evidence rules, or internal scoring configuration.

**Public case access:**
- Implement `CaseService.getPublicCase(slug)` as the standard service for retrieving public case data.
- Apply explicit field exclusion using Mongoose projection where appropriate.
- Return only the fields permitted by the public API contract.
- Ensure unpublished and archived cases follow the project's publication and authorization rules.
- Do not expose undiscovered evidence or its unlock conditions through public case endpoints.

**Administrative access:**
- Administrative endpoints may access complete case documents only after verifying the user's administrator role.
- Keep administrative response handling separate from public response handling.
- Never rely on frontend restrictions to protect private data.

**Scoring and evidence discovery:**
- The scoring service must retrieve solution configuration through a privileged backend-only query.
- The evidence discovery service must evaluate hidden-evidence status and unlock conditions on the server.
- Return evidence content only when the applicable discovery rules permit access.
- Never trust client-supplied scores, discovery status, accepted answers, or solution configuration.

**Security safeguard (defense in depth):**
- Implement a dedicated public-response serializer or allowlisted DTO that explicitly selects permitted fields before returning data to the client.
- This provides defense in depth: if a projection is accidentally omitted or a new private field is added, the public serializer must still prevent that field from being exposed.

**Automated acceptance tests:**
- Public case responses never contain the `solution` object or private evidence fields.
- No private solution or scoring configuration appears in public case lists, case details, search results, or other public API responses.
- Administrative endpoints return the required fields only to authorized administrators.
- Unauthorized users cannot access administrative case data.
- Hidden evidence remains inaccessible until its discovery conditions are satisfied.
- The scoring service can access private solution configuration without exposing it to clients.
- Adding a new private field does not automatically make it publicly accessible.
- Public responses contain only explicitly permitted fields.

**Implementation rules:**
- Keep the public API response format consistent with the existing `/api/v1` contract.
- Add schema comments identifying private fields and their security requirements.
- Centralize public case serialization to avoid inconsistent filtering across controllers.
- Review every endpoint that returns case-related data, including nested evidence and search results.

**Reason:** Single collection with projection is simple and reliable. Defense-in-depth with a public serializer prevents accidental exposure if projection is missed. Suitable for a college project demonstrating security-conscious API design.

**Date:** 2026-10-17

**Affected files/contracts:**
- `03_DATABASE_SCHEMA.md` (Case model with documented private fields)
- `04_API_SPEC.md` (public vs admin case endpoints)
- `02_SYSTEM_ARCHITECTURE.md` (CaseService with getPublicCase method)
- `06_SECURITY_PRIVACY.md` (solution confidentiality requirements)
- `13_ACCEPTANCE_CRITERIA.md` (solution leak prevention tests)

### D-006: Initial content
**Status:** Approved.

**Chosen approach:** Design a complete fictional case now, using "The Midnight Burglary" as the first vertical-slice test case.

**Case design:**
- Design the complete case according to the PRD and case-content guide, including all required persons, witness statements, evidence, timeline events, locations, documents, and solution notes.
- Establish a logically consistent mystery with strong clues, supporting clues, a meaningful contradiction, a red herring, and a late-discovered clue. Ensure the intended solution is supported by sufficient evidence.
- Preserve the approved 40/35/25 scoring model: 40 points for evidence discovery, 35 for conclusion accuracy, and 25 for reasoning and evidence links. Define the case-specific scoring rules without changing the established overall model.
- Keep the solution, accepted answers, and scoring configuration server-controlled and inaccessible through public case APIs, in accordance with D-005.
- Resolve the insurance-claim timing issue in the internal solution notes so Sarah's actions are explainable and do not create an unintended ambiguity about the intended culprit.
- Use the completed case for end-to-end validation of evidence discovery, Evidence Board interactions and persistence, conclusion submission, deterministic scoring, and investigation history.
- Document the case in the agreed content structure and use it as the template for future cases.

**Case: The Midnight Burglary (Refined)**
- **Summary:** A theft at "The Antique Shop" where a valuable necklace was stolen. The owner found the shop unlocked the next morning with the necklace missing from the display case.
- **Solution:** David Torres (the disgruntled employee with a key and motive)
- **Evidence items (8):**
  1. Broken display case (glass shattered outward - indicates break-in from outside)
  2. Unlocked back door (no forced entry - suggests key access)
  3. Fingerprint on display case (partial match to David)
  4. Security footage (showing figure at 2:30 AM, face obscured, wearing David's distinctive jacket)
  5. Financial records (shop in debt, insurance policy on necklace)
  6. David's termination letter (fired 2 days prior for theft accusation)
  7. Mike's alibi statement (claims he was at home, no witnesses - red herring)
  8. Sarah's insurance claim (filed 10 AM, after police report at 9:30 AM - no contradiction)
- **Persons of interest (3):**
  1. Sarah Jenkins (shop owner) - discovered the theft, has financial troubles
  2. Mike Chen (neighbor) - seen nearby, has a record (red herring)
  3. David Torres (employee) - has a key, was recently fired (culprit)
- **Witness (1):** Police officer who responded to the scene
- **Timeline events (8):**
  1. David fired (2 days before)
  2. Shop closes at 6 PM (day of theft)
  3. Sarah leaves shop at 6:15 PM
  4. Mike seen near shop at 10 PM (neighbor account)
  5. Security camera shows figure at 2:30 AM
  6. Theft occurs between 2:30-3:00 AM
  7. Sarah arrives at 9 AM next morning, discovers theft
  8. Police respond at 9:30 AM
- **Strong clues:** Fingerprint match, termination letter, unlocked door (key access), security footage jacket match
- **Supporting clues:** Security footage timing, financial motive
- **Contradiction:** Broken glass shattered outward (suggests break-in) but door was unlocked (suggests insider access) - the outward shattering was staged by David to simulate break-in
- **Red herring:** Mike Chen (has a record, was seen nearby, but no evidence linking him to the crime)
- **Late-discovered clue:** Security footage analysis reveals the figure was wearing David's distinctive jacket (available after initial investigation)

**Scoring configuration:**
- Evidence discovery: 8 evidence items, 5 points each (40 total)
- Conclusion accuracy: David Torres (35 points if correct, 0 if incorrect)
- Reasoning rubric:
  - 15 points: Correctly identify at least 3 strong evidence items (fingerprint, key access, termination letter)
  - 5 points: Identify the contradiction (outward glass vs unlocked door indicates staged break-in)
  - 5 points: Explain why red herring (Mike) is not the thief (no physical evidence, no access)

**Implementation requirements:**
- Review the complete case for logical consistency before implementation.
- Finalize scoring configuration against the existing scoring contract (D-001).
- Document the case in the database with all required fields.
- Use this case for vertical slice testing and acceptance criteria validation.
- This case serves as the template for future case structure.

**Reason:** A complete fictional case validates the entire investigation workflow end-to-end. Faster to iterate than historical cases, and establishes the content structure standard for all future cases.

**Date:** 2026-10-17

**Affected files/contracts:**
- `05_CASE_CONTENT_GUIDE.md` (case structure and completeness requirements)
- `03_DATABASE_SCHEMA.md` (Case model with all content types)
- `12_SCORING_CONTRACT.md` (case-specific scoring rubric)
- `07_TEST_PLAN.md` (end-to-end investigation test with this case)

## P1 — resolve during foundation or before relevant feature

### D-007: Achievements
**Status:** Open.

Define achievement identifiers, exact unlock conditions, whether they are once-per-user or per-case, and whether historical achievements are recalculated after rule changes.

### D-008: Admin bootstrap
**Status:** Open.

Recommended: a one-time, documented command or controlled environment-based bootstrap. Never ship a hardcoded admin password or public admin-registration endpoint.

### D-009: Testing tools
**Status:** Open.

Choose unit/API and frontend end-to-end tooling based on the actual repository. Minimum coverage includes scoring, authorization/ownership, case secret filtering, persistence, and the core investigation flow.

### D-010: Deployment
**Status:** Open.

Decide whether assessment requires local demonstration only, public hosting, or both. Deployment choice affects CORS, cookie configuration, environment variables, logging, and production smoke tests.

## Decision record template

For each resolved item, record:
- Decision ID:
- Status: Approved / Rejected / Deferred
- Chosen approach:
- Reason:
- Date:
- Affected files/contracts:
