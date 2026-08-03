# Sprint-5 Smoke Test Report

Date: 2026-08-04

Server: http://localhost:4001

## Summary
- All 20 test cases passed.
- Search & filtering (language, tag, keyword, combined) working correctly.
- Visibility enforcement: private snippets hidden from non-owners in listings and direct access.
- View-count analytics: increments on non-owner views, does not increment on owner views.
- Forking: preserves lineage, tags, and content; blocks forking of private snippets; increments fork count.
- Ownership enforcement: cross-user updates correctly blocked with 403.

## Detailed Results

### Search & Filtering

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 4 | GET /api/snippets (no token) | 200, public only | 200, public only | ✔ PASS |
| 5 | GET /api/snippets (User A token) | 200, public + own private | 200, public + own private | ✔ PASS |
| 6 | GET /api/snippets (User B token) | 200, no User A private | 200, no User A private | ✔ PASS |
| 7 | Filter by language=typescript | 200, TS only | 200, TS only | ✔ PASS |
| 8 | Filter by tag=javascript | 200, JS-tagged only | 200, JS-tagged only | ✔ PASS |
| 9 | Keyword search q=utility | 200, "Utility" match only | 200, "Utility" match only | ✔ PASS |
| 10 | Combined language+tag | 200, intersection | 200, intersection | ✔ PASS |

### Visibility & View-Count Analytics

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 11 | User B views public snippet | viewCount increments | 0 → 2 | ✔ PASS |
| 12 | User A views own public snippet | viewCount unchanged | 2 → 2 | ✔ PASS |
| 13 | User B views User A's private snippet | 404 | 404 | ✔ PASS |
| 14 | User A views own private snippet | 200 | 200 | ✔ PASS |
| 15 | Unauthenticated GET on private snippet | 404 | 404 | ✔ PASS |

### Forking

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 16 | ★ User B forks public snippet | 201, forkedFromId set | 201, forkedFromId set | ✔ PASS |
| 17 | Original forkCount incremented | forkCount ≥ 1 | forkCount = 1 | ✔ PASS |
| 18 | Fork preserves tags | typescript tag present | typescript tag present | ✔ PASS |
| 19 | ★ User B forks private snippet | 403 | 403 | ✔ PASS |

### Ownership Enforcement

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 20 | ★ User B updates User A's public snippet | 403 | 403 | ✔ PASS |

## Raw Test Summary (JSON)

```json
{
  "userA": {
    "id": "672cf899-862b-4933-9ca7-8fa2a74996e6",
    "email": "usera_s5_1785787590315@smoke.test"
  },
  "userB": {
    "id": "d2320a44-2a6e-400b-8d4d-1ba93c78e522",
    "email": "userb_s5_1785787590315@smoke.test"
  },
  "snippets": {
    "publicTS": "d54cf7eb-a9fa-4c0f-8413-6650c91d1264",
    "privateP": "264faac5-ca27-4276-a36b-e7b4f0be55c6",
    "publicJS": "0a486880-8f47-49f7-a870-276869ea3f17",
    "forked": "37862fef-b2c2-42a0-a284-138d52e1543f"
  },
  "results": {
    "unauthListPublicOnly": "PASS (200)",
    "authListWithPrivate": "PASS (200)",
    "crossUserPrivateHidden": "PASS (200)",
    "filterByLanguage": "PASS (200)",
    "filterByTag": "PASS (200)",
    "keywordSearch": "PASS (200)",
    "combinedFilter": "PASS (200)",
    "viewCountIncrement": "PASS",
    "ownerViewNoIncrement": "PASS",
    "privateSnippet404NonOwner": "PASS (404)",
    "privateSnippet200Owner": "PASS (200)",
    "privateSnippet404Anon": "PASS (404)",
    "forkPublicSnippet": "PASS (201)",
    "forkCountIncrement": "PASS",
    "forkPreservesTags": "PASS",
    "forkPrivateBlocked": "PASS (403)",
    "crossUserUpdateBlocked": "PASS (403)"
  }
}
```

## Bugs Fixed Before Testing

1. **Fork guard inverted** (`snippet.service.ts`): The condition `ownerId === requestingUserId && visibility !== "public"` blocked the *owner* from forking their own private snippet while allowing *anyone else* to fork it. Fixed to `visibility !== "public" && ownerId !== requestingUserId`.

2. **Update allowed non-owners to modify public snippets** (`snippet.service.ts`): The `update` method had visibility-based logic and view-count incrementing instead of strict ownership enforcement. Non-owners could edit any public snippet. Restored `ownerId !== requestingUserId → 403` guard.

3. **View-count logic misplaced** (`snippet.service.ts`): View-count incrementing was in the `update` method instead of `findById`. Moved to `findById` where it correctly fires when a non-owner views a public snippet.

## Notes
- Tests were performed using an automated script at `server/src/smoke-test-sprint5.ts`.
- Test users were created with timestamped emails and cleaned up (users, snippets, snippet-tags) via Prisma after the test run.
- The `findAll` repository method now builds dynamic Prisma `where` clauses for visibility, tag, language, and keyword search.
