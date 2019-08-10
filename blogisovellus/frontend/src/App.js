import React, { useState, useEffect } from 'react'
import Menu from './components/Menu'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import commentService from './services/comments'
import useField from './hooks/index'

const App = () => {

  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [registrationVisible, setRegistrationVisible] = useState(false)
  const [username, usernameReset] = useField('text')
  const [password, passwordReset] = useField('password')
  const [name, nameReset] = useField('text')

  useEffect(() => {
    console.log('loggedIn effect')
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      userService.setToken(user.token)
      commentService.setToken(user.token)
    }
  }, [])

  const handleRegistration = async (event) => {
    event.preventDefault()
    try {
      const newUser = {
        username: username.value,
        name: name.value,
        password: password.value
      }
      const result = await userService.create(newUser)
      if (result) {
        setNotification('Onnistui!')
        setTimeout(() => { setNotification(null) }, 5000)
        usernameReset()
        nameReset()
        passwordReset()
      }
    } catch (exception) {
      console.log('Jotain meni pieleen. :(')
      await setErrorMessage('Täytäthän kaikki kentät.')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value, password: password.value
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      usernameReset()
      passwordReset()
    } catch (error) {
      await setErrorMessage('Käyttäjätunnus tai salasana on virheellinen.')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const showBlogs = (user) => {
    return (
      <>
        <Menu
          user={user}
          setUser={setUser}
          username={user.username}
          setLoginVisible={setLoginVisible}
          setErrorMessage={setErrorMessage}
          setNotification={setNotification}
        />
      </>
    )
  }

  const handleLoginVisible = () => {
    setLoginVisible(true)
    setRegistrationVisible(false)
  }

  const handleRegistrationVisible = () => {
    setRegistrationVisible(true)
    setLoginVisible(false)
  }

  const showLoginForm = () => {
    const hide = { display: loginVisible ? 'none' : '' }
    const show = { display: loginVisible ? '' : 'none' }
    const hideRegistration = { display: registrationVisible ? 'none' : '' }
    const showRegistration = { display: registrationVisible ? '' : 'none' }
    return (
      <>
        <h1 id="move-text">Parhaat nettisivut</h1>
        <p style={hide}>
          <button onClick={handleLoginVisible}>Kirjaudu sisään</button>
        </p>
        <div style={show}>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
          />
          <button onClick={() => setLoginVisible(false)}>Peruuta</button>
        </div>
        <p style={hideRegistration}>
          <button onClick={handleRegistrationVisible}>Rekisteröidy</button>
        </p>
        <div style={showRegistration}>
          <RegistrationForm
            handleRegistration={handleRegistration}
            name={name}
            username={username}
            password={password}
          />
          <button onClick={() => setRegistrationVisible(false)}>Peruuta</button>
        </div>
      </>
    )
  }

  return (
    <>
      <div><Notification message={errorMessage} type="error" /></div>
      <div><Notification message={notification} type="notification" /></div>

      {user === null ? showLoginForm() : showBlogs(user)}

    </>
  )
}

export default App
