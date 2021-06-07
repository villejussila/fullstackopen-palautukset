import React from 'react'
import { connect } from 'react-redux'
import { filterValue } from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (event) => {
    props.filterValue(event.target.value.toLowerCase())
  }
  const style = {
    marginBottom: 10,
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const mapDispatchToProps = {
  filterValue,
}

const ConnectedFilter = connect(null, mapDispatchToProps)(Filter)

export default ConnectedFilter
