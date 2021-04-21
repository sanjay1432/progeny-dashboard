import React, { useState, useCallback, useEffect } from "react"
import { CardBody, Card, Button } from "reactstrap"
import {
  InputPicker,
  DateRangePicker,
  Loader,
  Input,
  InputGroup,
  Icon,
  Alert
} from "rsuite"
import moment from "moment"
import FilterCollapsible from "components/shared/FilterCollapsible"
import LostcookService from "../../services/lostcook.service"
import { CANCEL_REQUEST } from "../../constants/index"
import axios from "axios"
import { useSelector } from "react-redux"
import CheckPickerOpex from "../shared/CheckPicker"
const { after } = DateRangePicker

const FilterLostcook = ({ onFilter, showSearchText, latestDate }) => {
  const [dateRange, setDateRange] = useState([
    new Date(
      moment(new Date(latestDate)).add(-120, "days").format("YYYY-MM-DD")
    ),
    new Date(latestDate)
  ])
  const [selectedResponsibility, setSelectedResponsibility] = useState([])
  const [selectedArea, setSelectedArea] = useState([])
  const [selectedFiberline, setSelectedFiberline] = useState("all")
  const [searchText, setSearchText] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState([])

  const [equipments, setEquipments] = useState(null)
  const [responsibilities, setResponsibilities] = useState(null)
  const [areas, setAreas] = useState(null)
  const [fiberlines, setFiberlines] = useState(null)
  const mill = useSelector(state => state.appReducer.mill)

  const fetchData = useCallback(
    async source => {
      // const dateRangeDefault = [
      //   new Date(
      //     moment(new Date(latestDate)).add(-120, "days").format("YYYY-MM-DD")
      //   ),
      //   new Date(latestDate)
      // ]
      //
      // setDateRange(dateRangeDefault)

      await LostcookService.responsibilityList(source).then(
        data => {
          setResponsibilities(data)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
      await LostcookService.fiberlineList({ millId: mill.millId }, source).then(
        data => {
          setFiberlines(data)
          if (data[0]) {
            setSelectedFiberline(data[0].value)
          }
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
      await LostcookService.areaList(source).then(
        data => {
          setAreas(data)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
      await LostcookService.equipmentList(source).then(
        data => {
          setEquipments(data)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
    },
    [mill]
  )

  useEffect(() => {
    if (
      areas !== null &&
      responsibilities !== null &&
      fiberlines !== null &&
      equipments !== null
    ) {
      const param = { ...buildParam() }
      param.responsibilityIds = responsibilities.map(item => item.value)
      param.areaIds = areas.map(item => item.value)
      param.equipmentIds = equipments.map(item => item.equipment_id)
      onFilter(param)
    }
  }, [areas, responsibilities, fiberlines, equipments])

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const applyFilter = () => {
    if (onFilter) {
      onFilter(buildParam())
    }
  }

  const buildParam = () => {
    const params = {
      responsibilityIds: selectedResponsibility,
      areaIds: selectedArea,
      fiberlineId: selectedFiberline,
      equipmentIds: selectedEquipment,
      dateRange
    }
    if (showSearchText) {
      params.searchText = searchText
    }
    return params
  }

  if (!latestDate || !dateRange) {
    return ""
  }
  return (
    <>
      <div className="lostcook-filter" id="lc-filter">
        <FilterCollapsible>
          <Card>
            <CardBody>
              <div className="d-flex d-flex align-items-center flex-wrap">
                {responsibilities && areas && fiberlines && equipments ? (
                  <>
                    <div>
                      <p className="m-0 __label">Period</p>
                      <DateRangePicker
                        // disabledDate={after(new Date(dateRange[1]))}
                        placement="auto"
                        className="mr-3"
                        appearance="default"
                        cleanable={false}
                        value={dateRange}
                        format="DD MMM YYYY"
                        onChange={selected => setDateRange(selected)}
                      />
                    </div>

                    <div>
                      <p className="m-0 __label">Fiberline</p>
                      <InputPicker
                        onChange={selected => setSelectedFiberline(selected)}
                        placeholder="Fiberline"
                        value={selectedFiberline}
                        className="mr-3"
                        data={fiberlines}
                        cleanable={false}
                        style={{ maxWidth: 400, width: 150 }}
                      />
                    </div>
                    <div>
                      <p className="m-0 __label">Area</p>
                      <CheckPickerOpex
                        className="mr-3"
                        data={areas}
                        defaultCheckAll={true}
                        placeholder="Area"
                        value={selectedArea}
                        onChange={selected => setSelectedArea(selected)}
                        style={{ maxWidth: 400, width: 300 }}
                      />
                    </div>
                    <div>
                      <p className="m-0 __label">Responsibility</p>
                      <CheckPickerOpex
                        className="mr-3"
                        data={responsibilities}
                        defaultCheckAll={true}
                        placeholder="Responsibility"
                        value={selectedResponsibility}
                        onChange={selected =>
                          setSelectedResponsibility(selected)
                        }
                        style={{ maxWidth: 400, width: 300 }}
                      />
                    </div>
                    <div>
                      <p className="m-0 __label">Equipment</p>
                      <CheckPickerOpex
                        className="mr-3"
                        data={equipments}
                        defaultCheckAll={true}
                        placeholder="Equipment"
                        labelKey="equipment_name"
                        valueKey="equipment_id"
                        value={selectedEquipment}
                        onChange={selected => setSelectedEquipment(selected)}
                        style={{ maxWidth: 400, width: 300 }}
                      />
                    </div>

                    {showSearchText && (
                      <div>
                        <p className="m-0 __label">Search</p>
                        <InputGroup
                          inside
                          size="md"
                          className="mr-3"
                          style={{ maxWidth: 400, width: 180 }}
                        >
                          <Input
                            maxLength={255}
                            placeholder="Search"
                            value={searchText}
                            onChange={text => setSearchText(text)}
                          />
                          <InputGroup.Addon>
                            <Icon icon="search" />
                          </InputGroup.Addon>
                        </InputGroup>
                      </div>
                    )}
                    <Button
                      color="primary"
                      size="sm"
                      type="button"
                      className="btn-rounded pd-big align-self-end"
                      onClick={applyFilter}
                    >
                      Apply
                    </Button>
                  </>
                ) : (
                  <Loader center content="Loading" />
                )}
              </div>
            </CardBody>
          </Card>
        </FilterCollapsible>
      </div>
    </>
  )
}
export default FilterLostcook
