import React, { useState, useEffect } from 'react'
import commentService from '../services/comments'
import CommentFormWithoutHistory from './CommentForm'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

const CommentForm = withRouter(CommentFormWithoutHistory)

const CommentFrame = styled.div`
  padding: 5px;
  margin-left: 50px;
  margin-top: 3px;
  background: aliceblue;
`
const Content = styled.div`
  display: inline;
`
const Time = styled.div`
  text-align: right;
  font-size: small;
  color: cadetblue;
`
const Username = styled.div`
  color: cadetblue;
  font-size: small;
  font-weight: bold;
`

const Comment = ({ comment }) => {
  return (
    <CommentFrame>
      <Username>{comment.user.username}</Username>
      <Content>{comment.content}</Content>
      <Time>{comment.time}</Time>
    </CommentFrame>
  )
}

const CommentsList = ({ blogComments }) => {
  console.log(blogComments)
  if (blogComments !== undefined) {
    return (
      blogComments.map(comment =>
        <Comment key={comment.id} comment={comment} />)
    )
  }
  return null
}

const Comments = ({ blog }) => {
  const [comments, setComments] = useState([])

  useEffect(() => {
    console.log('comments effect')
    commentService
      .getAll(blog.id)
      .then(initialComments => {
        console.log('comments promise fulfilled')
        setComments(initialComments)
      })
  }, [blog.id])

  const handleAddComment = async (id, comment) => {
    const response = await commentService.create(id, comment)
    setComments(comments.concat(response))
    commentService
      .getAll(blog.id)
      .then(initialComments => {
        console.log('comments promise fulfilled')
        setComments(initialComments)
      })
  }

  if (blog !== undefined) {
    const blogComments = comments.filter(comment => comment.blog !== null)
    return (
      <>
        <CommentsList blogComments={blogComments} />
        <CommentForm blog={blog} handleAddComment={handleAddComment} />
      </>
    )
  }
  return null
}

export default Comments