import React from "react"
import { Container, Row, Col } from "reactstrap"
import { Input, InputGroup, Icon, ControlLabel } from "rsuite"
const Search = ({ currentSubNavState, ...props }) => {
  const styles = {
    marginBottom: 10
  }
  return (
    <>
      <ControlLabel>Search</ControlLabel>
      <InputGroup inside style={styles}>
        <Input />
        <InputGroup.Button>
          <Icon icon="search" />
        </InputGroup.Button>
      </InputGroup>
    </>
  )
}

export default Search
