import React from 'react'
import useField from '../hooks/index'

const BlogFormWithoutHistory = (props) => {
  const [title] = useField('text')
  const [author] = useField('text')
  const [url] = useField('text')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value
    }
    await props.handleAddBlog(newBlog)
    props.history.push('/')
  }
  return (
    <div className="blogform-frame">
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr><td className="blog-form-cell">Otsikko</td><td><input id="title-input" className="blog-input" {...title} /></td></tr>
            <tr><td className="blog-form-cell">Kirjoittaja</td><td><input id="author-input" className="blog-input" {...author} /></td></tr>
            <tr><td className="blog-form-cell">Osoite</td><td><input id="url-input" className="blog-input" {...url} /></td></tr>
            <tr><td><button id="blog-submit" className="blog-submit" type="submit">Lisää sivu</button></td></tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default BlogFormWithoutHistory