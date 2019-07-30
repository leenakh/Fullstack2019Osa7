import React from 'react'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  return (
    <div id="overlay">
      <div className={type}>
        {message}
      </div>
    </div>
  )
}

export default Notification