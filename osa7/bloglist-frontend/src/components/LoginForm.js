import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import { Button, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const notification = useSelector((state) => state.notification)
  const dispatch = useDispatch()

  const handleLogin = (e) => {
    e.preventDefault()
    const credentials = { username, password }
    dispatch(loginUser(credentials))
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  return (
    <div>
      <Typography variant="h2" align="center">
        Login to application
      </Typography>
      {notification.text && notification.isError ? (
        <Alert
          severity="error"
          variant="outlined"
          fontSize="large"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          {notification.text}
        </Alert>
      ) : null}
      {notification.text && !notification.isError ? (
        <Alert
          severity="success"
          variant="outlined"
          fontSize="large"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          {notification.text}
        </Alert>
      ) : null}
      <form onSubmit={handleLogin}>
        <Typography component="div" align="center" variant="h3">
          <TextField
            variant="outlined"
            id="username"
            type="text"
            value={username}
            name="Username"
            label="username"
            onChange={handleUsernameChange}
          />
        </Typography>
        <Typography component="div" align="center" variant="h3">
          <TextField
            variant="outlined"
            id="password"
            type="password"
            value={password}
            name="Password"
            label="password"
            onChange={handlePasswordChange}
          />
        </Typography>
        <Typography component="div" align="center">
          <Button
            align=""
            variant="contained"
            color="primary"
            id="login-button"
            type="submit"
          >
            login
          </Button>
        </Typography>
      </form>
    </div>
  )
}

export default LoginForm
