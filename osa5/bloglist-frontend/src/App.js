import React, { useState, useEffect, useRef } from 'react'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      } catch (exception) {
        console.log(exception)
      }
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleAddBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      const userWithUsername = {
        username: user.username,
        name: user.name,
        id: blog.user,
      }
      blog.user = userWithUsername
      setBlogs((cur) => [...cur, blog])
      setNotification(`new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      console.log(exception.response)
    }
  }
  const handleUpdateBlog = async (blogObject, id) => {
    try {
      const blog = await blogService.update(blogObject, id)
      setBlogs((currentBlogs) =>
        currentBlogs.map((b) => (b.id === blog.id ? blog : b))
      )
    } catch (exception) {
      console.log(exception.response)
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog.id !== id))
    } catch (exception) {
      console.log(exception.response)
    }
  }
  if (user === null) {
    return (
      <LoginForm
        errorMessage={errorMessage}
        username={username}
        password={password}
        handleLogin={handleLogin}
        handleUsernameChange={handleUsernameChange}
        handlePasswordChange={handlePasswordChange}
      />
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      {notification ? <div className="notification">{notification}</div> : null}
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createNewBlog={handleAddBlog} />
      </Togglable>
      {blogs
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={handleUpdateBlog}
            deleteBlog={handleDeleteBlog}
            loggedUser={user}
          />
        ))
        .sort((a, b) => b.props.blog.likes - a.props.blog.likes)}
    </div>
  )
}

export default App
