# CASEFILE — Test Plan

## 1. Unit Tests

Test:
- score calculation,
- achievement conditions,
- validators,
- authorization helpers,
- case filters.

## 2. API Tests

Test:
- registration,
- login,
- protected endpoints,
- admin authorization,
- case retrieval,
- investigation creation,
- evidence discovery,
- board persistence,
- conclusion submission,
- score response.

## 3. Integration Tests

Important flow:

```text
Register
 -> Login
 -> Open case
 -> Start investigation
 -> Discover evidence
 -> Save board
 -> Submit conclusion
 -> Receive score
 -> Verify history
 -> Verify achievement
```

## 4. Frontend Tests

Test:
- route protection,
- case filters,
- loading states,
- empty states,
- API errors,
- Evidence Board interactions,
- responsive behavior.

## 5. Security Tests

Verify:
- normal user cannot call admin endpoints,
- users cannot modify another user's investigation,
- client cannot submit arbitrary final scores,
- malformed IDs are rejected,
- unsanitized HTML cannot execute,
- rate limits work.

## 6. Manual Acceptance Tests

### Case completion
- [ ] Start case.
- [ ] Discover clues.
- [ ] Connect clues.
- [ ] Submit conclusion.
- [ ] Score appears.
- [ ] History updates.
- [ ] Achievement appears.

### Admin
- [ ] Create case.
- [ ] Add evidence.
- [ ] Add timeline.
- [ ] Add source.
- [ ] Configure solution.
- [ ] Publish.
- [ ] User can see published case.
