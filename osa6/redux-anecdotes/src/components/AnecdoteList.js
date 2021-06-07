import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes)
  const filter = useSelector((state) => state.filter)
  const dispatch = useDispatch()
  const vote = (id) => {
    const anecdote = anecdotes.find((a) => a.id === id)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }
  return (
    <div>
      {anecdotes
        .map((anecdote) => {
          let anecdoteText = anecdote.content
          return !filter ? (
            <div key={anecdote.id}>
              <div>{anecdote.content}</div>
              <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
              </div>
            </div>
          ) : (
            anecdoteText.toLowerCase().includes(filter) && (
              <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                  has {anecdote.votes}
                  <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
              </div>
            )
          )
        })
        .sort((a, b) => {
          if (a.props && b.props) {
            const votesA = a.props.children[1].props.children[1]
            const votesB = b.props.children[1].props.children[1]
            return votesB - votesA
          }
          return null
        })}
    </div>
  )
}

export default AnecdoteList
