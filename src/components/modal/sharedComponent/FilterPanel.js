import React, { useState, forwardRef } from "react"
import { useDispatch } from "react-redux"
import { setFilter } from "../../../redux/actions/filter.action"
import { Button, ControlLabel, Grid, Row, Col } from "rsuite"
import SelectFilter from "./SelectFilter"
import ResetFilter from "./ResetFilter"

let initialFilters = {}
let selectedFilterArray = []
const FilterPanel = forwardRef(({ labelName, data, dataType }, ref) => {
  const [selectedFilters, setFilters] = useState(initialFilters)

  const dispatch = useDispatch()

  function onChange(e) {
    if (!e.target.value) {
      const index = selectedFilterArray.indexOf(e.target.name)

      if (index > -1) {
        selectedFilterArray.splice(index, 1)
      }
      delete selectedFilters[e.target.name]
      return setFilters(selectedFilters)
    }

    setFilters(() => ({
      ...selectedFilters,
      [e.target.name]: e.target.value
    }))
  }

  function onApply() {
    dispatch(setFilter(selectedFilters))
  }

  return (
    <div id="modalFilterPanel">
      <Grid fluid>
        <Row>
          <Col md={7} lg={7}>
            <ControlLabel className="modalLabelFilter">
              {labelName}
            </ControlLabel>
            <SelectFilter
              data={data}
              dataType={dataType}
              selectedData={selectedFilters ? selectedFilters : null}
              onUpdate={e => onChange(e)}
            />
          </Col>
          <Col md={6} lg={6}>
            <Button
              appearance="primary"
              className="applyButton"
              onClick={onApply}
            >
              Apply
            </Button>
          </Col>
          <Col md={5} lg={5}>
            <ResetFilter
              initialFilters={initialFilters}
              setFilter={setFilter}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  )
})
export default FilterPanel
