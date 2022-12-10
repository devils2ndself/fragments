const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).put('/v1/fragments/123').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .put('/v1/fragments/123')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('non-existent fragments return 404', async () => {
    const res = await request(app)
      .put('/v1/fragments/123')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send(Buffer.from('Test'));
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users can update a created fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send(Buffer.from('Test'));
    await request(app)
      .put('/v1/fragments/' + postRes.body.fragment.id)
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send(Buffer.from('Test 2'))
      .expect(200);
  });

  test('mismatched types return 415', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send(Buffer.from('Test'));
    await request(app)
      .put('/v1/fragments/' + postRes.body.fragment.id)
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/markdown' })
      .send(Buffer.from('Test 2'))
      .expect(400);
  });
});
