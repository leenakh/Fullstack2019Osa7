import React from 'react'
import { User } from './User'

const Users = ({ users, show }) => {

  if (users !== undefined) {
    return (
      users.map(user =>
        <User
          key={user.id}
          user={user}
          show={show}
        />
      )
    )
  }
  return null
}

export default Users
