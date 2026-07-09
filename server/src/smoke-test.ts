import prisma from './prisma/client';
import http from 'http';

const PORT = process.env.PORT || 4001;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to make HTTP requests
function makeRequest(
  method: string,
  path: string,
  body?: any
): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const options: http.RequestOptions = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        let parsedData = null;
        if (responseBody) {
          try {
            parsedData = JSON.parse(responseBody);
          } catch (e) {
            parsedData = responseBody;
          }
        }
        resolve({
          status: res.statusCode || 0,
          data: parsedData,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(dataString);
    }
    req.end();
  });
}

async function runSmokeTest() {
  console.log('=== STARTING SPRINT-3 SMOKE TEST ===');

  // 1. Ensure tags exist in DB
  console.log('\nStep 1: Preparing tags in database...');
  const tagNames = ['javascript', 'typescript', 'backend'];
  const tags: Record<string, string> = {};

  for (const name of tagNames) {
    const record = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags[name] = record.id;
    console.log(`Tag ready: "${name}" -> ${record.id}`);
  }

  // 2. Test Snippet Creation with Tags
  console.log('\nStep 2: POST /api/snippets (creating snippet with javascript and typescript)...');
  const createPayload = {
    title: 'Smoke Test Snippet with Tags',
    codeBody: 'console.log("hello world");',
    language: 'typescript',
    visibility: 'public',
    description: 'A temporary snippet to verify tags relation flow.',
    tagIds: [tags['javascript'], tags['typescript']],
  };

  const createRes = await makeRequest('POST', '/api/snippets', createPayload);
  console.log(`Status: ${createRes.status}`);
  console.log('Response:', JSON.stringify(createRes.data, null, 2));

  if (createRes.status !== 201) {
    throw new Error(`Failed to create snippet: expected 201, got ${createRes.status}`);
  }

  const snippetId = createRes.data.id;
  console.log(`Snippet created with ID: ${snippetId}`);

  // Verify tags in response
  const createdTags = createRes.data.snippetTags.map((st: any) => st.tag.name);
  console.log('Attached tags:', createdTags);
  if (!createdTags.includes('javascript') || !createdTags.includes('typescript')) {
    throw new Error('Created snippet is missing attached tags!');
  }

  // 3. Test GET /api/snippets/:id
  console.log(`\nStep 3: GET /api/snippets/${snippetId}...`);
  const getRes = await makeRequest('GET', `/api/snippets/${snippetId}`);
  console.log(`Status: ${getRes.status}`);
  if (getRes.status !== 200) {
    throw new Error(`Failed to get snippet: expected 200, got ${getRes.status}`);
  }
  const fetchedTags = getRes.data.snippetTags.map((st: any) => st.tag.name);
  console.log('Fetched tags:', fetchedTags);

  // 4. Test GET /api/snippets (listing all)
  console.log('\nStep 4: GET /api/snippets (listing all snippets)...');
  const listRes = await makeRequest('GET', '/api/snippets');
  console.log(`Status: ${listRes.status}`);
  if (listRes.status !== 200) {
    throw new Error(`Failed to list snippets: expected 200, got ${listRes.status}`);
  }
  const foundInList = listRes.data.find((s: any) => s.id === snippetId);
  if (!foundInList) {
    throw new Error('Created snippet not found in snippets list!');
  }
  console.log('Snippet found in list. Tags in list:', foundInList.snippetTags.map((st: any) => st.tag.name));

  // 5. Test PUT /api/snippets/:id (updating tags)
  console.log(`\nStep 5: PUT /api/snippets/${snippetId} (updating tags: typescript and backend)...`);
  const updatePayload = {
    tagIds: [tags['typescript'], tags['backend']],
  };
  const updateRes = await makeRequest('PUT', `/api/snippets/${snippetId}`, updatePayload);
  console.log(`Status: ${updateRes.status}`);
  console.log('Response:', JSON.stringify(updateRes.data, null, 2));
  if (updateRes.status !== 200) {
    throw new Error(`Failed to update snippet: expected 200, got ${updateRes.status}`);
  }
  const updatedTags = updateRes.data.snippetTags.map((st: any) => st.tag.name);
  console.log('Updated tags in response:', updatedTags);
  if (updatedTags.includes('javascript') || !updatedTags.includes('typescript') || !updatedTags.includes('backend')) {
    throw new Error('Tags update did not apply correctly!');
  }

  // 6. Test PUT /api/snippets/:id (clearing tags)
  console.log(`\nStep 6: PUT /api/snippets/${snippetId} (clearing all tags)...`);
  const clearPayload = {
    tagIds: [],
  };
  const clearRes = await makeRequest('PUT', `/api/snippets/${snippetId}`, clearPayload);
  console.log(`Status: ${clearRes.status}`);
  if (clearRes.status !== 200) {
    throw new Error(`Failed to clear snippet tags: expected 200, got ${clearRes.status}`);
  }
  const clearedTags = clearRes.data.snippetTags.map((st: any) => st.tag.name);
  console.log('Cleared tags in response:', clearedTags);
  if (clearedTags.length !== 0) {
    throw new Error('Snippet tags were not cleared!');
  }

  // 7. Test Input Validation (error cases)
  console.log('\nStep 7: Testing Input Validation constraints...');
  
  // Case A: Missing required fields on create
  console.log('Case A: Creating snippet without title...');
  const invalidPayload1 = {
    codeBody: 'console.log("no title");',
    language: 'typescript',
    visibility: 'public',
  };
  const invalidRes1 = await makeRequest('POST', '/api/snippets', invalidPayload1);
  console.log(`Status: ${invalidRes1.status} (Expected: 400)`);
  console.log('Error Response:', JSON.stringify(invalidRes1.data, null, 2));
  if (invalidRes1.status !== 400) {
    throw new Error(`Expected 400 Bad Request, got ${invalidRes1.status}`);
  }

  // Case B: Invalid Visibility Enum
  console.log('Case B: Creating snippet with invalid visibility...');
  const invalidPayload2 = {
    title: 'Invalid Vis',
    codeBody: 'console.log("invalid vis");',
    language: 'typescript',
    visibility: 'super-private',
  };
  const invalidRes2 = await makeRequest('POST', '/api/snippets', invalidPayload2);
  console.log(`Status: ${invalidRes2.status} (Expected: 400)`);
  console.log('Error Response:', JSON.stringify(invalidRes2.data, null, 2));
  if (invalidRes2.status !== 400) {
    throw new Error(`Expected 400 Bad Request, got ${invalidRes2.status}`);
  }

  // Case C: Invalid UUID in tagIds
  console.log('Case C: Creating snippet with invalid tag UUIDs...');
  const invalidPayload3 = {
    title: 'Invalid Tags',
    codeBody: 'console.log("invalid tags");',
    language: 'typescript',
    visibility: 'public',
    tagIds: ['invalid-uuid-format'],
  };
  const invalidRes3 = await makeRequest('POST', '/api/snippets', invalidPayload3);
  console.log(`Status: ${invalidRes3.status} (Expected: 400)`);
  console.log('Error Response:', JSON.stringify(invalidRes3.data, null, 2));
  if (invalidRes3.status !== 400) {
    throw new Error(`Expected 400 Bad Request, got ${invalidRes3.status}`);
  }

  // 8. Test DELETE /api/snippets/:id
  console.log(`\nStep 8: DELETE /api/snippets/${snippetId}...`);
  const deleteRes = await makeRequest('DELETE', `/api/snippets/${snippetId}`);
  console.log(`Status: ${deleteRes.status} (Expected: 204)`);
  if (deleteRes.status !== 204) {
    throw new Error(`Failed to delete snippet: expected 204, got ${deleteRes.status}`);
  }

  // Verify deletion
  console.log(`Verifying deletion: GET /api/snippets/${snippetId}...`);
  const getDeletedRes = await makeRequest('GET', `/api/snippets/${snippetId}`);
  console.log(`Status: ${getDeletedRes.status} (Expected: 404)`);
  if (getDeletedRes.status !== 404) {
    throw new Error(`Expected snippet to be deleted (404), but got status ${getDeletedRes.status}`);
  }

  console.log('\n=== ALL SPRINT-3 SMOKE TESTS PASSED SUCCESSFULLY! ===');
  
  const rawSummary = {
    tagsCreated: tags,
    snippetIdCreated: snippetId,
    crudStatus: 'ALL PASSED',
    validationChecks: 'ALL PASSED'
  };
  console.log('\nRaw summary output:');
  console.log(JSON.stringify(rawSummary, null, 2));
}

runSmokeTest()
  .catch((err) => {
    console.error('\nSMOKE TEST FAILED:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
