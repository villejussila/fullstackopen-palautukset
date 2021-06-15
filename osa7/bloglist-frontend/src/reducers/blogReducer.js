import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'
import { logoutUser } from './userReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_BLOG':
      return [...state, action.data]
    case 'UPDATE_BLOG':
      return state.map((blog) =>
        blog.id !== action.data.id
          ? blog
          : { ...blog, likes: action.data.likes }
      )
    case 'ADD_BLOG_COMMENT':
      return state.map((blog) =>
        blog.id !== action.data.id
          ? blog
          : { ...blog, comments: action.data.comments }
      )
    case 'DELETE_BLOG':
      return state.filter((blog) => blog.id !== action.data)
    case 'INIT_BLOGS':
      return action.data
    default:
      return state
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch({ type: 'CREATE_BLOG', data: newBlog })
      dispatch(
        setNotification(
          {
            text: `new blog ${blog.title} by ${blog.author} added`,
            isError: false,
          },
          5
        )
      )
    } catch (exception) {
      console.log(exception.response)
      if (exception.response.data.error === 'token expired') {
        dispatch(logoutUser())
      }
    }
  }
}

export const updateBlog = (blog, id) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blog, id)
    dispatch({ type: 'UPDATE_BLOG', data: updatedBlog })
  }
}

export const createBlogComment = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(id, comment)
    dispatch({ type: 'ADD_BLOG_COMMENT', data: updatedBlog })
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({ type: 'DELETE_BLOG', data: id })
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({ type: 'INIT_BLOGS', data: blogs })
  }
}

export default reducer
