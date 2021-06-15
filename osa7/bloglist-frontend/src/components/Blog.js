import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import {
  updateBlog,
  removeBlog,
  createBlogComment,
} from '../reducers/blogReducer'
import { useParams } from 'react-router'
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Divider,
  Card,
} from '@material-ui/core'
import { ThumbUp } from '@material-ui/icons'

const Blog = ({ blogs, loggedUser }) => {
  const dispatch = useDispatch()

  const [blog, setBlog] = useState(null)
  const [newComment, setNewComment] = useState('')

  const id = useParams().id

  useEffect(() => {
    setBlog(blogs.find((blog) => blog.id === id))
  }, [blogs])

  if (!blog) return null

  const addLike = () => {
    dispatch(
      updateBlog(
        {
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes + 1,
          user: blog.user,
        },
        blog.id
      )
    )
  }
  const addComment = (e) => {
    e.preventDefault()
    dispatch(createBlogComment(blog.id, newComment))
  }
  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id))
    }
  }

  return (
    <div className="blog-item">
      <Card variant="outlined">
        <div>
          <Typography variant="h2">{blog.title}</Typography>
          <Typography variant="h5"> by {blog.author}</Typography>
        </div>
        <div className="blogFullInfo">
          <Typography component="div" variant="subtitle1" className="blogUrl">
            <a href={blog.url} target="_blank" rel="noreferrer">
              {blog.url}
            </a>
          </Typography>
          <div className="blogLikes">
            <Typography variant="body1" style={{ marginTop: 16 }}>
              likes {blog.likes}
            </Typography>
            <Typography variant="body1">
              <Button
                color="primary"
                onClick={addLike}
                className="likeButton"
                size="small"
              >
                <ThumbUp fontSize="large"></ThumbUp>
              </Button>
            </Typography>
          </div>
          <Typography variant="caption">Added by {blog.user.name}</Typography>
        </div>
      </Card>
      <form onSubmit={addComment}>
        <Typography variant="h6" color="primary" style={{ marginTop: 128 }}>
          Comments
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          type="text"
          name="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </form>
      <Button
        color="primary"
        variant="outlined"
        type="submit"
        style={{ marginBottom: 64 }}
      >
        Add comment
      </Button>
      <List>
        {blog.comments &&
          blog.comments.map((comment) => (
            <div key={comment._id}>
              <ListItem>
                <Typography>{comment.text}</Typography>
              </ListItem>
              <Divider></Divider>
            </div>
          ))}
      </List>
      {blog.user.username === loggedUser.username && (
        <Button
          variant="contained"
          color="secondary"
          className="removeButton"
          onClick={deleteBlog}
        >
          remove blog
        </Button>
      )}
    </div>
  )
}

Blog.propTypes = {
  blogs: PropTypes.array.isRequired,
  loggedUser: PropTypes.object,
  updateBlog: PropTypes.func,
  deleteBlog: PropTypes.func,
}

export default Blog
