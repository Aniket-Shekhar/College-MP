const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createApp } = require('../src/app');
const User = require('../src/models/User');

describe('Authentication API', () => {
  let app;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://127.0.0.1:27017/casefile_test');
    app = createApp();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Test1234',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.passwordHash).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      const hashedPassword = await bcrypt.hash('Test1234', 12);
      await User.create({
        username: 'existing',
        email: 'test@example.com',
        passwordHash: hashedPassword,
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'newuser',
          email: 'test@example.com',
          password: 'Test1234',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EMAIL_EXISTS');
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'weak',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Test1234', 12);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: hashedPassword,
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test1234',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should reject invalid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Test1234', 12);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: hashedPassword,
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const hashedPassword = await bcrypt.hash('Test1234', 12);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: hashedPassword,
      });

      const agent = request.agent(app);

      // Login first
      await agent.post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'Test1234',
      });

      // Get current user
      const response = await agent.get('/api/v1/auth/me');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should reject unauthenticated request', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout authenticated user', async () => {
      const hashedPassword = await bcrypt.hash('Test1234', 12);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: hashedPassword,
      });

      const agent = request.agent(app);

      // Login first
      await agent.post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'Test1234',
      });

      // Logout
      const response = await agent.post('/api/v1/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify session is destroyed
      const meResponse = await agent.get('/api/v1/auth/me');
      expect(meResponse.status).toBe(401);
    });
  });
});
