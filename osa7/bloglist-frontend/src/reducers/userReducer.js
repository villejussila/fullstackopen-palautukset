import blogService from '../services/blogs'
import loginService from '../services/login'
import { setNotification } from './notificationReducer'

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'LOGGED_USER':
      return action.data
    default:
      return state
  }
}

export const setLoggedUserFromLocalStorage = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({ type: 'LOGGED_USER', data: user })
    }
  }
}
export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username: credentials.username,
        password: credentials.password,
      })
      if (user) {
        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
        blogService.setToken(user.token)
        dispatch({ type: 'LOGGED_USER', data: user })
        dispatch(
          setNotification(
            {
              text: `${credentials.username} logged in`,
              isError: false,
            },
            5
          )
        )
      }
    } catch (error) {
      dispatch(
        setNotification({ text: error.response.data.error, isError: true }, 5)
      )
    }
  }
}
export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch({ type: 'LOGGED_USER', data: null })
  }
}

export default reducer
