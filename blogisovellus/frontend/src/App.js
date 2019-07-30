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
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
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

  useEffect(() => {
    console.log('blogs effect')
    blogService
      .getAll()
      .then(initialBlogs => {
        console.log('blogs promise fulfilled')
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    console.log('users effect')
    userService
      .getAll()
      .then(initialUsers => {
        console.log('users promise fulfilled')
        setUsers(initialUsers)
      })
  }, [blogs])

  const handleVote = (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id)
    let updatedBlog = blogToUpdate
    const currentUser = user.username
    const userToUpdate = users.find(u => u.username === user.username)
    const usersBlogs = userToUpdate.blogs.map(blog => blog.id)
    let updatedUser = userToUpdate
    let newLikes = blogToUpdate.likes
    let newFans = blogToUpdate.fans
    let newLikedBlogs = blogToUpdate.likedBlogs
    try {
      if (blogToUpdate.fans.find(fan => fan === currentUser)) {
        newLikes = blogToUpdate.likes - 1
        newFans = blogToUpdate.fans.filter(f => f !== currentUser)
        updatedBlog = { ...blogToUpdate, likes: newLikes, fans: newFans }
        newLikedBlogs = userToUpdate.likedBlogs.filter(blog => blog.id !== blogToUpdate.id)
      } else {
        newLikes = blogToUpdate.likes + 1
        newFans = blogToUpdate.fans.concat(currentUser)
        updatedBlog = { ...blogToUpdate, likes: newLikes, fans: newFans }
        newLikedBlogs = userToUpdate.likedBlogs.concat(blogToUpdate)
      }
    } catch (error) {
      console.log(error)
    }
    try {
      const likedBlogs = newLikedBlogs.map(blog => blog.id)
      updatedUser = { ...userToUpdate, blogs: usersBlogs, likedBlogs: likedBlogs }
      blogService
        .update(blogToUpdate.id, updatedBlog)
        .then(returnedBlog => {
          setBlogs(blogs.map(blog => blog.id !== blogToUpdate.id ? blog : returnedBlog))
        })
      userService
        .update(userToUpdate.id, updatedUser)
        .then(returnedUser => {
          setUsers(users.map(u => u.id !== userToUpdate.id ? u : returnedUser))
        })
    } catch (exception) {
      console.log('Ei onnistunut.', JSON.stringify(exception))
    }
    blogService
      .getAll()
      .then(initialBlogs => {
        console.log('blogs promise fulfilled')
        setBlogs(initialBlogs)
      })
    userService.getAll()
      .then(response => {
        console.log('users promise fulfilled')
        setUsers(response)
      })
  }

  const handleRemove = async (id) => {
    const blogInQuestion = await blogs.find(blog => blog.id === id)
    const userToUpdate = users.find(u => u.username === user.username)
    const newBlogs = userToUpdate.blogs.filter(blog => blog.id !== blogInQuestion.id).map(blog => blog.id)
    const newLikedBlogs = userToUpdate.likedBlogs.map(blog => blog.id)
    const updatedUser = { ...userToUpdate, blogs: newBlogs, likedBlogs: newLikedBlogs }
    if (window.confirm(`Haluatko varmasti poistaa kohteen ${blogInQuestion.title}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        const returnedUser = await userService.update(userToUpdate.id, updatedUser)
        setUsers(users.map(u => u.id !== userToUpdate ? u : returnedUser))
      } catch (exception) {
        console.log('Poistaminen ei onnistunut.')
        await setErrorMessage('Poistaminen ei onnistunut.')
        setTimeout(() => { setErrorMessage(null) }, 5000)
      }
    }
  }

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
        setUsers(users.concat(result))
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

  const handleLogout = async () => {
    try {
      await window.localStorage.clear()
      setUser(null)
      setLoginVisible(false)
    } catch (exception) {
      console.log('Ei onnistunut!')
      await setErrorMessage('Jotain meni pieleen. :(')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const handleAddBlog = async (blog) => {
    try {
      const response = await blogService.create(blog)
      setBlogs(blogs.concat(response))
    } catch (exception) {
      console.log('Uuden blogin luominen ei onnistunut.')
      await setErrorMessage('Uuden sivun lisääminen luetteloon ei onnistunut.')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
    await setNotification(`Luetteloon lisättiin sivu ${blog.title} (tekijä: ${blog.author}).`)
    setTimeout(() => { setNotification(null) }, 5000)
  }

  const showBlogs = (user) => {
    return (
      <>
        <Menu
          users={users}
          blogs={blogs}
          user={user}
          username={user.username}
          handleVote={handleVote}
          handleRemove={handleRemove}
          handleLogout={() => handleLogout()}
          handleAddBlog={handleAddBlog}
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
