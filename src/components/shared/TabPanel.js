import React, { useEffect, useRef } from "react"
import SearchFilter from "./SearchFilter"
import DataTable from "./DataTable"
import { useDispatch, useSelector } from "react-redux"
const TabPanel = ({ currentItem, currentSubNavState, ...props }) => {
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
        <DataTable currentSubNavState={currentSubNavState} />
      </main>
    </>
  )
}

export default TabPanel
