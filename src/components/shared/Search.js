import React from "react"
import { InputGroup, Icon, ControlLabel, AutoComplete } from "rsuite"
const Search = ({ currentSubNavState, ...props }) => {
  const styles = {
    width: 140,
    marginRight: 5
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
      <InputGroup inside>
        <AutoComplete data={data} />
        <InputGroup.Button>
          <Icon icon="search" />
        </InputGroup.Button>
      </InputGroup>
    </>
  )
}

export default Search
