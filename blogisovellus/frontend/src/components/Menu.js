import React from 'react'
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom'
import Users from './Users'
import Blogs from './Blogs'
import userService from '../services/users'
import BlogFormWithoutHistory from './BlogForm'
import Logout from './Logout'
import { UserInfo } from './User'
import { BlogInfo } from './Blog'

const Menu = ({ user, users, blogs, username, handleVote, handleRemove, handleLogout, handleAddBlog }) => {
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