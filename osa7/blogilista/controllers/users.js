const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0 })
  response.json(users.map((user) => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body) return response.status(400).end()
  if (!body.username) {
    return response.status(400).json({ error: 'username is required' })
  }
  if (!body.password) {
    return response.status(400).json({ error: 'password is required' })
  }
  if (body.username.length < 3) {
    return response
      .status(400)
      .json({ error: 'username must be 3 characters or longer' })
  }
  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be 3 characters or longer' })
  }
  const saltRounds = 10

  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
