import React from 'react'

const Logout = ({ user, handleLogout }) => {
  const style = { float: 'right' }
  const buttonStyle = { float: 'right', marginTop: 5 }
  return (
    <div style={style}>
      <div style={style}><b>{user.name}</b></div><br/>
      <div style={buttonStyle}><button onClick={handleLogout}>Kirjaudu ulos</button></div>
    </div>
  )
}

export default Logout