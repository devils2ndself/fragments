const request = require('supertest');

const app = require('../../src/app');
const hash = require('../../src/hash');

describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/123/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/123/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a created fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send(Buffer.from('Test'));
    const res = await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id + '/info')
      .auth('user1@email.com', 'password1')
      .expect(200);
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

  test('non-existent fragments return 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/123/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
