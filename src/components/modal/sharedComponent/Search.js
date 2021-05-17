import React from "react"
import { Input, InputGroup, Icon, ControlLabel, AutoComplete } from "rsuite"

const Search = () => {
  return (
    <>
      <InputGroup inside>
        <AutoComplete />
        <InputGroup.Button>
          <Icon icon="search" />
        </InputGroup.Button>
      </InputGroup>
    </>
  )
}

export default Search
