import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom'
import Users from './Users'
import Blogs from './Blogs'
import userService from '../services/users'
import blogService from '../services/blogs'
import BlogFormWithoutHistory from './BlogForm'
import Logout from './Logout'
import { UserInfo } from './User'
import { BlogInfo } from './Blog'

const Menu = ({ user, setUser, username, setLoginVisible, setErrorMessage, setNotification }) => {

  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])

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
  }, [])



  const handleVote = (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id)
    try {
      if (blogToUpdate.fans.find(fan => fan === user.username)) {
        decreaseVotes(id)
      } else {
        increaseVotes(id)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const increaseVotes = (id) => {
    const findUser = users.find(u => u.username === user.username)
    userService.getOne(findUser.id).then(result => {
      const userToUpdate = result
      const blogToUpdate = blogs.find(blog => blog.id === id)
      const usersBlogs = userToUpdate.blogs.map(blog => blog.id)
      const newLikes = blogToUpdate.likes + 1
      const newFans = blogToUpdate.fans.concat(user.username)
      const updatedBlog = { ...blogToUpdate, likes: newLikes, fans: newFans }
      const newLikedBlogs = userToUpdate.likedBlogs.concat(blogToUpdate)
      try {
        const likedBlogs = newLikedBlogs.map(blog => blog.id)
        const updatedUser = { ...userToUpdate, blogs: usersBlogs, likedBlogs: likedBlogs }
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
        console.log('Tykkääminen ei onnistunut.', JSON.stringify(exception))
      }
    })
  }

  const decreaseVotes = (id) => {
    const findUser = users.find(u => u.username === user.username)
    userService.getOne(findUser.id).then(result => {
      const userToUpdate = result
      const blogToUpdate = blogs.find(blog => blog.id === id)
      const usersBlogs = userToUpdate.blogs.map(blog => blog.id)
      const newLikes = blogToUpdate.likes - 1
      const newFans = blogToUpdate.fans.filter(f => f !== user.username)
      const updatedBlog = { ...blogToUpdate, likes: newLikes, fans: newFans }
      const newLikedBlogs = userToUpdate.likedBlogs.filter(blog => blog.id !== blogToUpdate.id)
      try {
        let likedBlogs = newLikedBlogs.map(blog => blog.id)
        if (userToUpdate.likedBlogs.length === 1) {
          likedBlogs = []
        }
        const updatedUser = { ...userToUpdate, blogs: usersBlogs, likedBlogs: likedBlogs }
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
        console.log('Tykkäyksen peruminen ei onnistunut.', JSON.stringify(exception))
      }
    })
  }

  const handleRemove = async (id) => {
    const findUser = users.find(u => u.username === user.username)
    const userToUpdate = await userService.getOne(findUser.id)
    const blogInQuestion = await blogs.find(blog => blog.id === id)
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

  const userById = (id) => users.find(user => user.id === id)
  const blogById = (id) => blogs.find(blog => blog.id === id)
  const BlogForm = withRouter(BlogFormWithoutHistory)
  const style = { width: 800 }
  const linkStyle = { background: 'aliceblue', padding: 5, margin: 2 }

  if (users !== undefined && username !== undefined) {
    return (
      <div style={style}>
        <Router>
          <div>
            <Logout user={user} handleLogout={handleLogout} />
            <div>
              <Link style={linkStyle} to="/">Sivuluettelo</Link>
              <Link style={linkStyle} to="/blog-form">Lisää sivu</Link>
              <Link style={linkStyle} data-cy="users-link" to="/users">Käyttäjät</Link>
            </div>
            <h1 id="move-text">Parhaat nettisivut</h1>
            <Route exact path="/" render={() => <Blogs blogs={blogs} username={username} handleVote={handleVote} handleRemove={handleRemove} />} />
            <Route path="/blog-form" render={() => <BlogForm handleAddBlog={handleAddBlog} />} />
            <Route exact path="/users" render={() => <Users users={users} username={username} handleVote={handleVote} handleRemove={handleRemove} show='short' />} />
            <Route exact path="/users/:id" render={({ match }) => <UserInfo user={userById(match.params.id)} username={username} handleVote={handleVote} handleRemove={handleRemove} show='full' />} />
            <Route exact path="/blogs/:id" render={({ match }) => <BlogInfo blog={blogById(match.params.id)} username={username} handleVote={handleVote} handleRemove={handleRemove} />} />
          </div>
        </Router>
      </div>
    )
  }
  return null
}

export default Menu