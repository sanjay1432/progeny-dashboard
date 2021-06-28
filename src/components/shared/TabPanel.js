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
import EstateInformation from "components/estateAssignment/EstateInformation"
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
    switch (tabname && option.type) {
      case "Estate" && "add":
        return (
          <>
            <EstateBlockTable
              currentSubNavState={currentSubNavState}
              option={option}
            />
          </>
        )
      case "Trial and Replicate" && "create":
        return (
          <>
            <AddNewTrial
              currentSubNavState={currentSubNavState}
              option={option}
            />
          </>
        )
      case "Trial and Replicate" && "edit":
        return (
          <>
            <EditTrial
              currentSubNavState={currentSubNavState}
              option={option}
            />
          </>
        )
      case "Trial and Replicate" && "expand":
        return (
          <>
            <TrialEstateBlocks
              currentSubNavState={currentSubNavState}
              option={option}
            />
          </>
        )
      case "Trial and Replicate" && "attach":
        return (
          <>
            <AttachProgeny
              currentSubNavState={currentSubNavState}
              option={option}
            />
          </>
        )
      case "Plot" && "generate QR":
        return (
          <>
            <GenerateQRCode option={option} />
          </>
        )
      case "Progeny" && "add":
        return (
          <>
            <AddNewProgeny />
          </>
        )
      case "Progeny" && "edit":
        return (
          <>
            <EditProgeny option={option} />
          </>
        )
      case "User List" && "add":
        return (
          <>
            <AddNewUser option={option} />
          </>
        )
      case "User List" && "edit":
        return (
          <>
            <EditUser option={option} />
          </>
        )
      case "Estate Assignment" && "check":
        return (
          <>
            <EstateInformation option={option} />
          </>
        )
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
