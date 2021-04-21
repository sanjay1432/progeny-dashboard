import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { CardBody, Card, Button } from "reactstrap"
import { InputPicker, DateRangePicker, Loader, TagPicker } from "rsuite"
import moment from "moment"
import FilterCollapsible from "components/shared/FilterCollapsible"
import {
  setDisplayPeriods,
  setDisplayProcessLine
} from "redux/actions/dashboard.action"
import { FILTER_DATE_RANGES } from "../../constants"
import { Alert } from "rsuite"
import CheckPickerOpex from "../shared/CheckPicker"

const Filter = ({ kpisCategories, processLines, onFilter }) => {
  const mill = useSelector(state => state.appReducer.mill)
  const [showPeriods, setshowPeriods] = useState(2)
  const [dateRange1, setDateRange1] = useState([])
  const [dateRange2, setDateRange2] = useState([])
  const [dateRange3, setDateRange3] = useState([])
  const [dateRange4, setDateRange4] = useState([])
  const [selectedKPIs, setSelectedKPIs] = useState([])
  const [selectedProcessLines, setSelectedProcessLines] = useState([])
  const dispatch = useDispatch()

  const applyPeriod = e => {
    e.preventDefault()
    if (showPeriods >= 2 && showPeriods < 4) setshowPeriods(showPeriods + 1)
    else setshowPeriods(2)
  }

  const applyFilter = () => {
    if (onFilter) {
      var selectedPLine = processLines.filter(
        s => s.processLineCode === selectedProcessLines
      )[0]
      if (!selectedPLine) {
        Alert.error("Process line is required", 5000)
        return
      }

      let periods = []
      if (dateRange1 && dateRange1.length > 0)
        periods.push({
          startDate: moment(dateRange1[0]).format("YYYY-MM-DD"),
          endDate: moment(dateRange1[1]).format("YYYY-MM-DD")
        })
      if (dateRange2 && dateRange2.length > 0)
        periods.push({
          startDate: moment(dateRange2[0]).format("YYYY-MM-DD"),
          endDate: moment(dateRange2[1]).format("YYYY-MM-DD")
        })
      if (showPeriods >= 3 && dateRange3 && dateRange3.length > 0)
        periods.push({
          startDate: moment(dateRange3[0]).format("YYYY-MM-DD"),
          endDate: moment(dateRange3[1]).format("YYYY-MM-DD")
        })
      if (showPeriods >= 4 && dateRange4 && dateRange4.length > 0)
        periods.push({
          startDate: moment(dateRange4[0]).format("YYYY-MM-DD"),
          endDate: moment(dateRange4[1]).format("YYYY-MM-DD")
        })

      if (periods.length < 2) {
        periods = []
        Alert.error("At least 2 filter periods are required", 5000)
        return
      }

      dispatch(setDisplayPeriods(periods))
      dispatch(setDisplayProcessLine(selectedPLine))

      const params = {
        kpiId: selectedKPIs,
        processLine: selectedProcessLines,
        dateRanges: periods,
        buId: mill.buId,
        millId: mill.millId
      }
      onFilter(params)
    }
  }
  return (
    <>
      <div className="opex-panel-content col-md-12">
        <div className="__header">
          <FilterCollapsible header="Please select the filter to read KPI">
            <Card>
              <CardBody>
                {kpisCategories && processLines ? (
                  <>
                    <InputPicker
                      onChange={selected => setSelectedProcessLines(selected)}
                      placeholder="Select Process Line"
                      className="mr-3"
                      data={processLines}
                      labelKey="processLineName"
                      valueKey="processLineCode"
                      style={{ maxWidth: 400, minWidth: 150 }}
                    />
                    <CheckPickerOpex
                      className="mr-3"
                      data={kpisCategories}
                      defaultCheckAll={false}
                      labelKey="kpiNameWithUnit"
                      valueKey="kpiId"
                      placeholder="Select KPI"
                      value={selectedKPIs}
                      onChange={selected => setSelectedKPIs(selected)}
                      style={{ maxWidth: 400, width: 300 }}
                    />
                    <DateRangePicker
                      placement="auto"
                      className="mr-3"
                      appearance="default"
                      ranges={FILTER_DATE_RANGES}
                      cleanable={false}
                      value={dateRange1}
                      onChange={selected => setDateRange1(selected)}
                    />
                    <DateRangePicker
                      placement="auto"
                      className="mr-3"
                      appearance="default"
                      ranges={FILTER_DATE_RANGES}
                      cleanable={false}
                      value={dateRange2}
                      onChange={selected => setDateRange2(selected)}
                    />
                    {showPeriods >= 3 ? (
                      <DateRangePicker
                        placement="auto"
                        className="mr-3"
                        appearance="default"
                        ranges={FILTER_DATE_RANGES}
                        cleanable={false}
                        value={dateRange3}
                        onChange={selected => setDateRange3(selected)}
                      />
                    ) : (
                      ""
                    )}

                    {showPeriods >= 4 ? (
                      <DateRangePicker
                        placement="auto"
                        className="mr-3"
                        appearance="default"
                        ranges={FILTER_DATE_RANGES}
                        cleanable={false}
                        value={dateRange4}
                        onChange={selected => setDateRange4(selected)}
                      />
                    ) : (
                      ""
                    )}

                    {showPeriods < 4 ? (
                      <a
                        href="#"
                        className="text-primary"
                        onClick={e => applyPeriod(e)}
                      >
                        Add Period
                      </a>
                    ) : (
                      <a
                        href="#"
                        className="text-danger"
                        onClick={e => applyPeriod(e)}
                      >
                        Remove Period
                      </a>
                    )}
                    <Button
                      color="primary"
                      size="sm"
                      type="button"
                      className="btn-rounded pd-big"
                      onClick={applyFilter}
                    >
                      Apply
                    </Button>
                  </>
                ) : (
                  <Loader center content="Loading" />
                )}
              </CardBody>
            </Card>
          </FilterCollapsible>
        </div>
        <div className="__content mt-3"></div>
      </div>
    </>
  )
}
export default Filter
