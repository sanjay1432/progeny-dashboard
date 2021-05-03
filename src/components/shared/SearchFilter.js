import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react"
import { Grid, Row, Col } from "rsuite"
import { Button, IconButton, ButtonGroup, ButtonToolbar } from "rsuite"
import { useMediaQuery } from "react-responsive"
import Search from "../shared/Search"
import Filter from "../shared/Filter"
import { Drawer, Sidenav, Nav, Icon, FlexboxGrid } from "rsuite"
import { refresh } from "less"
let initialFilters = {}
let currentFilters = []
const SearchFilter = forwardRef(
  ({ currentItem, currentSubNavState, ...props }, ref) => {
    const childRef = useRef()
    useEffect(() => {
      currentFilters = []
    })

    const [isDrawer, setDrawer] = useState(false)
    const [selectedFilters, setFilters] = useState(initialFilters)

    // console.log(currentSubNavState)

    const { active } = currentSubNavState
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
          if (i <= 4) {
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
          <Col xs={8} sm={4} md={3} lg={3}>
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
          <Col xs={8} sm={4} md={3} lg={3}>
            <div
              className="show-col"
              //style={{ padding: "25px 0 0px 0px" }}
            >
              <Button
                className="moreFilter"
                appearance="primary"
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
          <Row gutter={16}>
            <SearchBox />
            {mainPageFilters.map((filter, i) => (
              <div>
                <Col xs={8} sm={4} md={3} lg={3}>
                  <div className="show-col">
                    {" "}
                    <Filter
                      filter={filter}
                      onUpdate={e => onChange(e)}
                      ref={childRef}
                    />
                  </div>
                </Col>
              </div>
            ))}
            <MoreFilter />
            <Col xs={8} sm={4} md={3} lg={3}>
              <div
                className="show-col"
                //style={{ padding: "25px 0 0px 0px" }}
              >
                <Button
                  appearance="primary"
                  //style={{ width: "100%" }}
                  onClick={onApply}
                >
                  Apply
                </Button>
              </div>
            </Col>
            <Col
              xs={4}
              sm={2}
              md={2}
              lg={2}
              //style={{ padding: "25px 0 0px 0px" }}
            >
              <div className="show-col">
                {/* <Button appearance="subtle"  onClick={() => childRef.current.onClear()}>Reset Filter</Button> */}
                <Button appearance="subtle" onClick={onReset}>
                  Reset Filter
                </Button>
              </div>
            </Col>
          </Row>
          <h1>Device Test!</h1>
          {isDesktopOrLaptop && (
            <>
              <p>You are a desktop or laptop</p>
              {isBigScreen && <p>You also have a huge screen</p>}
              {isTabletOrMobile && (
                <p>You are sized like a tablet or mobile phone though</p>
              )}
            </>
          )}
          {isTabletOrMobileDevice && <p>You are a tablet or mobile phone</p>}
        </Grid>
        <Drawer placement="right" size="xs" show={isDrawer} onHide={close}>
          <Drawer.Header>
            <Drawer.Title>More Filters</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            {/* <Paragraph /> */}
            {/* <Sidenav defaultOpenKeys={["3", "4"]} activeKey="1">
            <Sidenav.Body>
              <Nav> */}

            {filters.map((filter, i) => (
              <FlexboxGrid justify="center">
                <FlexboxGrid.Item
                  colspan={12}
                  //style={{ width: "100%" }}
                >
                  <Filter filter={filter} />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ))}

            {/* </Nav>
            </Sidenav.Body>
          </Sidenav> */}
          </Drawer.Body>
          <Drawer.Footer>
            <Button
              onClick={close}
              appearance="primary"
              //style={{ width: "100%" }}
            >
              Apply
            </Button>
            <br />
            <Button
              onClick={close}
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
