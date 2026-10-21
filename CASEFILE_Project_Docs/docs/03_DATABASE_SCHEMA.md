# CASEFILE — Database Design

MongoDB collections are designed around the investigation domain.

## 1. User

```js
{
  _id,
  username,
  email,
  passwordHash,
  avatarUrl,
  role: "USER" | "ADMIN",
  leaderboardVisible: Boolean,
  stats: {
    casesStarted,
    casesCompleted,
    totalScore,
    averageScore,
    highestScore
  },
  createdAt,
  updatedAt
}
```

Indexes:
- unique email
- unique username

---

## 2. Case

```js
{
  _id,
  slug,
  title,
  shortDescription,
  category: "REAL_SOLVED" | "REAL_UNSOLVED" | "FICTIONAL",
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT",
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
  estimatedMinutes,
  briefing,
  contentWarning,
  editorialNote,
  coverImage,
  tags: [],
  sourceIds: [],
  solution: {
    type,
    acceptedAnswerIds: [],
    scoringVersion
  },
  createdBy,
  createdAt,
  updatedAt
}
```

---

## 3. Evidence

```js
{
  _id,
  caseId,
  title,
  type,
  description,
  fullContent,
  importance: "LOW" | "MEDIUM" | "HIGH",
  discoveryWeight,
  isHidden,
  relatedPersonIds: [],
  relatedTimelineEventIds: [],
  relatedLocationIds: [],
  sourceIds: [],
  createdAt,
  updatedAt
}
```

---

## 4. Person

```js
{
  _id,
  caseId,
  displayName,
  role,
  description,
  statusLabel,
  evidenceIds: [],
  createdAt,
  updatedAt
}
```

---

## 5. WitnessStatement

```js
{
  _id,
  caseId,
  personId,
  title,
  statement,
  dateLabel,
  evidenceIds: [],
  sourceIds: [],
  createdAt
}
```

---

## 6. TimelineEvent

```js
{
  _id,
  caseId,
  title,
  description,
  eventDate,
  displayDate,
  evidenceIds: [],
  personIds: [],
  locationId,
  order
}
```

---

## 7. Location

```js
{
  _id,
  caseId,
  name,
  description,
  approximateCoordinates,
  evidenceIds: [],
  timelineEventIds: []
}
```

Avoid exact private residential addresses.

---

## 8. Source

```js
{
  _id,
  caseId,
  title,
  publisher,
  url,
  publishedAt,
  accessedAt,
  sourceType,
  notes
}
```

Source types:
- `OFFICIAL`
- `REPUTABLE_NEWS`
- `BOOK`
- `ARCHIVE`
- `PUBLIC_RECORD`
- `OTHER`

---

## 9. Investigation

```js
{
  _id,
  userId,
  caseId,
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED",
  startedAt,
  completedAt,
  discoveredEvidenceIds: [],
  board: {
    nodes: [],
    edges: []
  },
  hypotheses: [],
  conclusion: {
    answerId,
    explanation,
    selectedEvidenceIds: []
  },
  score: {
    total,
    evidence,
    conclusion,
    reasoning,
    scoringVersion
  },
  hintsUsed,
  createdAt,
  updatedAt
}
```

Unique/indexing consideration:
- userId + caseId can be indexed.
- Multiple attempts may be allowed, so do not make this pair globally unique.

---

## 10. Achievement

```js
{
  _id,
  code,
  name,
  description,
  icon,
  conditionType,
  conditionValue
}
```

---

## 11. UserAchievement

```js
{
  _id,
  userId,
  achievementId,
  unlockedAt
}
```

Unique:
- userId + achievementId

---

## 12. AuditLog

Recommended for admin actions:

```js
{
  _id,
  actorUserId,
  action,
  entityType,
  entityId,
  metadata,
  createdAt
}
```

Do not log passwords, authentication secrets, or unnecessary personal data.
