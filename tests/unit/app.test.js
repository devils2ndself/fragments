const request = require('supertest');

const app = require('../../src/app');

describe('app.js middleware', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/something');
    expect(res.statusCode).toBe(404);
  });
});
