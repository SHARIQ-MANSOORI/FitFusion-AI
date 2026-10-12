process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret123456789012345678901234';

const os = require('os');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');

const testDbUri = process.env.MONGO_URI_TEST;
if (!testDbUri) {
  throw new Error('MONGO_URI_TEST environment variable is required for tests and is not set.');
}

describe('Auth Endpoints', () => {
  const timestamp = Date.now();
  const validEmail = `authtest_${timestamp}@example.com`;
  const validPassword = 'Password123!';
  const validName = 'Auth Test User';
  let authToken = '';

  beforeAll(async () => {
    await mongoose.connect(testDbUri, { runtimeAdapters: { os } });
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /authtest_/ } });
    await mongoose.disconnect();
  });

  // 1. register with valid data returns 201 and a token, and the response has no password field
  it('register with valid data returns 201 and a token, with no password field', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: validName,
        email: validEmail,
        password: validPassword,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', validEmail);
    expect(res.body.user).toHaveProperty('name', validName);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.password).toBeUndefined();
    authToken = res.body.token;
  });

  // 2. registering the same email again returns 409
  it('registering the same email again returns 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: validName,
        email: validEmail,
        password: validPassword,
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Email already registered');
  });

  // 3. register with a weak password returns 400
  it('register with a weak password returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: validName,
        email: `weak_${Date.now()}@example.com`,
        password: 'weak',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  // 4. login with correct credentials returns 200 and a token
  it('login with correct credentials returns 200 and a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: validEmail,
        password: validPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', validEmail);
    expect(res.body.user.password).toBeUndefined();
  });

  // 5. login with a wrong password returns 401
  it('login with a wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: validEmail,
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  // 6. GET /api/auth/me without a token returns 401
  it('GET /api/auth/me without a token returns 401', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  // 7. GET /api/auth/me with a valid token returns 200 with the user
  it('GET /api/auth/me with a valid token returns 200 with the user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('email', validEmail);
    expect(res.body.user).toHaveProperty('name', validName);
    expect(res.body.user.password).toBeUndefined();
  });
});
