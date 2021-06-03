import React, { useState } from 'react'

const BlogForm = ({ createNewBlog }) => {
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
    createNewBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    })
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={newBlogTitle}
            name="Title"
            onChange={handleNewBlogTitle}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={newBlogAuthor}
            name="Author"
            onChange={handleNewBlogAuthor}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={newBlogUrl}
            name="Url"
            onChange={handleNewBlogUrl}
          />
        </div>
        <button id="submit-button" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
