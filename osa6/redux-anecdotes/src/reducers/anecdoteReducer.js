import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE_ANECDOTE':
      return state.map((anecdote) =>
        anecdote.id !== action.data.id
          ? anecdote
          : { ...anecdote, votes: action.data.votes }
      )
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const id = anecdote.id
    const object = { content: anecdote.content, votes: anecdote.votes + 1 }
    const votedAnecdote = await anecdoteService.update(id, object)
    dispatch({ type: 'VOTE_ANECDOTE', data: votedAnecdote })
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({ type: 'NEW_ANECDOTE', data: newAnecdote })
  }
}

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({ type: 'INIT_ANECDOTES', data: anecdotes })
  }
}
export default reducer
