const initialState = {
  showNotification: false,
  text: '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { ...state, showNotification: true, text: action.data }
    case 'REMOVE_NOTIFICATION':
      return { ...state, showNotification: false, text: '' }
    default:
      return state
  }
}

let timeoutID
export const setNotification = (text, timeInSeconds) => {
  const timeInMs = timeInSeconds * 1000
  const clear = () => {
    clearTimeout(timeoutID)
  }
  return async (dispatch) => {
    dispatch({ type: 'SHOW_NOTIFICATION', data: text })
    if (timeoutID) {
      clear()
    }
    timeoutID = setTimeout(() => {
      dispatch(clearNotification())
    }, timeInMs)
  }
}
export const clearNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
  }
}

export default reducer
