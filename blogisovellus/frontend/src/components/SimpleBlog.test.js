import React from 'react'
import 'jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

let component

const blog = {
  title: 'Testi',
  author: 'Tekijä',
  likes: 2
}

const mockHandler = jest.fn()

describe('<SimpleBlog /> content', () => {
  beforeEach(() => {
    component = render(
      <SimpleBlog blog={blog} onClick={mockHandler} />
    )
  })

  test('renders title and author', () => {
    const div = component.container.querySelector('.info')
    expect(div).toHaveTextContent('Testi' && 'Tekijä')
  })

  test('render likes', () => {
    const div = component.container.querySelector('.likes')
    expect(div).toHaveTextContent('2')
  })

  test('clicking button adds to likes', async () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls.length).toBe(2)
  })

})

