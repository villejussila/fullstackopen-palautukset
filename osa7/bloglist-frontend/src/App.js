import React, { useEffect, useRef, useState } from 'react'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import {
  logoutUser,
  setLoggedUserFromLocalStorage,
} from './reducers/userReducer'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import userService from './services/users'
import {
  Container,
  Button,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  ThemeProvider,
} from '@material-ui/core'
import { makeStyles, createMuiTheme } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 'auto',
    marginRight: '0',
  },
}))
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#424242',
      light: '#6d6d6d',
      dark: '#1b1b1b',
    },
    secondary: {
      main: '#ef9a9a',
      light: '#ffcccb',
      dark: '#ba6b6c',
    },
  },
})

const App = () => {
  const ButtonAppBar = ({ variant, color, onClick, text }) => {
    const classes = useStyles()
    return (
      <Button
        variant={variant}
        color={color}
        onClick={onClick}
        className={classes.root}
      >
        {text}
      </Button>
    )
  }
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(setLoggedUserFromLocalStorage())
  }, [])

  const [users, setUsers] = useState(null)

  useEffect(async () => {
    try {
      const data = await userService.getAll()
      setUsers(data)
    } catch (error) {
      console.log(error)
    }
  }, [])
  const blogFormRef = useRef()

  const handleLogout = (e) => {
    e.preventDefault()
    dispatch(logoutUser())
  }

  const handleToggleBlogFormVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }
  if (user === null) {
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <LoginForm />
        </Container>
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Container>
          <AppBar position="fixed" color="primary">
            <Toolbar>
              <Button component={Link} to="/" color="inherit">
                blogs
              </Button>
              <Button component={Link} to="/users" color="inherit">
                users
              </Button>
              <ButtonAppBar
                variant="text"
                color="secondary"
                onClick={handleLogout}
                text="logout"
              ></ButtonAppBar>
              <Typography>{user.name}</Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
          {notification.text && !notification.isError ? (
            <Alert
              severity="success"
              variant="outlined"
              style={{ marginTop: 16 }}
            >
              {notification.text}
            </Alert>
          ) : null}
          <Typography variant="h1" align="center">
            Blogs
          </Typography>
          <Switch>
            <Route path="/users/:id">
              <User users={users} />
            </Route>
            <Route path="/users">
              <Users users={users} />
            </Route>
            <Route path="/blogs/:id">
              <Blog blogs={blogs} loggedUser={user} />
            </Route>
            <Route path="/">
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm
                  toggleFormVisibility={handleToggleBlogFormVisibility}
                />
              </Togglable>
              <List>
                {blogs.map((blog) => (
                  <div key={blog.id}>
                    <ListItem component={Link} to={`/blogs/${blog.id}`}>
                      <ListItemText
                        primary={
                          <Typography variant="body1" color="primary">
                            {blog.title}
                          </Typography>
                        }
                        secondary={blog.author}
                      ></ListItemText>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </Route>
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App
