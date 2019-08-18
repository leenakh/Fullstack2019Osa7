import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Blogs from './Blogs'

const cellStyleFull = { width: 200 }
const cellStyleShort = { width: 200, height: 20 }

const Frame = styled.div`
padding: 10px;
`
const Name = styled.td`
padding: 10;
background: aliceblue;
`
const BlogList = ({ style, user, blogs, headline, handleVote, handleRemove, username }) => {
  if (user !== undefined) {
    const blogsToShow = blogs.filter(blog => blog !== null)
    const showBlogs = { display: blogsToShow.length === 0 ? 'none' : '' }
    return (
      <div style={showBlogs}>
        <Frame>
          <h3>{headline}</h3>
          <Blogs style={style} blogs={blogsToShow} handleVote={handleVote} handleRemove={handleRemove} username={username} />
        </Frame>
      </div>
    )
  }
  return null
}

export const User = ({ user, show }) => {
  if (user !== undefined && user.username !== 'admin') {
    const cellStyle = show === 'full' ? cellStyleFull : cellStyleShort
    const blogsAddedText = user.blogs.length !== 0 ? (user.blogs.length !== 1 ? `lisännyt ${user.blogs.length} sivua` : `lisännyt ${user.blogs.length} sivun`) : 'ei ole lisännyt mitään'
    const blogsLikedText = user.likedBlogs.length !== 0 ? `tykännyt ${user.likedBlogs.length} sivusta` : 'ei ole tykännyt mistään'
    const name = (user) => {
      if (user.name.length > 25 && show === 'short') {
        return (
          `${user.name.slice(0, 22)}...`
        )
      }
      return user.name
    }
    return (
      <table >
        <tbody >
          <tr>
            <Name><div style={cellStyle}><Link to={`/users/${user.id}`}>{name(user)}</Link></div></Name>
            <td><div style={cellStyle} data-cy="username">{user.username}</div></td>
            <td><div style={cellStyle} data-cy="blogs-added">{blogsAddedText}</div></td>
            <td><div style={cellStyle}>{blogsLikedText}</div></td>
          </tr>
        </tbody>
      </table>
    )
  }
  return null
}

export const UserInfo = ({ user, show, handleVote, handleRemove, username }) => {
  if (user !== undefined && user !== null) {
    return (
      <>
        <User user={user} show={show} />
        <BlogList user={user} blogs={user.blogs} headline='Lisätyt sivut' handleVote={handleVote} handleRemove={handleRemove} username={username} />
        <BlogList user={user} blogs={user.likedBlogs} headline='Tykätyt sivut' handleVote={handleVote} handleRemove={handleRemove} username={username} />
      </>
    )
  }
  return null
}


export default { User, UserInfo }