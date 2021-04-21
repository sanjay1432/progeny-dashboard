import React, { useEffect, useState } from "react"
import { CardBody, Card, Button } from "reactstrap"
import { InputPicker, DateRangePicker, Loader } from "rsuite"
import moment from "moment"
import FilterCollapsible from "components/shared/FilterCollapsible"
import {
  FREQUENCY_SELECT_OPTS,
  FILTER_DATE_RANGES
} from "../../../../constants"
import CheckPickerOpex from "../../../shared/CheckPicker"
const typeOpts = [
  {
    value: "1",
    label: "Pulp"
  }
]

const Filter = ({ kpisCategories, processLines, onFilter }) => {
  const [dateRange, setDateRange] = useState([
    new Date(moment(new Date()).add(-30, "days").format("YYYY-MM-DD")),
    new Date()
  ])
  const [frequency, setFrequency] = useState(FREQUENCY_SELECT_OPTS[0].value)
  const [type, setType] = useState(typeOpts[0].value)
  const [selectedKPIs, setSelectedKPIs] = useState([])
  const [selectedProcessLines, setSelectedProcessLines] = useState(["FL3"])

  const applyFilter = () => {
    if (onFilter) {
      const params = {
        type,
        selectedProcessLines,
        frequency,
        dateRange
      }
      onFilter(selectedKPIs, params)
    }
  }

  useEffect(() => {
    if (kpisCategories !== null && processLines !== null) {
      const kpis = kpisCategories.map(item => item.kpiId)
      const process = processLines
        .filter(item => !item.processLineCode.toUpperCase().startsWith("PD"))
        .map(item => item.processLineCode)
      setSelectedProcessLines(process)
      if (onFilter) {
        const params = {
          type,
          selectedProcessLines: process,
          frequency,
          dateRange
        }
        onFilter(kpis, params)
      }
    }
  }, [kpisCategories, processLines])

  return (
    <>
      <FilterCollapsible>
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

                <CheckPickerOpex
                  className="mr-3"
                  data={kpisCategories}
                  defaultCheckAll={true}
                  labelKey="kpiNameWithUnit"
                  valueKey="kpiId"
                  placeholder="Select KPI"
                  value={selectedKPIs}
                  onChange={selected => setSelectedKPIs(selected)}
                  style={{ maxWidth: 400, width: 300 }}
                />
                <CheckPickerOpex
                  className="mr-3"
                  data={processLines}
                  defaultCheckAll={false}
                  labelKey="processLineName"
                  valueKey="processLineCode"
                  placeholder="Select Process Line"
                  value={selectedProcessLines}
                  style={{ maxWidth: 400, width: 150 }}
                  onChange={selected => setSelectedProcessLines(selected)}
                />

                <InputPicker
                  onChange={selected => setFrequency(selected)}
                  className="mr-3"
                  data={FREQUENCY_SELECT_OPTS}
                  defaultValue={frequency}
                  cleanable={false}
                  style={{ maxWidth: 400, width: 150 }}
                />
                <DateRangePicker
                  placement="auto"
                  className="mr-3"
                  format="DD MMM YYYY"
                  appearance="default"
                  ranges={FILTER_DATE_RANGES}
                  cleanable={false}
                  value={dateRange}
                  onChange={selected => setDateRange(selected)}
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
    </>
  )
}
export default Filter
