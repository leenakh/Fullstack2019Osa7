import React from 'react'
import useField from '../hooks/index'
import styled from 'styled-components'

const FormFrame = styled.div`
padding: 10px;
margin-left: 40px;
`

const CommentFormWithoutHistory = (props) => {
  const [content, contentReset] = useField('text')
  const handleSubmit = async (event) => {
    event.preventDefault()
    const newComment = {
      content: content.value
    }
    if (newComment.content !== '') {
      await props.handleAddComment(props.blog.id, newComment)
    }
    contentReset()
  }

  return (
    <FormFrame>
      <form onSubmit={handleSubmit} >
        <textarea className="comment-input" {...content} />
        <div><button className="comment-submit" type="submit" data-cy="add-comment">Lisää kommentti</button></div>
      </form >
    </FormFrame>
  )
}

export default CommentFormWithoutHistory

