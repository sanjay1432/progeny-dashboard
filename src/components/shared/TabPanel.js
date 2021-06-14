import React, { useState, useEffect, useRef } from "react"
import SearchFilter from "./SearchFilter"
import {
  Table,
  FlexboxGrid,
  Button,
  InputPicker,
  Grid,
  Row,
  Col,
  Checkbox,
  Pagination,
  Message
} from "rsuite"
import DataTable from "./DataTable"
import { useDispatch, useSelector } from "react-redux"
import EstateBlockTable from "./EstateBlockTable"
import AddNewUser from "../user/userList/addNewUser"
import EditUser from "../user/userList/EditUser"
import AddNewTrial from "../trial/AddNewTrial"
import EstateInformation from "components/user/estateAssignment/EstateInformation"
import AddNewProgeny from "components/progeny/AddNewProgeny"
import EditProgeny from "components/progeny/EditProgeny"
const TabPanel = ({ currentItem, currentSubNavState, ...props }) => {
  const searchFiltersRef = useRef()
  //useDispatch
  const { breadcrumb, option } = useSelector(
    state => state.appReducer.breadcrumb
  )

  useEffect(() => {
    //ON TAB SWITCH CLEAR THE FILTER DATA
    if (searchFiltersRef.current) {
      searchFiltersRef.current.onResetRef()
    }
  })

  //console.log("currentSubNavState", currentSubNavState)

  function TabPanelSection() {
    const tabname = breadcrumb ? breadcrumb[0] : null
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
      case "Trial and Replicate":
        return (
          <>
            <AddNewTrial
              currentSubNavState={currentSubNavState}
              option={option}
            />
          </>
        )

      case "Progeny":
        if (breadcrumb[1] === "Add New Progeny") {
          return (
            <>
              <AddNewProgeny />
            </>
          )
        } else if (breadcrumb[1] === "Edit Progeny") {
          return (
            <>
              <EditProgeny option={option} />
            </>
          )
        }
      case "User List":
        if (breadcrumb[1] === "Add New User") {
          return (
            <>
              <AddNewUser option={option} />
            </>
          )
        } else if (breadcrumb[1] === "Edit User") {
          return (
            <>
              <EditUser option={option} />
            </>
          )
        }
      case "Estate Assignment":
        return <EstateInformation option={option} />
      default:
        return (
          <main>
            <SearchFilter
              id="searchFilter"
              currentSubNavState={currentSubNavState}
              currentItem={currentItem}
              ref={searchFiltersRef}
            />
            <DataTable
              currentSubNavState={currentSubNavState}
              currentItem={currentItem}
            />
          </main>
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
