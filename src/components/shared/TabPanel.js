import React, { useEffect, useRef } from "react"
import SearchFilter from "./SearchFilter"
import DataTable from "./DataTable"
import { useDispatch, useSelector } from "react-redux"
import EstateBlockTable from "./EstateBlockTable"
const TabPanel = ({ currentItem, currentSubNavState, ...props }) => {
  const searchFiltersRef = useRef()
  const { breadcrumb, option } = useSelector(
    state => state.appReducer.breadcrumb
  )

  useEffect(() => {
    //ON TAB SWITCH CLEAR THE FILTER DATA
    if (searchFiltersRef.current) {
      searchFiltersRef.current.onResetRef()
    }
  })

  function TabPanelSection() {
    const tabname = breadcrumb ? breadcrumb[0] : null
    console.log({ tabname })
    switch (tabname) {
      case "Estate":
        return (
          <>
            <EstateBlockTable
              currentSubNavState={currentSubNavState}
              option={option}
            />
          </>
        )
      default:
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
  }

  return (
    <>
      {/* <main>
        <SearchFilter
          id="searchFilter"
          currentSubNavState={currentSubNavState}
          currentItem={currentItem}
          ref={searchFiltersRef}
        />
        <DataTable currentSubNavState={currentSubNavState} />
      </main> */}
      <TabPanelSection />
    </>
  )
}

export default TabPanel
