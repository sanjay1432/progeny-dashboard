import React from "react"
import { Container, Row, Col } from "reactstrap"
import Radium, { StyleRoot } from "radium"
import { Input, InputGroup, Icon, ControlLabel, AutoComplete } from "rsuite"
const Search = ({ currentSubNavState, ...props }) => {
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
        <InputGroup inside>
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
