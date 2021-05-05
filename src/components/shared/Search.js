import React from "react"
import { Container, Row, Col } from "reactstrap"
import { Input, InputGroup, Icon, ControlLabel } from "rsuite"
import Radium, { StyleRoot } from "radium"
const Search = ({ currentSubNavState, ...props }) => {
  const styles = {
    width: 140,
    marginRight: 5,
    "@media (min-width: 1900px": {
      width: 170,
      marginRight: 5
    }
  }

  return (
    <StyleRoot>
      <div>
        <ControlLabel>Search</ControlLabel>
        <InputGroup inside style={styles}>
          <Input />
          <InputGroup.Button>
            <Icon icon="search" />
          </InputGroup.Button>
        </InputGroup>
      </div>
    </StyleRoot>
  )
}

export default Radium(Search)
