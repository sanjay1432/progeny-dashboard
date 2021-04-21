import React, { useEffect, useState } from "react"
import {
  Navbar,
  Nav,
  Header,
  Icon,
  SelectPicker,
  Alert,
  Dropdown
} from "rsuite"
import _ from "lodash"
import BreadcrumbOpex from "./BreadcrumbOpex"
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { setMill, setMills, setBU } from "../../redux/actions/app.action"
import OverviewService from "../../services/overview.service"
import { BUSINESS_UNIT_LIST } from "../../constants/index"
import axios from "axios"
import GeneralService from "../../services/general.service"
import { setProcessLines } from "../../redux/actions/dashboard.action"
import { logout } from "../../redux/actions/auth.action"
import GeneralHelper from "../../helper/general.helper"

const TopNavbarDashboard = () => {
  const { isLoggedIn, user } = useSelector(state => state.authReducer)
  const mill = useSelector(state => state.appReducer.mill)
  const buId = useSelector(state => state.appReducer.buId)
  const [millSelectionList, setMillSelectionList] = useState([])
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isLoggedIn) {
      history.push({
        pathname: "/login"
      })
    }
    async function fetchData() {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      await OverviewService.getAllBuMills(source).then(
        data => {
          const millList = GeneralHelper.getMillListBaseOnRoles(
            data,
            user.roles,
            buId
          )
          dispatch(setMills(millList))
          setMillSelectionList(millList)
        },
        error => {
          Alert.error("We got an unknown error.", 5000)
          console.log(error)
          return Promise.reject()
        }
      )
    }
    fetchData()
  }, [user.roles, isLoggedIn, history, dispatch])

  const onChangeMill = (value, item) => {
    dispatch(
      setMill({
        millId: item.mill_id,
        buId: item.bu_id,
        logo: item.mill_name,
        millCode: item.mill_code,
        name: item.mill_name,
        countryId: item.country_id
      })
    )
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    GeneralService.getAllProcessLines(
      { buId: item.bu_id, millId: item.mill_id },
      source
    ).then(
      data => {
        dispatch(setProcessLines(data))
      },
      error => {
        Alert.error("We got an unknown error.", 5000)
        console.log(error)
        return Promise.reject()
      }
    )
  }

  const onChangeBU = (value, item, event) => {
    // dispatch(setBU(value))
    // const millList = GeneralHelper.getMillListBaseOnRoles(
    //   _.filter(mills, ["bu_id", value]),
    //   user.roles
    // )
    // if (millList) {
    //   setMillSelectionList(millList)
    //   onChangeMill(1, millList[0])
    // }
    if (buId !== value) {
      history.push(
        {
          pathname: "/overview"
        },
        {
          tab: value
        }
      )
    }
  }

  const getMills = () => {
    return _.filter(millSelectionList, ["bu_id", buId])
  }

  return (
    <>
      {isLoggedIn && (
        <Header>
          <Navbar className="custom-navs">
            <Navbar.Body>
              <Nav>
                <BreadcrumbOpex />
              </Nav>
              <Nav pullRight>
                <SelectPicker
                  className="nav-select rs-nav-item"
                  searchable={false}
                  cleanable={false}
                  value={buId}
                  onChange={value => onChangeBU(value)}
                  data={BUSINESS_UNIT_LIST}
                  labelKey="buName"
                  valueKey="buId"
                />
                <SelectPicker
                  className="nav-select rs-nav-item"
                  searchable={false}
                  cleanable={false}
                  value={mill.millId}
                  onSelect={(value, item) => onChangeMill(value, item)}
                  data={getMills()}
                  labelKey="mill_name"
                  valueKey="mill_id"
                />
                {/*<Nav.Item icon={<Icon icon="help-o" />}>Helpline</Nav.Item>*/}
                <Dropdown
                  icon={<Icon icon="user-o" />}
                  title={GeneralHelper.buildDisplayName(
                    user.firstName,
                    user.lastName,
                    user.username
                  )}
                >
                  <Dropdown.Item
                    icon={<Icon icon="sign-out" />}
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown>
              </Nav>
            </Navbar.Body>
          </Navbar>
        </Header>
      )}
    </>
  )
}
export default TopNavbarDashboard
