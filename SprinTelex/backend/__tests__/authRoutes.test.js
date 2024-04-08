const supertest = require('supertest');
const app = require('../index'); // Ensure this path matches the entry point of your Express app
const User = require('../models/User');

jest.mock('../models/User'); // Mock the User model

describe('POST /api/auth/signin', () => {
  it('should sign in a user with correct credentials', async () => {
    // Mock User.findOne to simulate finding a user
    User.findOne.mockResolvedValue({
      _id: 'user123',
      email: 'test@example.com',
      password: '$2a$10$examplehashedpassword', // This should be a bcrypt hashed password
      comparePassword: () => true // Simulate password comparison
    });

    const response = await supertest(app)
      .post('/api/auth/signin')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    console.log('Sign-in test with correct credentials passed.');
  });

  it('should return an error for incorrect password', async () => {
    User.findOne.mockResolvedValue({
      _id: 'user123',
      email: 'test@example.com',
      password: '$2a$10$examplehashedpassword',
      comparePassword: () => false // Simulate password comparison failure
    });

    const response = await supertest(app)
      .post('/api/auth/signin')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toMatch(/invalid credentials/i);
    console.log('Sign-in test with incorrect password passed.');
  });

  it('should return an error for non-existent user', async () => {
    User.findOne.mockResolvedValue(null); // Simulate user not found

    const response = await supertest(app)
      .post('/api/auth/signin')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/user not found/i);
    console.log('Sign-in test for non-existent user passed.');
  });
});