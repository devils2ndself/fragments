// Your unit tests should include test cases for everything in the spec. Some examples to consider:
// -authenticated vs unauthenticated requests (use HTTP Basic Auth, don't worry about Cognito in tests)
// -authenticated users can create a plain text fragment
// -responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
// -responses include a Location header with a URL to GET the fragment
// -trying to create a fragment with an unsupported type errors as expected

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('authenticated users can create text/plain fragments', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send(Buffer.from('Test'));
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.size).toBeGreaterThan(0);
  });

  test('unsupported types are denied with error 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/xml' })
      .send(Buffer.from('Test'));
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });
});
