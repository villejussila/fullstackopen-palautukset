const dummy = (blogs) => {
  if (Array.isArray(blogs)) return 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return (total += blog.likes)
  }, 0)
}
const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog, idx) => {
    const returnBlog = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    }
    if (idx === 0) {
      favorite = returnBlog
      return favorite
    }
    if (blog.likes > favorite.likes) {
      favorite = returnBlog
      return favorite
    }
    return favorite
  }, {})
}

const mostBlogs = (blogs) => {
  const authors = blogs.reduce((allAuthors, blog) => {
    const author = blog.author
    if (allAuthors[author]) {
      allAuthors[author]++
    } else {
      allAuthors[author] = 1
    }
    return allAuthors
  }, {})
  return Object.entries(authors).reduce(
    (mostBlogs, authorAndBlogCount, idx) => {
      const author = authorAndBlogCount[0]
      const blogs = authorAndBlogCount[1]
      if (idx === 0) {
        mostBlogs = { author: author, blogs: blogs }
        return mostBlogs
      }
      if (blogs > mostBlogs.blogs) {
        mostBlogs = { author: author, blogs: blogs }
        return mostBlogs
      }
      return mostBlogs
    },
    {}
  )
}

const mostLikes = (blogs) => {
  const authors = blogs.reduce((allAuthors, blog) => {
    const author = blog.author
    const likes = blog.likes
    if (allAuthors[author]) {
      allAuthors[author] += likes
    } else {
      allAuthors[author] = likes
    }
    return allAuthors
  }, {})
  return Object.entries(authors).reduce(
    (mostLikes, authorAndLikeCount, idx) => {
      const author = authorAndLikeCount[0]
      const likes = authorAndLikeCount[1]
      if (idx === 0) {
        mostLikes = { author: author, likes: likes }
        return mostLikes
      }
      if (likes > mostLikes.likes) {
        mostLikes = { author: author, likes: likes }
        return mostLikes
      }
      return mostLikes
    },
    {}
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
