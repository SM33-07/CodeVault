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
const emailA = `usera_${ts}@smoke.test`;
const emailB = `userb_${ts}@smoke.test`;
const password = 'Str0ngP@ss!';

// ─── Main ───────────────────────────────────────────────────────────────────
async function runSmokeTest() {
  console.log('=== SPRINT-4 AUTH SMOKE TEST ===\n');

  // ── 1. Signup User A ──────────────────────────────────────────────────────
  console.log('1) Signup User A');
  const signupA = await makeRequest('POST', '/api/auth/signup', {
    email: emailA,
    password,
  });
  assert(signupA.status === 201, `Expected 201, got ${signupA.status}`);
  assert(typeof signupA.data.token === 'string', 'No token returned');
  const tokenA = signupA.data.token;
  const userIdA = signupA.data.user.id;
  pass(`User A signed up  (id: ${userIdA})`);

  // ── 2. Signup User B ──────────────────────────────────────────────────────
  console.log('2) Signup User B');
  const signupB = await makeRequest('POST', '/api/auth/signup', {
    email: emailB,
    password,
  });
  assert(signupB.status === 201, `Expected 201, got ${signupB.status}`);
  const tokenB = signupB.data.token;
  const userIdB = signupB.data.user.id;
  pass(`User B signed up  (id: ${userIdB})`);

  // ── 3. Duplicate signup should 409 ────────────────────────────────────────
  console.log('3) Duplicate signup → 409');
  const dup = await makeRequest('POST', '/api/auth/signup', {
    email: emailA,
    password,
  });
  assert(dup.status === 409, `Expected 409, got ${dup.status}`);
  pass('Duplicate email rejected');

  // ── 4. Login User A ──────────────────────────────────────────────────────
  console.log('4) Login User A');
  const loginA = await makeRequest('POST', '/api/auth/login', {
    email: emailA,
    password,
  });
  assert(loginA.status === 200, `Expected 200, got ${loginA.status}`);
  assert(typeof loginA.data.token === 'string', 'No token on login');
  pass('Login returned token');

  // ── 5. Login with wrong password → 401 ────────────────────────────────────
  console.log('5) Login with wrong password → 401');
  const badPwd = await makeRequest('POST', '/api/auth/login', {
    email: emailA,
    password: 'WrongPassword123',
  });
  assert(badPwd.status === 401, `Expected 401, got ${badPwd.status}`);
  pass('Wrong password rejected');

  // ── 6. Login with non-existent email → 401 ───────────────────────────────
  console.log('6) Login with non-existent email → 401');
  const badEmail = await makeRequest('POST', '/api/auth/login', {
    email: 'nobody@nowhere.test',
    password,
  });
  assert(badEmail.status === 401, `Expected 401, got ${badEmail.status}`);
  pass('Non-existent email rejected');

  // ── 7. Unauthenticated user can GET snippets (public) ────────────────────
  console.log('7) GET /api/snippets without token → 200');
  const publicList = await makeRequest('GET', '/api/snippets');
  assert(publicList.status === 200, `Expected 200, got ${publicList.status}`);
  pass('Public listing works without auth');

  // ── 8. Unauthenticated POST → 401 ────────────────────────────────────────
  console.log('8) POST /api/snippets without token → 401');
  const noAuth = await makeRequest('POST', '/api/snippets', {
    title: 'Hack',
    codeBody: 'x',
    language: 'js',
    visibility: 'public',
  });
  assert(noAuth.status === 401, `Expected 401, got ${noAuth.status}`);
  pass('Unauthenticated create rejected');

  // ── 9. User A creates a snippet ──────────────────────────────────────────
  console.log('9) User A creates a snippet');
  const createRes = await makeRequest(
    'POST',
    '/api/snippets',
    {
      title: 'Sprint-4 Auth Smoke',
      codeBody: 'console.log("owned by A");',
      language: 'typescript',
      visibility: 'public',
      description: 'Snippet owned by User A',
    },
    tokenA,
  );
  assert(createRes.status === 201, `Expected 201, got ${createRes.status}`);
  const snippetId = createRes.data.id;
  assert(createRes.data.ownerId === userIdA, 'ownerId should be User A');
  pass(`Snippet created  (id: ${snippetId}, ownerId: ${createRes.data.ownerId})`);

  // ── 10. User A can update their own snippet ──────────────────────────────
  console.log('10) User A updates own snippet → 200');
  const ownerUpdate = await makeRequest(
    'PUT',
    `/api/snippets/${snippetId}`,
    { description: 'Updated by owner' },
    tokenA,
  );
  assert(ownerUpdate.status === 200, `Expected 200, got ${ownerUpdate.status}`);
  pass('Owner update succeeded');

  // ── 11. ★ User B tries to UPDATE User A's snippet → 403 ──────────────────
  console.log('11) ★ User B tries to UPDATE User A\'s snippet → 403');
  const crossUpdate = await makeRequest(
    'PUT',
    `/api/snippets/${snippetId}`,
    { description: 'Hijacked!' },
    tokenB,
  );
  assert(crossUpdate.status === 403, `Expected 403, got ${crossUpdate.status}`);
  pass('Cross-user update blocked (403)');

  // ── 12. ★ User B tries to DELETE User A's snippet → 403 ──────────────────
  console.log('12) ★ User B tries to DELETE User A\'s snippet → 403');
  const crossDelete = await makeRequest(
    'DELETE',
    `/api/snippets/${snippetId}`,
    undefined,
    tokenB,
  );
  assert(crossDelete.status === 403, `Expected 403, got ${crossDelete.status}`);
  pass('Cross-user delete blocked (403)');

  // ── 13. User A deletes their own snippet → 204 ───────────────────────────
  console.log('13) User A deletes own snippet → 204');
  const ownerDelete = await makeRequest(
    'DELETE',
    `/api/snippets/${snippetId}`,
    undefined,
    tokenA,
  );
  assert(ownerDelete.status === 204, `Expected 204, got ${ownerDelete.status}`);
  pass('Owner delete succeeded');

  // ── 14. Verify snippet is gone ────────────────────────────────────────────
  console.log('14) Verify snippet is gone → 404');
  const gone = await makeRequest('GET', `/api/snippets/${snippetId}`);
  assert(gone.status === 404, `Expected 404, got ${gone.status}`);
  pass('Snippet confirmed deleted');

  // ── Cleanup: remove smoke-test users ──────────────────────────────────────
  console.log('\nCleanup: removing smoke-test users...');
  await prisma.user.deleteMany({
    where: { email: { in: [emailA, emailB] } },
  });
  pass('Test users deleted');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n=== ALL 14 SPRINT-4 SMOKE TESTS PASSED! ===\n');
  console.log(JSON.stringify({
    userA: { id: userIdA, email: emailA },
    userB: { id: userIdB, email: emailB },
    snippetId,
    results: {
      signup: 'PASS',
      duplicateSignup: 'PASS (409)',
      login: 'PASS',
      wrongPassword: 'PASS (401)',
      unknownEmail: 'PASS (401)',
      publicGET: 'PASS (200, no token)',
      unauthPOST: 'PASS (401)',
      ownerCreate: 'PASS (201)',
      ownerUpdate: 'PASS (200)',
      crossUserUpdate: 'PASS (403)',
      crossUserDelete: 'PASS (403)',
      ownerDelete: 'PASS (204)',
      postDeleteGET: 'PASS (404)',
    },
  }, null, 2));
}

runSmokeTest()
  .catch((err) => {
    console.error('\n✘ SMOKE TEST FAILED:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
