import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component
  test('On form submit parent callback function gets the right content', () => {
    const createBlog = jest.fn()
    component = render(<BlogForm createNewBlog={createBlog} />)
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'test title' },
    })
    fireEvent.change(author, {
      target: { value: 'test author' },
    })
    fireEvent.change(url, {
      target: { value: 'test url' },
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('test title')
    expect(createBlog.mock.calls[0][0].author).toBe('test author')
    expect(createBlog.mock.calls[0][0].url).toBe('test url')
  })
})
