import App from './App'
import React from 'react'
import 'jest-dom/extend-expect'
import { render } from '@testing-library/react'
jest.mock('./services/blogs')

describe('<App />', () => {

  test('does not render blogs if no user logged in', async () => {
    const component = render(
      <App />
    )
    component.debug()
    component.rerender(<App />)
    const login = component.container.querySelector('.login-frame')
    const blogs = component.container.querySelectorAll('.table-frame')
    expect(login).toBeDefined()
    expect(blogs.length).toBe(0)
  })
})


