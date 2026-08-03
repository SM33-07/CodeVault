import prisma from './prisma/client';
import http from 'http';

const PORT = process.env.PORT || 4001;

// ─── HTTP helper ────────────────────────────────────────────────────────────
function makeRequest(
  method: string,
  path: string,
  body?: any,
  token?: string,
): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(dataString)),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      { hostname: 'localhost', port: PORT, path, method, headers },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => {
          let parsed: any = null;
          if (buf) {
            try { parsed = JSON.parse(buf); } catch { parsed = buf; }
          }
          resolve({ status: res.statusCode || 0, data: parsed });
        });
      },
    );
    req.on('error', reject);
    if (body) req.write(dataString);
    req.end();
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

function pass(label: string) {
  console.log(`  ✔ ${label}`);
}

const ts = Date.now();
const emailA = `usera_s5_${ts}@smoke.test`;
const emailB = `userb_s5_${ts}@smoke.test`;
const password = 'Str0ngP@ss!';

// ─── Main ───────────────────────────────────────────────────────────────────
async function runSmokeTest() {
  console.log('=== SPRINT-5 SMOKE TEST ===');
  console.log('Covers: Search, Filtering, Forking, Analytics\n');

  // ── Setup: Create two users ───────────────────────────────────────────────
  console.log('Setup) Create User A and User B');
  const signupA = await makeRequest('POST', '/api/auth/signup', { email: emailA, password });
  assert(signupA.status === 201, `Signup A: Expected 201, got ${signupA.status}`);
  const tokenA = signupA.data.token;
  const userIdA = signupA.data.user.id;

  const signupB = await makeRequest('POST', '/api/auth/signup', { email: emailB, password });
  assert(signupB.status === 201, `Signup B: Expected 201, got ${signupB.status}`);
  const tokenB = signupB.data.token;
  const userIdB = signupB.data.user.id;
  pass(`User A (${userIdA}) and User B (${userIdB}) created`);

  // ── Setup: Create tags ────────────────────────────────────────────────────
  console.log('\nSetup) Create tags for testing');
  const tagJS = await prisma.tag.upsert({
    where: { name: 'javascript' },
    update: {},
    create: { name: 'javascript' },
  });
  const tagTS = await prisma.tag.upsert({
    where: { name: 'typescript' },
    update: {},
    create: { name: 'typescript' },
  });
  const tagPython = await prisma.tag.upsert({
    where: { name: 'python' },
    update: {},
    create: { name: 'python' },
  });
  pass(`Tags: javascript(${tagJS.id}), typescript(${tagTS.id}), python(${tagPython.id})`);

  // ── 1. User A creates a PUBLIC snippet (TypeScript, tagged typescript) ────
  console.log('\n1) User A creates a PUBLIC TypeScript snippet');
  const createPublic = await makeRequest('POST', '/api/snippets', {
    title: 'Sprint5 Public TS Snippet',
    codeBody: 'const x: number = 42;',
    language: 'typescript',
    visibility: 'public',
    description: 'A public TypeScript snippet for search testing',
    tagIds: [tagTS.id],
  }, tokenA);
  assert(createPublic.status === 201, `Expected 201, got ${createPublic.status}`);
  const publicSnippetId = createPublic.data.id;
  pass(`Public snippet created (id: ${publicSnippetId})`);

  // ── 2. User A creates a PRIVATE snippet (Python, tagged python) ───────────
  console.log('\n2) User A creates a PRIVATE Python snippet');
  const createPrivate = await makeRequest('POST', '/api/snippets', {
    title: 'Sprint5 Private Python Snippet',
    codeBody: 'print("secret")',
    language: 'python',
    visibility: 'private',
    description: 'A private Python snippet',
    tagIds: [tagPython.id],
  }, tokenA);
  assert(createPrivate.status === 201, `Expected 201, got ${createPrivate.status}`);
  const privateSnippetId = createPrivate.data.id;
  pass(`Private snippet created (id: ${privateSnippetId})`);

  // ── 3. User A creates another PUBLIC snippet (JavaScript, tagged javascript) ─
  console.log('\n3) User A creates a PUBLIC JavaScript snippet');
  const createJS = await makeRequest('POST', '/api/snippets', {
    title: 'Sprint5 JS Utility',
    codeBody: 'function add(a, b) { return a + b; }',
    language: 'javascript',
    visibility: 'public',
    description: 'A utility function for adding numbers',
    tagIds: [tagJS.id],
  }, tokenA);
  assert(createJS.status === 201, `Expected 201, got ${createJS.status}`);
  const jsSnippetId = createJS.data.id;
  pass(`JS snippet created (id: ${jsSnippetId})`);

  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH & FILTERING
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 4. Unauthenticated GET → only public snippets ─────────────────────────
  console.log('\n4) GET /api/snippets (no token) → only public snippets');
  const publicList = await makeRequest('GET', '/api/snippets');
  assert(publicList.status === 200, `Expected 200, got ${publicList.status}`);
  const publicIds = publicList.data.map((s: any) => s.id);
  assert(publicIds.includes(publicSnippetId), 'Public snippet should be in list');
  assert(publicIds.includes(jsSnippetId), 'JS snippet should be in list');
  assert(!publicIds.includes(privateSnippetId), 'Private snippet should NOT be in unauthenticated list');
  pass('Unauthenticated listing shows only public snippets');

  // ── 5. Authenticated GET (User A) → public + own private ─────────────────
  console.log('\n5) GET /api/snippets (User A token) → public + own private');
  const authList = await makeRequest('GET', '/api/snippets', undefined, tokenA);
  assert(authList.status === 200, `Expected 200, got ${authList.status}`);
  const authIds = authList.data.map((s: any) => s.id);
  assert(authIds.includes(publicSnippetId), 'Public snippet in authenticated list');
  assert(authIds.includes(privateSnippetId), 'Own private snippet in authenticated list');
  pass('Authenticated listing shows public + own private snippets');

  // ── 6. Authenticated GET (User B) → public only (not A's private) ────────
  console.log('\n6) GET /api/snippets (User B token) → public only');
  const bList = await makeRequest('GET', '/api/snippets', undefined, tokenB);
  assert(bList.status === 200, `Expected 200, got ${bList.status}`);
  const bIds = bList.data.map((s: any) => s.id);
  assert(bIds.includes(publicSnippetId), 'Public snippet visible to User B');
  assert(!bIds.includes(privateSnippetId), 'User A private snippet NOT visible to User B');
  pass('User B cannot see User A private snippets');

  // ── 7. Filter by language ─────────────────────────────────────────────────
  console.log('\n7) GET /api/snippets?language=typescript → only TS snippets');
  const langFilter = await makeRequest('GET', '/api/snippets?language=typescript');
  assert(langFilter.status === 200, `Expected 200, got ${langFilter.status}`);
  const langIds = langFilter.data.map((s: any) => s.id);
  assert(langIds.includes(publicSnippetId), 'TS snippet included');
  assert(!langIds.includes(jsSnippetId), 'JS snippet excluded from TS filter');
  pass('Language filter works correctly');

  // ── 8. Filter by tag ──────────────────────────────────────────────────────
  console.log('\n8) GET /api/snippets?tag=javascript → only JS-tagged snippets');
  const tagFilter = await makeRequest('GET', '/api/snippets?tag=javascript');
  assert(tagFilter.status === 200, `Expected 200, got ${tagFilter.status}`);
  const tagFilterIds = tagFilter.data.map((s: any) => s.id);
  assert(tagFilterIds.includes(jsSnippetId), 'JS-tagged snippet included');
  assert(!tagFilterIds.includes(publicSnippetId), 'TS-tagged snippet excluded from JS tag filter');
  pass('Tag filter works correctly');

  // ── 9. Keyword search ─────────────────────────────────────────────────────
  console.log('\n9) GET /api/snippets?q=utility → keyword search');
  const qFilter = await makeRequest('GET', '/api/snippets?q=utility');
  assert(qFilter.status === 200, `Expected 200, got ${qFilter.status}`);
  const qIds = qFilter.data.map((s: any) => s.id);
  assert(qIds.includes(jsSnippetId), 'JS snippet with "Utility" in title found');
  assert(!qIds.includes(publicSnippetId), 'TS snippet without "utility" excluded');
  pass('Keyword search works correctly');

  // ── 10. Combined filters (language + tag) ─────────────────────────────────
  console.log('\n10) GET /api/snippets?language=javascript&tag=javascript → combined filter');
  const combo = await makeRequest('GET', '/api/snippets?language=javascript&tag=javascript');
  assert(combo.status === 200, `Expected 200, got ${combo.status}`);
  const comboIds = combo.data.map((s: any) => s.id);
  assert(comboIds.includes(jsSnippetId), 'JS snippet matches combined filter');
  assert(!comboIds.includes(publicSnippetId), 'TS snippet excluded from combined filter');
  pass('Combined language+tag filter works correctly');

  // ═══════════════════════════════════════════════════════════════════════════
  // VISIBILITY & VIEW COUNT
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 11. User B views public snippet → view count increments ───────────────
  console.log('\n11) User B views public snippet → viewCount increments');
  const viewBefore = await makeRequest('GET', `/api/snippets/${publicSnippetId}`, undefined, tokenB);
  assert(viewBefore.status === 200, `Expected 200, got ${viewBefore.status}`);
  const viewCountBefore = viewBefore.data.viewCount;

  // View it again
  const viewAfter = await makeRequest('GET', `/api/snippets/${publicSnippetId}`, undefined, tokenB);
  assert(viewAfter.status === 200, `Expected 200, got ${viewAfter.status}`);
  // The second view should have the count from after the first view's increment
  // But the returned snippet is the *pre-increment* value. Check DB directly.
  const dbSnippet = await prisma.snippet.findUnique({ where: { id: publicSnippetId } });
  assert(dbSnippet!.viewCount >= viewCountBefore + 2, `viewCount should have incremented at least twice, was ${viewCountBefore}, now ${dbSnippet!.viewCount}`);
  pass(`viewCount incremented (${viewCountBefore} → ${dbSnippet!.viewCount})`);

  // ── 12. Owner views own snippet → viewCount does NOT increment ────────────
  console.log('\n12) User A views own public snippet → viewCount does NOT increment');
  const ownerViewBefore = await prisma.snippet.findUnique({ where: { id: publicSnippetId } });
  await makeRequest('GET', `/api/snippets/${publicSnippetId}`, undefined, tokenA);
  const ownerViewAfter = await prisma.snippet.findUnique({ where: { id: publicSnippetId } });
  assert(ownerViewAfter!.viewCount === ownerViewBefore!.viewCount, `viewCount should not change on owner view (${ownerViewBefore!.viewCount} vs ${ownerViewAfter!.viewCount})`);
  pass(`viewCount unchanged on owner view (${ownerViewAfter!.viewCount})`);

  // ── 13. User B tries to GET private snippet → 404 ────────────────────────
  console.log('\n13) User B tries to view User A\'s private snippet → 404');
  const privateView = await makeRequest('GET', `/api/snippets/${privateSnippetId}`, undefined, tokenB);
  assert(privateView.status === 404, `Expected 404, got ${privateView.status}`);
  pass('Private snippet returns 404 for non-owner');

  // ── 14. User A can view own private snippet → 200 ────────────────────────
  console.log('\n14) User A views own private snippet → 200');
  const ownerPrivateView = await makeRequest('GET', `/api/snippets/${privateSnippetId}`, undefined, tokenA);
  assert(ownerPrivateView.status === 200, `Expected 200, got ${ownerPrivateView.status}`);
  pass('Owner can view own private snippet');

  // ── 15. Unauthenticated user tries private snippet → 404 ─────────────────
  console.log('\n15) Unauthenticated GET on private snippet → 404');
  const anonPrivate = await makeRequest('GET', `/api/snippets/${privateSnippetId}`);
  assert(anonPrivate.status === 404, `Expected 404, got ${anonPrivate.status}`);
  pass('Unauthenticated request to private snippet returns 404');

  // ═══════════════════════════════════════════════════════════════════════════
  // FORKING
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 16. User B forks User A's public snippet → 201 ────────────────────────
  console.log('\n16) ★ User B forks User A\'s public snippet → 201');
  const forkRes = await makeRequest('POST', `/api/snippets/${publicSnippetId}/fork`, undefined, tokenB);
  assert(forkRes.status === 201, `Expected 201, got ${forkRes.status}`);
  const forkedId = forkRes.data.id;
  assert(forkRes.data.forkedFromId === publicSnippetId, `forkedFromId should be ${publicSnippetId}`);
  assert(forkRes.data.ownerId === userIdB, 'Fork should be owned by User B');
  assert(forkRes.data.title === createPublic.data.title, 'Fork should preserve title');
  assert(forkRes.data.codeBody === createPublic.data.codeBody, 'Fork should preserve codeBody');
  pass(`Fork created (id: ${forkedId}, forkedFromId: ${publicSnippetId})`);

  // ── 17. Original snippet forkCount incremented ────────────────────────────
  console.log('\n17) Original snippet forkCount incremented');
  const originalAfterFork = await prisma.snippet.findUnique({ where: { id: publicSnippetId } });
  assert(originalAfterFork!.forkCount >= 1, `forkCount should be >= 1, got ${originalAfterFork!.forkCount}`);
  pass(`Original forkCount: ${originalAfterFork!.forkCount}`);

  // ── 18. Fork preserves tags ───────────────────────────────────────────────
  console.log('\n18) Forked snippet preserves tags');
  const forkDetail = await makeRequest('GET', `/api/snippets/${forkedId}`, undefined, tokenB);
  assert(forkDetail.status === 200, `Expected 200, got ${forkDetail.status}`);
  const forkTagNames = forkDetail.data.snippetTags.map((st: any) => st.tag.name);
  assert(forkTagNames.includes('typescript'), 'Fork should preserve typescript tag');
  pass(`Fork tags: [${forkTagNames.join(', ')}]`);

  // ── 19. ★ User B tries to fork User A's PRIVATE snippet → 403 ────────────
  console.log('\n19) ★ User B tries to fork User A\'s private snippet → 403');
  const forkPrivate = await makeRequest('POST', `/api/snippets/${privateSnippetId}/fork`, undefined, tokenB);
  assert(forkPrivate.status === 403, `Expected 403, got ${forkPrivate.status}`);
  pass('Forking private snippet blocked (403)');

  // ── 20. ★ User B tries to update User A's public snippet → 403 ───────────
  console.log('\n20) ★ User B tries to UPDATE User A\'s public snippet → 403');
  const crossUpdate = await makeRequest('PUT', `/api/snippets/${publicSnippetId}`, { description: 'Hijacked!' }, tokenB);
  assert(crossUpdate.status === 403, `Expected 403, got ${crossUpdate.status}`);
  pass('Cross-user update blocked (403) — ownership enforced');

  // ═══════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════

  console.log('\nCleanup) Removing test data...');
  // Delete snippets first (to avoid FK issues with SnippetTag)
  await prisma.snippetTag.deleteMany({
    where: { snippet: { ownerId: { in: [userIdA, userIdB] } } },
  });
  await prisma.snippet.deleteMany({
    where: { ownerId: { in: [userIdA, userIdB] } },
  });
  await prisma.user.deleteMany({
    where: { email: { in: [emailA, emailB] } },
  });
  pass('Test users, snippets, and tags cleaned up');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n=== ALL 20 SPRINT-5 SMOKE TESTS PASSED! ===\n');
  console.log(JSON.stringify({
    userA: { id: userIdA, email: emailA },
    userB: { id: userIdB, email: emailB },
    snippets: {
      publicTS: publicSnippetId,
      privateP: privateSnippetId,
      publicJS: jsSnippetId,
      forked: forkedId,
    },
    results: {
      // Search & Filtering
      unauthListPublicOnly: 'PASS (200)',
      authListWithPrivate: 'PASS (200)',
      crossUserPrivateHidden: 'PASS (200)',
      filterByLanguage: 'PASS (200)',
      filterByTag: 'PASS (200)',
      keywordSearch: 'PASS (200)',
      combinedFilter: 'PASS (200)',
      // Visibility & View Count
      viewCountIncrement: 'PASS',
      ownerViewNoIncrement: 'PASS',
      privateSnippet404NonOwner: 'PASS (404)',
      privateSnippet200Owner: 'PASS (200)',
      privateSnippet404Anon: 'PASS (404)',
      // Forking
      forkPublicSnippet: 'PASS (201)',
      forkCountIncrement: 'PASS',
      forkPreservesTags: 'PASS',
      forkPrivateBlocked: 'PASS (403)',
      // Ownership
      crossUserUpdateBlocked: 'PASS (403)',
    },
  }, null, 2));
}

runSmokeTest()
  .catch((err) => {
    console.error('\n✘ SMOKE TEST FAILED:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
