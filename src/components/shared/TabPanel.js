import React, { useEffect, useRef } from "react"
import SearchFilter from "./SearchFilter"
import DataTable from "./DataTable"
import { useSelector } from "react-redux"
import EstateBlockTable from "./EstateBlockTable"
import AddNewUser from "../userList/AddNewUser"
import EditUser from "../userList/EditUser"
import AddNewTrial from "../trial/AddNewTrial"
import EditTrial from "../trial/EditTrial"
import TrialEstateBlocks from "../trial/TrialEstateBlocks"
import EstateInformation from "../estateAssignment/EstateInformation"
import AddNewProgeny from "../progeny/AddNewProgeny"
import AttachProgeny from "../progeny/AttachProgeny"
import EditProgeny from "../progeny/EditProgeny"
import GenerationQRCode from "../plot/GenerationQRCode"
import EditPalmInformation from "../plot/EditPalmInformation"
import VerificationDataTable from "./VerificationDataTable"

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
        if (option.type === "create") {
          return (
            <>
              <AddNewTrial
                currentSubNavState={currentSubNavState}
                option={option}
              />
            </>
          )
        }
        if (option.type === "edit") {
          return (
            <>
              <EditTrial
                currentSubNavState={currentSubNavState}
                option={option}
              />
            </>
          )
        }
        if (option.type === "expand") {
          return (
            <>
              <TrialEstateBlocks
                currentSubNavState={currentSubNavState}
                option={option}
              />
            </>
          )
        }
        if (option.type === "attach") {
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
              <GenerationQRCode option={option} />
            </>
          )
        } else if (option.type === "edit") {
          return (
            <>
              <EditPalmInformation option={option} />
            </>
          )
        } else if (option.type === "attach") {
          return (
            <>
              <AttachProgeny
                currentSubNavState={currentSubNavState}
                option={option}
              />
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
        if(currentItem.name === "Master Data") {
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
        else if(currentItem.name === "Verification") {
          return (
            <main>
              <SearchFilter
                id="searchFilter"
                currentSubNavState={currentSubNavState}
                currentItem={currentItem}
                ref={searchFiltersRef}
              />
              <VerificationDataTable 
                currentSubNavState={currentSubNavState}
                currentItem={currentItem}
              />
            </main>
          )
        }
    }
  }

  return (
    <>
      <TabPanelSection />
    </>
  )
}

export default TabPanel
