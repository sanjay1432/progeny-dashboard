import React, { useEffect, useRef } from "react"
import { Container, Row, Col } from "reactstrap"
import SearchFilter from "./SearchFilter"
import Table from "./Table"
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
          id="searchFilter"
          currentSubNavState={currentSubNavState}
          currentItem={currentItem}
          ref={searchFiltersRef}
        />
        <Table currentSubNavState={currentSubNavState} />
      </main>
    </>
  )
}

export default TabPanel
