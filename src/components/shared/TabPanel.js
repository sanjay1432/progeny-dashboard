import React, { useState, useEffect, useRef } from "react"
import SearchFilter from "./SearchFilter"
import DataTable from "./DataTable"
import { useSelector } from "react-redux"
import EstateBlockTable from "./EstateBlockTable"
import AddNewUser from "../user/userList/AddNewUser"
import EditUser from "../user/userList/EditUser"
import AddNewTrial from "../trial/AddNewTrial"
import EditTrial from "../trial/EditTrial"
import TrialEstateBlocks from "../trial/TrialEstateBlocks"
import EstateInformation from "components/user/estateAssignment/EstateInformation"
import AddNewProgeny from "components/progeny/AddNewProgeny"
import AttachProgeny from "components/progeny/AttachProgeny"
import EditProgeny from "components/progeny/EditProgeny"
import GenerateQRCode from "components/plot/GenerateQRCode"
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
        if (option.type == "create") {
          return (
            <>
              <AddNewTrial
                currentSubNavState={currentSubNavState}
                option={option}
              />
            </>
          )
        }
        if (option.type == "edit") {
          return (
            <>
              <EditTrial
                currentSubNavState={currentSubNavState}
                option={option}
              />
            </>
          )
        }
        if (option.type == "expand") {
          return (
            <>
              <TrialEstateBlocks
                currentSubNavState={currentSubNavState}
                option={option}
              />
            </>
          )
        }
        if (option.type == "attach") {
          return (
            <>
              <AttachProgeny
                currentSubNavState={currentSubNavState}
                option={option}
              />
            </>
          )
        }
      case "Plot":
        if (breadcrumb[1] === "Generate QR Code") {
          return (
            <>
              <GenerateQRCode />
            </>
          )
        }
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
