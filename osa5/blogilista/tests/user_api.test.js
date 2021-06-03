const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

describe('when one user initially exists in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('passw0rd', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('should create new user with unique username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'villej',
      name: 'Ville Jussila',
      password: 'salasana',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('when multiple users exist in db', () => {
  test('should return all users as json', async () => {
    const usersAtStart = await helper.usersInDb()
    const result = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body).toHaveLength(usersAtStart.length)
  })
  describe('when creating new user', () => {
    test('should create new user with unique username', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'test123',
        name: 'test person',
        password: 'testtest',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).toContain(newUser.username)
    })
    test('should fail with proper status code and message when creating new user when username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
      const duplicateUser = {
        username: 'villej',
        name: 'something',
        password: 'yesyesyes',
      }

      const result = await api
        .post('/api/users')
        .send(duplicateUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('should fail with proper status code and message when creating new user without username', async () => {
      const usersAtStart = await helper.usersInDb()
      const invalidUser = {
        name: 'Someone',
        password: 'dontlook',
      }

      const result = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body.error).toContain('username is required')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('should fail with proper status code and message when creating new user without password', async () => {
      const usersAtStart = await helper.usersInDb()
      const invalidUser = {
        name: 'Someone',
        username: 'user_name',
      }

      const result = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body.error).toContain('password is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).not.toContain(invalidUser.username)
    })
    test('should fail with proper status code and message when creating new user and username is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
      const invalidUser = {
        username: 'vj',
        name: 'Ville Jussila',
        password: 'password123',
      }
      const result = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body.error).toContain(
        'username must be 3 characters or longer'
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).not.toContain(invalidUser.username)
    })
    test('should fail with proper status code and message when creating new user and password is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
      const invalidUser = {
        username: 'vj123',
        name: 'Ville Jussila',
        password: '12',
      }
      const result = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body.error).toContain(
        'password must be 3 characters or longer'
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).not.toContain(invalidUser.username)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
