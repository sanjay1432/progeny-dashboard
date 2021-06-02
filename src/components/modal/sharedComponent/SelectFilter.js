import React, { forwardRef } from "react"
import { Input, SelectPicker } from "rsuite"

let selectionData = {}
const SelectFilter = ({ data, dataType }) => {
  const selectionType = [{ name: dataType }]

  if (data) {
    selectionType.forEach(filter => {
      const selectionLabel = dataType
      const selectiondata = [...new Set(data.map(res => res[selectionLabel]))]
      selectionData[selectionLabel] = selectiondata
    })
  }
  const dataInSelection = []
  const filterData = selectionData["position"]

  if (filterData) {
    filterData.forEach(data => {
      dataInSelection.push({
        label: data,
        value: data
      })
    })
  } else {
    dataInSelection.push({
      label: "not data available",
      value: "not data available"
    })
  }

  return <SelectPicker className="filter" data={dataInSelection} />
}

export default SelectFilter
