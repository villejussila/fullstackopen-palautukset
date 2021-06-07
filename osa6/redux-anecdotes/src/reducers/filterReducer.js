const initalState = ''

const reducer = (state = initalState, action) => {
  switch (action.type) {
    case 'FILTER_VALUE':
      return action.data

    default:
      return state
  }
}

export const filterValue = (value) => {
  return {
    type: 'FILTER_VALUE',
    data: value,
  }
}

export default reducer
