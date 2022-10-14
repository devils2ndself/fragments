// Your unit tests should include test cases for everything in the spec. Some examples to consider:
// -authenticated vs unauthenticated requests (use HTTP Basic Auth, don't worry about Cognito in tests)
// -authenticated users can create a plain text fragment
// -responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
// -responses include a Location header with a URL to GET the fragment
// -trying to create a fragment with an unsupported type errors as expected

const request = require('supertest');

const app = require('../../src/app');
const hash = require('../../src/hash');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can create text/plain fragments', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send(Buffer.from('Test'));
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toMatch(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    );
    expect(res.body.fragment.ownerId).toBe(hash('user1@email.com'));
    expect(res.body.fragment.size).toBeGreaterThan(0);
    expect(res.body.fragment.type).toBe('text/plain');
    expect(Date.parse(res.body.fragment.created)).not.toBeNaN();
    expect(Date.parse(res.body.fragment.updated)).not.toBeNaN();
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
