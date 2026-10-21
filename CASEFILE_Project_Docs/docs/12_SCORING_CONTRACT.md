# CASEFILE — Detective Scoring Contract

**Status: Approved (2026-10-17). See Decision Log D-001 for approval details.**

## Fixed scoring weights from the project brief

| Component | Maximum |
|---|---:|
| Evidence discovery | 40 |
| Conclusion accuracy | 35 |
| Reasoning and evidence links | 25 |
| **Total** | **100** |

The server calculates all points. The client may display the score but may not submit a trusted score or component total.

## Proposed deterministic sub-formulas

### A. Evidence discovery — 40 points

Each evidence item has a server-defined positive weight and a discovery eligibility rule. For a case:

`evidenceScore = 40 × (sum of weights for uniquely discovered eligible evidence / sum of weights for all scoreable evidence)`

Clamp to 0–40 and round only at the documented final rounding stage. Duplicate discovery requests must not award extra credit. If the denominator is zero, case publication validation should fail rather than silently award points.

### B. Conclusion accuracy — 35 points

Use a server-side case solution rubric with explicit accepted conclusion IDs and optional pre-authored partial-credit criteria. Do not infer correctness from arbitrary client text. Free-text reasoning is evaluated separately under component C.

Suggested initial rule:
- Correct accepted conclusion: 35 points.
- Incorrect conclusion: 0 points.
- Partial credit: only when the case rubric explicitly defines it.

### C. Reasoning and evidence links — 25 points

Use case-authored, deterministic rubric criteria rather than an LLM or subjective runtime judgment. Proposed criteria:
- Correct required evidence relationships: up to 15 points.
- Identification of a defined contradiction or important inference: up to 5 points.
- Explanation completeness against explicit rubric checks: up to 5 points.

Each criterion must have a stable identifier, maximum points, and a server-defined evaluation rule. The exact criteria are case-specific and must be validated before a case can be published.

## Finalization

`finalScore = round(evidenceScore + conclusionScore + reasoningScore)`

Clamp the final result to the inclusive range 0–100. Persist:
- component scores and maximums,
- final score,
- scoring version,
- case solution/rubric version,
- submitted conclusion identifier,
- normalized evidence IDs and relationship IDs used for evaluation,
- completion timestamp.

The score must be reproducible from the persisted submission and the same immutable scoring/rubric version.

## Security and integrity requirements

- Never accept `score`, `evidenceScore`, `conclusionScore`, `reasoningScore`, or solution keys from the client as authoritative.
- Load solution/rubric data from a private server-side source.
- Validate all referenced evidence and relationships against the case and the user's investigation.
- Reject malformed IDs, duplicates where inappropriate, cross-case references, and submissions for another user's investigation.
- Protect completion from repeated requests and race conditions.
- Version rubrics so changes do not silently rewrite completed scores.

## Required tests

1. Maximum-score submission yields exactly 100.
2. Zero discovery and incorrect conclusion yields the expected rubric-defined score.
3. Duplicate discovery cannot increase score.
4. Repeating the same submission produces the same result.
5. Client-supplied score fields are ignored or rejected.
6. Cross-case evidence and relationship IDs are rejected.
7. Another user's investigation cannot be scored or modified.
8. Score components never exceed their maxima and final score stays between 0 and 100.
9. A case with invalid or incomplete scoring configuration cannot be published.

## Approval checklist

- [ ] Evidence weight formula approved.
- [ ] Conclusion partial-credit policy approved.
- [ ] Relationship types and correct-link criteria approved.
- [ ] Explanation rubric approved.
- [ ] Rounding/clamping policy approved.
- [ ] Replay and resubmission policy approved.
