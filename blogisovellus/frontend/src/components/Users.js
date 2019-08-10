import React, { useState, useEffect } from 'react'
import { User } from './User'
import userService from '../services/users'

const Users = ({ show }) => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll()
      .then(response => {
        console.log('käyttäjät haettu')
        setUsers(response)
      })
  }, [])

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
