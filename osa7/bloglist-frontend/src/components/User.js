import React from 'react'
import { useParams } from 'react-router-dom'
import { Typography, List, ListItem, Divider } from '@material-ui/core'

const User = ({ users }) => {
  const id = useParams().id
  if (!users) return null

  const user = users.find((user) => user.id === id)

  return (
    <div>
      <Typography variant="h2">{user && user.name}</Typography>
      <Typography variant="h6">Added blogs</Typography>
      <List>
        {user.blogs.map((blog) => (
          <React.Fragment key={blog.id}>
            <ListItem>
              <Typography>{blog.title}</Typography>
            </ListItem>
            <Divider></Divider>
          </React.Fragment>
        ))}
      </List>
    </div>
  )
}

export default User
