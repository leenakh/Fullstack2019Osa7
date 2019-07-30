import React from 'react'

const RegistrationForm = ({ handleRegistration, username, name, password }) => {
  return (
    <div className="login-frame">
      <form onSubmit={handleRegistration}>
        <table>
          <tbody>
            <tr>
              <td className="login-cell">Nimi</td><td><input id="reg-name-input" className="login-input" {... name} /></td>
            </tr>
            <tr>
              <td className="login-cell">Käyttäjätunnus</td><td><input id="reg-username-input" className="login-input" {... username} /></td>
            </tr>
            <tr>
              <td className="login-cell">Salasana</td><td><input id="reg-password-input" className="login-input" {... password} /></td>
            </tr>
            <tr>
              <td><button id="reg-submit" type="submit">Rekisteröidy</button></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default RegistrationForm