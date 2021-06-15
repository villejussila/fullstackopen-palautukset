const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map((blog) => blog.toJSON()))
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  if (!body) return response.status(400).end()
  if (!body.title || !body.url) return response.status(400).end()
  if (!request.token || !request.user._id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes ? body.likes : 0,
    user: user,
    url: body.url,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  if (!request.token || !request.user._id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === user._id.toString()) {
    await blog.remove()
    user.blogs = user.blogs.filter(
      (b) => b.toString() !== request.params.id.toString()
    )
    await user.save()
    return response.status(204).end()
  }
  response.status(401).json({ error: 'wrong user id' })
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  if (!body) return response.status(400).end()
  if (!body.title || !body.url) return response.status(400).end()
  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedBlog.toJSON())
})
blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  if (!body.text) return response.status(400).end()
  const comment = { text: body.text }
  const blog = await Blog.findById(request.params.id)
  blog.comments = blog.comments.concat(comment)
  const updated = await blog.save()
  response.status(201).json(updated.toJSON())
})

module.exports = blogsRouter
