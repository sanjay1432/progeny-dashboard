import React, { useState, useEffect, forwardRef } from "react"
import { useDispatch } from "react-redux"
import { setFilter } from "redux/actions/filter.action"
import { Button, ControlLabel, Grid, Row, Col } from "rsuite"
import SelectFilter from "./SelectFilter"
import ResetFilter from "./ResetFilter"

const FilterPanel = forwardRef(({ labelName, data, dataType }, ref) => {
  console.log(data)

  return (
    <div id="FilterPanel">
      <Grid fluid>
        <Row>
          <Col md={7} lg={7}>
            <ControlLabel>{labelName}</ControlLabel>
            <SelectFilter data={data} dataType={dataType} />
          </Col>
          <Col md={5} lg={5}>
            <Button appearance="primary" className="btnApply">
              Apply
            </Button>
          </Col>
          <Col md={5} lg={5}>
            <ResetFilter
              initalFilter="{initialFilter}"
              selectedFilterArray="{selectedFilterArray}"
            />
          </Col>
        </Row>
      </Grid>
    </div>
  )
})
export default FilterPanel
