import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, loggedUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [viewFullInfo, setViewFullInfo] = useState(false)

  const addLike = () => {
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
  }
  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }
  return (
    <div style={blogStyle} className="blog-item">
      <div>
        {blog.title} {blog.author}
        <button
          onClick={() => setViewFullInfo((view) => !view)}
          className="viewButton"
        >
          {viewFullInfo ? 'hide' : 'view'}
        </button>
      </div>
      {viewFullInfo ? (
        <div className="blogFullInfo">
          <div className="blogUrl">{blog.url}</div>
          <div className="blogLikes">
            likes {blog.likes}{' '}
            <button onClick={addLike} className="likeButton">
              Like
            </button>{' '}
          </div>
          <div>{blog.user.name}</div>
          {blog.user.username === loggedUser.username && (
            <button className="removeButton" onClick={removeBlog}>
              remove
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  updateBlog: PropTypes.func,
  deleteBlog: PropTypes.func,
}

export default Blog
