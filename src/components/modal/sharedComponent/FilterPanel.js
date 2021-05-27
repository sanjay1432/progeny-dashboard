import React, { useState, useEffect, forwardRef } from "react"
import { useDispatch } from "react-redux"
import { setFilter } from "redux/actions/filter.action"
import { Button, ControlLabel, Grid, Row, Col } from "rsuite"
import SelectFilter from "./SelectFilter"
import ResetFilter from "./ResetFilter"

let filterData = {}
let initialFilter = {}
let currentFilter = []
let selectedFilterArray = []
const FilterPanel = forwardRef(
  ({ data, currentItem, currentSubNavState, ...props }, ref) => {
    useEffect(() => {
      currentFilter = []
    })

    let x = data[0].estate

    const [selectedFilter, setFilter] = useState(initialFilter)

    const { active } = currentSubNavState
    const dispatch = useDispatch()

    const filterList = currentItem.sublist.find(
      type => type.eventKey === active
    )

    const filters = filterList.filters
    filters.forEach(filter => {
      currentFilter.push(filter)
    })
    if (data) {
      currentFilter.forEach(filter => {
        const filterName = filter.name
        if (filter.type === "select") {
          const filterdata = [...new Set(data.map(res => res[filterName]))]
          filterData[filterName] = filterdata
        }
      })
    }

    function onChange(e) {}

    function applyFilter() {
      dispatch(setFilter(selectedFilter))
    }

    return (
      <>
        <Grid fluid>
          <Row>
            <Col md={7} lg={7}>
              <ControlLabel>Estate</ControlLabel>
            </Col>
            <Col md={5} lg={5}>
              <Button
                appearance="primary"
                className="btnApply"
                onClick={applyFilter}
              >
                Apply
              </Button>
            </Col>
            <Col md={5} lg={5}>
              <ResetFilter
                initalFilter={initialFilter}
                selectedFilterArray={selectedFilterArray}
              />
            </Col>
          </Row>
        </Grid>
      </>
    )
  }
)
export default FilterPanel
