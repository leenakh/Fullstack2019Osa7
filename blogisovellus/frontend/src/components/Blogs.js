import React from 'react'
import { Blog } from './Blog'

const Blogs = ({ blogs, username, handleVote, handleRemove }) => {
  if (blogs !== undefined && blogs.length !== 0 && blogs !== null && username !== undefined) {
    const sortedBlogs =
      blogs.sort(function (a, b) {
        if (a.likes < b.likes) {
          return 1
        }
        if (a.likes > b.likes) {
          return -1
        }
        return 0
      })

    return (
      sortedBlogs.map((blog) =>
        <Blog
          key={blog.id}
          blog={blog}
          handleVote={handleVote}
          handleRemove={handleRemove}
          username={username}
        />
      )
    )
  }
  return null
}

export default Blogs