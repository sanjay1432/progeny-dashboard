import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid, Row, Col } from "rsuite"
import { Button, IconButton, ButtonGroup, ButtonToolbar } from "rsuite"
import { useMediaQuery } from "react-responsive"
import Search from "../shared/Search"
import Filter from "../shared/Filter"
import { Drawer, Sidenav, Nav, Icon, FlexboxGrid } from "rsuite"
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded"
import { refresh } from "less"
let initialFilters = {}
let currentFilters = []
let filterData = {}
const SearchFilter = forwardRef(
  ({ currentItem, currentSubNavState, ...props }, ref) => {
    useEffect(() => {
      currentFilters = []
    })

    const [isDrawer, setDrawer] = useState(false)
    const [selectedFilters, setFilters] = useState(initialFilters)

    const [selectedValue, setValues] = useState({})
    // console.log(currentSubNavState)

    const { active } = currentSubNavState

    const dashboardData = useSelector(state => state.dashboardDataReducer)

    console.log({ currentItem }, { active })
    const isDesktopOrLaptop = useMediaQuery({
      query: "(min-device-width: 1224px)"
    })
    const isBigScreen = useMediaQuery({ query: "(min-device-width: 1824px)" })
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" })
    const isTabletOrMobileDevice = useMediaQuery({
      query: "(max-device-width: 1224px)"
    })

    const filterList = currentItem.sublist.find(
      type => type.eventKey === active
    )
    // console.log({ filterList })

    const filters = filterList.filters
    filters.forEach(filter => {
      currentFilters.push(filter)
    })
    let mainPageFilters = currentFilters

    console.log({ dashboardData })
    if (dashboardData.result[active]) {
      mainPageFilters.forEach(filter => {
        const filterName = filter.name
        if (filter.type === "select") {
          const filterdata = dashboardData.result[active].map(
            res => res[filterName]
          )
          filterData[filterName] = filterdata
        }
      })
      console.log({ filterData })
    }

    console.log({ mainPageFilters })

    const sidebarFilters = filters

    let showMoreFiltersButton = false
    if (isTabletOrMobile | filters | isTabletOrMobileDevice) {
      const updatedFilters = []
      if (mainPageFilters.length > 2) {
        mainPageFilters.forEach((filter, i) => {
          if (i <= 2) {
            updatedFilters.push(filter)
          }
        })
        mainPageFilters = updatedFilters
        showMoreFiltersButton = true
      } else {
        showMoreFiltersButton = false
      }
    }
    if (isBigScreen || isDesktopOrLaptop) {
      const updatedFilters = []
      if (mainPageFilters.length > 4) {
        mainPageFilters.forEach((filter, i) => {
          if (i < 4) {
            updatedFilters.push(filter)
          }
        })
        mainPageFilters = updatedFilters
        showMoreFiltersButton = true
      } else {
        showMoreFiltersButton = false
      }
    }
    function toggleDrawer() {
      setDrawer(true)
    }
    function close() {
      setDrawer(false)
    }
    function SearchBox() {
      if (filterList.search) {
        return (
          <Col xs={5} sm={5} md={4} lg={3}>
            <div className="show-col">
              {" "}
              <Search />
            </div>
          </Col>
        )
      }
      return <></>
    }
    function MoreFilter() {
      // const {show} = show;
      if (showMoreFiltersButton) {
        return (
          <Col xs={5} sm={5} md={4} lg={3}>
            <div className="show-col">
              <Button
                appearance="ghost"
                className="btnMoreFilter"
                //style={{ width: "100%" }}
                onClick={() => toggleDrawer()}
              >
                More Filters
              </Button>
            </div>
          </Col>
        )
      }
      return <></>
    }

    function onChange(e) {
      setFilters(() => ({
        ...selectedFilters,
        [e.target.name]: e.target.value
      }))
    }

    useImperativeHandle(ref, () => ({
      onResetRef() {
        onReset()
      }
    }))

    function onReset() {
      Array.from(document.querySelectorAll("input")).forEach(
        input => (input.value = "")
      )
      setFilters(null)
    }

    function onApply() {
      console.log({ selectedFilters })
    }

    return (
      <>
        <Grid fluid>
          <Row>
            <SearchBox />
            {mainPageFilters.map((filter, i) => (
              <div>
                <Col xs={5} sm={5} md={4} lg={3}>
                  <div className="show-col">
                    {" "}
                    <Filter
                      filter={filter}
                      filterData={filterData[filter.name]}
                      selected={
                        selectedFilters ? selectedFilters[filter.name] : null
                      }
                      onUpdate={e => onChange(e)}
                    />
                  </div>
                </Col>
              </div>
            ))}
            <MoreFilter />
            <Col xs={5} sm={5} md={4} lg={3}>
              <div className="show-col" style={{ padding: "25px 0px 0px 0px" }}>
                <Button
                  className="btnApply"
                  appearance="primary"
                  onClick={onApply}
                >
                  Apply
                </Button>
              </div>
            </Col>
            <Col xs={5} sm={5} md={4} lg={3}>
              <div className="show-col">
                <Button
                  className="btnResetFilter"
                  appearance="subtle"
                  onClick={onReset}
                >
                  Reset Filter
                </Button>
              </div>
            </Col>
          </Row>
        </Grid>
        <Drawer
          id="moreFilterDrawer"
          placement="right"
          size="xs"
          show={isDrawer}
          onHide={close}
        >
          <Drawer.Header>
            <Drawer.Title>More Filters</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            {filters.map((filter, i) => (
              <FlexboxGrid justify="center">
                <FlexboxGrid.Item
                  colspan={12}
                  // style={{ width: "100%" }}
                >
                  <Filter
                    filter={filter}
                    filterData={filterData[filter.name]}
                    selected={
                      selectedFilters ? selectedFilters[filter.name] : null
                    }
                    onUpdate={e => onChange(e)}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ))}
          </Drawer.Body>
          <Drawer.Footer>
            <Button
              onClick={onApply}
              appearance="primary"
              //style={{ width: "100%" }}
            >
              Apply
            </Button>
            <br />
            <Button
              onClick={onReset}
              appearance="subtle"
              //style={{ width: "100%" }}
            >
              Reset filter
            </Button>
          </Drawer.Footer>
        </Drawer>
      </>
    )
  }
)

export default SearchFilter
