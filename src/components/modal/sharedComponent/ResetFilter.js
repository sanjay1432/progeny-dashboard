import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { clearFilter } from "../../../redux/actions/filter.action"
import { Button } from "rsuite"

const ResetFilter = ({ initialFilter, selectedFilterArray }) => {
  const [selectedFilter, setFilter] = useState(initialFilter)

  const dispatch = useDispatch()

  function resetFilter() {
    Array.from(document.querySelectorAll("input")).forEach(
      input => input.value === ""
    )
    setFilter(null)
    selectedFilterArray = []
    dispatch(clearFilter())
  }

  return (
    <Button appearance="subtle" className="resetButton" onClick={resetFilter}>
      Reset Filter
    </Button>
  )
}

export default ResetFilter
