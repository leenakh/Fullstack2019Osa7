import React from 'react'


const LoginForm = ({ handleLogin, username, password }) => {
  return (
    <div className="login-frame">
      <form onSubmit={handleLogin}>
        <table>
          <tbody>
            <tr>
              <td className="login-cell">Käyttäjätunnus</td><td><input id="username" className="login-input" {... username}/></td>
            </tr>
            <tr>
              <td className="login-cell">Salasana</td><td><input id="password" className="login-input" {... password}/></td>
            </tr>
            <tr>
              <td><button id="Kirjaudu" type="submit">Kirjaudu sisään</button></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default LoginForm