import React from "react"
import { useDispatch } from "react-redux"
import { clearFilter } from "../../../redux/actions/filter.action"
import { Button } from "rsuite"

const ResetFilter = ({ setFilter }) => {
  const dispatch = useDispatch()

  function resetFilter() {
    Array.from(document.querySelectorAll("input")).forEach(
      input => input.value === ""
    )
    setFilter(null)
    dispatch(clearFilter())
  }

  return (
    <Button appearance="subtle" className="resetButton" onClick={resetFilter}>
      Reset Filter
    </Button>
  )
}

export default ResetFilter
