import React from "react"
import { Container, Row, Col } from "reactstrap"
import { Input, InputGroup, Icon, ControlLabel, AutoComplete } from "rsuite"
const Search = ({ currentSubNavState, ...props }) => {
  const styles = {
    marginBottom: 10
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
      <ControlLabel>Search</ControlLabel>
      <InputGroup inside style={styles}>
        <AutoComplete data={data} />
        <InputGroup.Button>
          <Icon icon="search" />
        </InputGroup.Button>
      </InputGroup>
    </>
  )
}

export default Search
