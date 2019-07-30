import App from './App'
import React from 'react'
import 'jest-dom/extend-expect'
import { render, waitForElement } from '@testing-library/react'
jest.mock('./services/blogs')

describe('<App />', () => {

  test('does not render blogs if no user logged in', async () => {
    const component = render(
      <App />
    )
    component.debug()
    component.rerender(<App />)
    /*await waitForElement(
      () => component.getByText('Foo')
    )*/
    const login = component.container.querySelector('.login-frame')
    const blogs = component.container.querySelectorAll('.table-frame')
    expect(login).toBeDefined()
    expect(blogs.length).toBe(0)
  })
/*
  test('renders blogs if user logged in', async () => {

    const user = {
      username: 'testaaja',
      token: '1234567890',
      name: 'Testaaja'
    }
    await localStorage.setItem('loggedInUser', JSON.stringify(user))

    const component = render(
      <App />
    )
    component.debug()
    component.rerender(<App />)
    await waitForElement(() => component.container.querySelector('.table-frame'))
    const blogs = component.container.querySelectorAll('.table-frame')
    expect(blogs.length).toBe(2)

  })
*/
})


