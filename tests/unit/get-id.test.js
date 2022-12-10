const request = require('supertest');
const fs = require('fs');
const app = require('../../src/app');
var path = require('path');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/123').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/123')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a created fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send(Buffer.from('Test'));
    await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id)
      .auth('user1@email.com', 'password1')
      .expect('Content-Type', /text/)
      .expect(200);
  });

  test('authenticated users can get type-parsed fragments', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/markdown' })
      .send(Buffer.from('# Test'));
    await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id + '.html')
      .auth('user1@email.com', 'password1')
      .expect('Content-Type', /text\/html/)
      .expect(200);
  });

  test('type is not changed if fetched as it is', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/markdown' })
      .send(Buffer.from('# Test'));
    await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id + '.md')
      .auth('user1@email.com', 'password1')
      .expect('Content-Type', /text\/markdown/)
      .expect(200);
  });

  test('text types can be parsed into txt', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/markdown' })
      .send(Buffer.from('# Test'));
    await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id + '.txt')
      .auth('user1@email.com', 'password1')
      .expect('Content-Type', /text\/plain/)
      .expect(200);
  });

  test('image types can be parsed into other image types', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../image.jpg'));
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'image/jpeg' })
      .send(buffer);
    await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id + '.png')
      .auth('user1@email.com', 'password1')
      .expect('Content-Type', /image\/png/)
      .expect(200);
    await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id + '.gif')
      .auth('user1@email.com', 'password1')
      .expect('Content-Type', /image\/gif/)
      .expect(200);
    await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id + '.webp')
      .auth('user1@email.com', 'password1')
      .expect('Content-Type', /image\/webp/)
      .expect(200);
  });

  test('unsupported formats return 415', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/markdown' })
      .send(Buffer.from('# Test'));
    await request(app)
      .get('/v1/fragments/' + postRes.body.fragment.id + '.test')
      .auth('user1@email.com', 'password1')
      .expect(415);
  });

  test('non-existent fragments return 404', async () => {
    const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
