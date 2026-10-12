process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret123456789012345678901234';

const os = require('os');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const Progress = require('../src/models/Progress');

const testDbUri = process.env.MONGO_URI_TEST;
if (!testDbUri) {
  throw new Error('MONGO_URI_TEST environment variable is required for tests and is not set.');
}

describe('Progress Endpoints', () => {
  let userAToken = '';
  let userBToken = '';
  let userARecordId = '';

  beforeAll(async () => {
    await mongoose.connect(testDbUri, { runtimeAdapters: { os } });

    // Register User A
    const resA = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User A',
        email: `usera_${Date.now()}@example.com`,
        password: 'Password123!',
      });
    userAToken = resA.body.token;

    // Register User B
    const resB = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User B',
        email: `userb_${Date.now()}@example.com`,
        password: 'Password123!',
      });
    userBToken = resB.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /user[ab]_/ } });
    await Progress.deleteMany({});
    await mongoose.disconnect();
  });

  // 1. creating a record as user A returns 201
  it('creating a record as user A returns 201', async () => {
    const res = await request(app)
      .post('/api/progress/add')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        weight: 80,
        notes: 'User A original notes',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.weight).toBe(80);
    userARecordId = res.body._id;
  });

  // 2. user B cannot update user A's record (404)
  it("user B cannot update user A's record (404)", async () => {
    const res = await request(app)
      .put(`/api/progress/${userARecordId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .send({
        weight: 70,
        notes: 'Malicious update attempt',
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Record not found');
  });

  // 3. user B cannot delete user A's record (404)
  it("user B cannot delete user A's record (404)", async () => {
    const res = await request(app)
      .delete(`/api/progress/${userARecordId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Record not found');
  });

  // 4. user A's record still exists afterwards
  it("user A's record still exists afterwards", async () => {
    const res = await request(app)
      .get('/api/progress/my')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((r) => r._id === userARecordId);
    expect(found).toBeDefined();
    expect(found.weight).toBe(80);
    expect(found.notes).toBe('User A original notes');
  });
});
