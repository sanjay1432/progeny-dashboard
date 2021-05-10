import React from "react"
import { Container, Row, Col } from "reactstrap"
import { Input, InputGroup, Icon, ControlLabel, AutoComplete } from "rsuite"
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
  const data = [
    "HYPER Advertiser",
    "HYPER Web Analytics",
    "HYPER Video Analytics",
    "HYPER DMP",
    "HYPER Ad Serving",
    "HYPER Data Discovery"
  ]
  return (
    <>
      <StyleRoot>
        <ControlLabel>Search</ControlLabel>
        <InputGroup inside style={styles}>
          <AutoComplete data={data} />
          <InputGroup.Button>
            <Icon icon="search" />
          </InputGroup.Button>
        </InputGroup>
      </StyleRoot>
    </>
  )
}

export default Radium(Search)
