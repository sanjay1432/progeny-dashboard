import React, { useEffect, useRef } from "react"
import { Container, Row, Col } from "reactstrap"
import SearchFilter from "./SearchFilter"
import DataTable from "./DataTable"
const TabPanel = ({ currentItem, currentSubNavState, ...props }) => {
  // console.log(currentSubNavState)
  const searchFiltersRef = useRef()
  useEffect(() => {
    //ON TAB SWITCH CLEAR THE FILTER DATA
    searchFiltersRef.current.onResetRef()
  })
  return (
    <>
      <main>
        <SearchFilter
          currentSubNavState={currentSubNavState}
          currentItem={currentItem}
          ref={searchFiltersRef}
        />
        <DataTable currentSubNavState={currentSubNavState} />
      </main>
    </>
  )
}

export default TabPanel
