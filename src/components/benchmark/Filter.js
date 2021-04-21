import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { CardBody, Card, Button } from "reactstrap"
import { InputPicker, DateRangePicker, Loader, TagPicker } from "rsuite"
import moment from "moment"
import FilterCollapsible from "components/shared/FilterCollapsible"
import { setDisplayPeriods } from "redux/actions/dashboard.action"
import { Alert } from "rsuite"
import {
  MILL_LIST,
  BUSINESS_UNIT_LIST,
  FILTER_DATE_RANGES
} from "../../constants"
import CheckPickerOpex from "../shared/CheckPicker"

const typeOpts = BUSINESS_UNIT_LIST.filter(item => item.buId === 1).map(s => {
  return {
    label: s.buName,
    value: s.buId
  }
})

const periodicitySelectOpts = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" }
]

const Filter = ({ kpisCategories, processLines, onFilter }) => {
  const [dateRange, setDateRange] = useState([])
  const [selectedKPIs, setSelectedKPIs] = useState([])
  const [periodicity, setPeriodicity] = useState(periodicitySelectOpts[0].value)
  const [type, setType] = useState(typeOpts[0].value)
  const [selectedMills, setSelectedMills] = useState([])
  const dispatch = useDispatch()

  const applyFilter = () => {
    if (onFilter) {
      if (selectedMills.length < 2) {
        Alert.error("At least 2 mills are required", 5000)
        return
      }

      if (selectedKPIs.length < 1) {
        Alert.error("At least 1 kpi is required", 5000)
        return
      }

      let periods = []
      if (dateRange && dateRange.length > 0) {
        periods.push(dateRange)
      }
      if (periods.length < 1) {
        periods = []
        Alert.error("Period is required", 5000)
        return
      }

      dispatch(setDisplayPeriods(periods))

      const params = {
        buId: type,
        millId: selectedMills,
        frequency: periodicity,
        selectedKPIs,
        startDate: moment(dateRange[0]).format("YYYY-MM-DD"),
        endDate: moment(dateRange[1]).format("YYYY-MM-DD")
      }
      onFilter(params)
    }
  }
  return (
    <>
      <div className="opex-panel-content col-md-12">
        <div className="__header">
          <FilterCollapsible header="Please select the filter to read Benchmarking KPI">
            <Card>
              <CardBody>
                {kpisCategories && processLines ? (
                  <>
                    <InputPicker
                      onChange={selected => setType(selected)}
                      className="mr-3"
                      data={typeOpts}
                      defaultValue="1"
                      cleanable={false}
                      style={{ maxWidth: 400, width: 150 }}
                    />
                    <TagPicker
                      onChange={selected => setSelectedMills(selected)}
                      placeholder="Select Mills"
                      className="mr-3"
                      data={MILL_LIST}
                      labelKey="name"
                      valueKey="millId"
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
                      value={dateRange}
                      onChange={selected => setDateRange(selected)}
                    />
                    <InputPicker
                      onChange={selected => setPeriodicity(selected)}
                      className="mr-3"
                      data={periodicitySelectOpts}
                      defaultValue={periodicity}
                      cleanable={false}
                      style={{ maxWidth: 400, width: 150 }}
                    />
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
      </div>
    </>
  )
}
export default Filter
