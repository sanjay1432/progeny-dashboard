import React, { useCallback, useEffect, useState } from "react"

import OPEXSidebar from "./OPEXSidebar"
import { Alert, Container, Content } from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import SwitchRouter from "./SwitchRouter"
import TopNavbarDashboard from "components/nav/TopNavbarDashboard"
import { DASHBOARD_VERSION, MODULE } from "../constants"
import axios from "axios"
import GeneralService from "../services/general.service"
import {
  setDisplayAsDate,
  setLatestDate,
  setProcessLines
} from "../redux/actions/dashboard.action"
import { ModuleAbility } from "../models/ModuleAbility"
import ExpandChart from "../components/shared/ExpandChart"

const Main = () => {
  const { isLoggedIn } = useSelector(state => state.authReducer)
  const history = useHistory()
  const mill = useSelector(state => state.appReducer.mill)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const getDashboardInfo = useCallback(async () => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const { millId, buId } = mill
    const param = {
      buId,
      millId
    }
    await GeneralService.getLatestDate(param, source).then(
      data => {
        dispatch(setLatestDate(data.datetime))
        dispatch(setDisplayAsDate(data.datetime))
      },
      error => {
        Alert.error("We got an unknown error.", 5000)
        console.log(error)
        return Promise.reject()
      }
    )
    await GeneralService.getAllProcessLines(param, source).then(
      data => {
        dispatch(setProcessLines(data))
      },
      error => {
        Alert.error("We got an unknown error.", 5000)
        console.log(error)
        return Promise.reject()
      }
    )
  }, [mill, dispatch])
  useEffect(() => {
    console.log(DASHBOARD_VERSION)
    if (!isLoggedIn) {
      history.push({
        pathname: "/login"
      })
    } else {
      getDashboardInfo().then(r => {
        setIsLoading(false)
      })
    }
  }, [isLoggedIn, history, getDashboardInfo])

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser)
    return () => {
      window.removeEventListener("beforeunload", alertUser)
    }
  }, [])

  const alertUser = e => {
    e.preventDefault()
    e.returnValue = ""
  }

  return (
    <>
      {isLoggedIn && (
        <div className="sidebar-page">
          <Container>
            <OPEXSidebar />
            <Container>
              <TopNavbarDashboard />
              <Content>
                <SwitchRouter />
              </Content>
              <ExpandChart />
            </Container>
          </Container>
        </div>
      )}
    </>
  )
}
export default Main
