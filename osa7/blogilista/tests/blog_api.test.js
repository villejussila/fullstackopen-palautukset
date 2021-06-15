const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

let TOKEN = ''
let loggedInUserId = ''

describe('when blogs exist initially', () => {
  beforeAll(async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'passw0rd' })
    TOKEN = result.body.token
  })
  beforeEach(async () => {
    await Blog.deleteMany({})
    const users = await helper.usersInDb()
    const user = users.find((u) => u.username === 'root')
    loggedInUserId = user.id
    helper.initialBlogs[0].user = loggedInUserId
    await Blog.insertMany(helper.initialBlogs)
  })

  test('all blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have no _id field', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body._id).not.toBeDefined
  })

  test('blogs have id field', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.id).toBeDefined
  })
  describe('Addition of new blog', () => {
    test('valid blog can be added', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
        userId: loggedInUserId,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    })
    test('blog without token is not added and returns 401', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
        userId: loggedInUserId,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${null}`)
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
    test('blog without likes is addded and likes set to 0', async () => {
      const newBlog = {
        title: 'test',
        author: 'me',
        url: 'www.google.com',
        userId: loggedInUserId,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(newBlog)
        .expect(201)
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      const addedBlog = blogsAtEnd[blogsAtEnd.length - 1]
      expect(addedBlog.likes).toBe(0)
    })

    test('blog without url is not added and returns status code 400', async () => {
      const newBlog = {
        title: 'test',
        author: 'me',
        likes: 10000,
        userId: loggedInUserId,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(newBlog)
        .expect(400)
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without title is not added and returns status code 400', async () => {
      const newBlog = {
        author: 'me',
        likes: 10000,
        url: 'www.google.com',
        userId: loggedInUserId,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(newBlog)
        .expect(400)
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })
  describe('deletion of blog', () => {
    test('blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const authors = blogsAtEnd.map((blog) => blog.author)
      expect(authors).not.toContain(blogToDelete.author)
    })
  })
  describe('updating blog', () => {
    test('blog can be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updateBlog = {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7000,
      }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updated = blogsAtEnd[0]
      expect(updated).toHaveProperty('likes', updateBlog.likes)
    })
  })
})
afterAll(() => {
  mongoose.connection.close()
})
