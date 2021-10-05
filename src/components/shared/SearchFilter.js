import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid, Row, Col, Button, Drawer, FlexboxGrid } from "rsuite"
import { useMediaQuery } from "react-responsive"
import Filter from "../shared/Filter"
import { setFilter, clearFilter} from "../../redux/actions/filter.action"
import { setReset} from "../../redux/actions/reset.action"
import { getPalmData } from "../../redux/actions/dashboarddata.action"
import GeneralHelper from "../../helper/general.helper";
let initialFilters = {}
let currentFilters = []
let filterData = {}
let selectedFilterArray = []

const SearchFilter = forwardRef(
  ({ currentItem, currentSubNavState, ...props }, ref) => {
    useEffect(() => {
      currentFilters = []
    })

    const dispatch = useDispatch()
    const [isDrawer, setDrawer] = useState(false)
    const [selectedFilters, setFilters] = useState(initialFilters)
    const [estates, setEstates] = useState([])

    const { active } = currentSubNavState

    const dashboardData = useSelector(state => state.dashboardDataReducer)

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

    const filters = filterList.filters

    filters.forEach(filter => {
      currentFilters.push(filter)
    })

    let mainPageFilters = currentFilters
 
    if (dashboardData.result[active]|| active === 'palm') {
      mainPageFilters.forEach(filter => {
        const filterName = filter.name
        if (filter.type === "select") {
          let filterdata = [
            ...new Set(dashboardData.result[active ==='palm'?'trial': active].map(res => res[filterName]))
          ]
          filterdata = filterdata.sort((a,b)=>a-b)
          if (active === "trial" && filter.name === "estate") {
            const filterValues = []
            if (filterdata) {
              filterdata.forEach(estate => {
                const est = estate.map(estateObj => estateObj.name?estateObj.name:null)
                filterValues.push(...est)
              })
              filterValues.filter(function( element ) {
                return element !== undefined;
              });
              filterValues.sort()
              filterData[filterName] = [
                ...new Set(filterValues)]
            }
          } else if (active === "trial" && filter.name === "planteddate") {
             const filterValues = []
             filterdata.forEach(date => {
              const d = GeneralHelper.modifyDate({date})  
              filterValues.push(d)
             });
             filterValues.filter(function( element ) {
              return element !== undefined;
             });
             filterData["planteddate"] = [
              ...new Set(filterValues)]
          }else {       
            filterdata.filter(function( element ) {
              return element !== undefined;
            });
            filterData[filterName] = filterdata       
            if(active === "palm") {
              estates.filter(function( element ) {
                return element !== undefined;
              });
              filterData['estate'] = estates 
            }   
          }
        }
      })
    }

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

    function MoreFilter() {
      if (showMoreFiltersButton) {
        return (
          <Col sm={5} md={4} lg={3} className="multiFilterLayout">
            <div className="show-col">
              <Button
                appearance="ghost"
                className="multiFilterButton"
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
      // FIND THE ESTATE OF TRIAL CODE
      if(active === 'palm'){
        const trials = dashboardData.result['trial']
       if(trials){
        const trialEstates =  trials.find((trial)=> trial.trialCode ===  e.target.value)?.estate;

        if(trialEstates){
          const estates = trialEstates.map((te)=>te.name)

          setEstates(estates)

          filterData['estate'] = estates
        }
       }
       
     
      }
      
      if (!e.target.value) {
        //In case of checking the disable state
        const index = selectedFilterArray.indexOf(e.target.name)
        if (index > -1) {
          selectedFilterArray.splice(index, 1)
        }
        //In case of checking the disable state

        delete selectedFilters[e.target.name]
        return setFilters(selectedFilters)
      }

      setFilters(() => ({
        ...selectedFilters,
        [e.target.name]: e.target.value
      }))

      /*********************************/
      /*SET THE filters disbale value*/
      if (["plot", "palm"].includes(active)) {
        if (e.target.value) {
          selectedFilterArray.push(e.target.name)
        }

        if (selectedFilterArray.length > 1) {
          mainPageFilters.forEach(item => {
            if (item.disable) {
              item.disable = false
            }
          })
        }
      }
      /*SET THE filters disbale value*/
      /*********************************/
    }

    useImperativeHandle(ref, () => ({
      onResetRef() {
        onReset()
        // dispatch(clearFilter())
      }
    }))

    function onReset() {
      Array.from(document.querySelectorAll("input")).forEach(
        input => (input.value = "")
      )
      setFilters(null)
      selectedFilterArray = []
      dispatch(clearFilter())
      
      /*********************************/
      /*RESET THE filters disbale value*/
      mainPageFilters.forEach(item => {
        if (item.name === "replicate" || item.name === "plot") {
          item.disable = true
        }
      })
      /*RESET THE filters disbale value*/
      /*********************************/
      dispatch(setReset())

    }

    function onApply() {
      //CALL API FOR ACTIVE TAB PALM
      if(active === 'palm'){
         //FETCH TRIAL ID & ESTATEID
          const {trialCode, estate} =  selectedFilters
        const foundTrial =  dashboardData.result['trial'].find((trial)=> trial.trialCode === trialCode)
        const foundEstate =  foundTrial.estate.find((est)=> est.name === estate)
        const payload = {
          trialId: foundTrial.trialId,
          estateId: foundEstate.id
        }
        dispatch(getPalmData(payload))
      }
      dispatch(setFilter(selectedFilters))
    }

    return (
      <>
        <Grid fluid id="dashboardFilterPanel">
          <Row>
            {/* <SearchBox /> */}
            {mainPageFilters.map((filter, i) => (
              <div>
                <Col sm={5} md={4} lg={3} className="dashboardFilterLayout">
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
            <Col sm={5} md={4} lg={3} className="applyButtonLayout">
              <div className="show-col">
                <Button
                  className="applyButton"
                  appearance="primary"
                  onClick={onApply}
                  disabled = {selectedFilters && active==='palm'?Object.keys(selectedFilters).length < 2: selectedFilters ? !Object.keys(selectedFilters).length: true}
                >
                  Apply 
                </Button>
              </div>
            </Col>
            <Col sm={3} md={4} lg={3} className="resetButtonLayout">
              <div className="show-col">
                <Button
                  className="resetButton"
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
          id="filterDrawer"
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
              <FlexboxGrid justify="center" key={i}>
                <FlexboxGrid.Item colspan={12}>
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
