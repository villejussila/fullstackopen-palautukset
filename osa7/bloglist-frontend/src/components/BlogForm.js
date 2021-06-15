import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Button, TextField, Typography } from '@material-ui/core'

const BlogForm = ({ toggleFormVisibility }) => {
  const dispatch = useDispatch()
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const handleNewBlogTitle = (e) => {
    setNewBlogTitle(e.target.value)
  }
  const handleNewBlogAuthor = (e) => {
    setNewBlogAuthor(e.target.value)
  }
  const handleNewBlogUrl = (e) => {
    setNewBlogUrl(e.target.value)
  }
  const addBlog = (e) => {
    e.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    }
    try {
      dispatch(createBlog(blogObject))
      dispatch(
        setNotification(
          {
            text: `new blog ${blogObject.title} by ${blogObject.author} added`,
            isError: false,
          },
          5
        )
      )
      toggleFormVisibility()
    } catch (exception) {
      console.log(exception)
    }
  }
  return (
    <div>
      <Typography variant="h5">Create new</Typography>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            fullWidth
            variant="outlined"
            id="title"
            type="text"
            value={newBlogTitle}
            name="Title"
            label="Title"
            onChange={handleNewBlogTitle}
          />
        </div>
        <div>
          <TextField
            fullWidth
            id="author"
            variant="outlined"
            type="text"
            value={newBlogAuthor}
            name="Author"
            label="Author"
            onChange={handleNewBlogAuthor}
          />
        </div>
        <div>
          <TextField
            fullWidth
            id="url"
            variant="outlined"
            type="text"
            value={newBlogUrl}
            name="Url"
            label="url"
            onChange={handleNewBlogUrl}
          />
        </div>
        <Button
          id="submit-button"
          type="submit"
          variant="contained"
          color="primary"
        >
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
