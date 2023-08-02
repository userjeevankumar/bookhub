import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <>
        <label className="label" htmlFor="password">
          PASSWORD
        </label>
        <input
          className="input"
          onChange={this.onChangePassword}
          value={password}
          placeholder="Password"
          id="password"
          type="password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <>
        <label className="label" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          className="input"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
          id="username"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-container">
        <div className="img-container">
          <img
            src="https://res.cloudinary.com/dgjd6lxkk/image/upload/v1688626593/NxtWave/Min%20Projects/bookhub/Bookhub_Login_q33xnf.png"
            alt="website logo"
            className="img-website-login"
          />
        </div>
        <div className="login-container">
          <form className="form-container" onSubmit={this.submitForm}>
            <div className="img-website-logo-container">
              <img
                src="https://res.cloudinary.com/dgjd6lxkk/image/upload/v1688626605/NxtWave/Min%20Projects/bookhub/Bookhub_Logo_ibvkrw.png"
                alt="website logo"
                className="img-website-logo"
              />
            </div>

            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>

            <button className="button" type="submit">
              Login
            </button>
            {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
