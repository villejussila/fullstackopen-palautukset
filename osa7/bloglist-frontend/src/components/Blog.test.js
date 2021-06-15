import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    user: { name: 'test user', username: 'test username', id: 'test_id' },
  }

  const user = { username: 'test username', name: 'test name' }

  beforeEach(() => {
    component = render(<Blog blog={blog} loggedUser={user} />)
  })

  test('renders title and author', () => {
    expect(component.container).toHaveTextContent('test title test author')
    expect(component.container).not.toHaveTextContent('url')
  })
  test('renders url and likes when view clicked', () => {
    const viewButton = component.getByText('view')

    fireEvent.click(viewButton)

    const url = component.container.querySelector('.blogUrl')
    const likes = component.container.querySelector('.blogLikes')

    expect(url).toHaveTextContent('test url')
    expect(likes).toHaveTextContent('likes')
  })
  test('clicking like twice calls event handler twice', () => {
    const mockHandler = jest.fn()

    component = render(
      <Blog blog={blog} loggedUser={user} updateBlog={mockHandler} />
    )
    const viewButton = component.container.querySelector('.viewButton')

    fireEvent.click(viewButton)

    const likeButton = component.container.querySelector('.likeButton')

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
