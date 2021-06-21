import React from "react"
import { SelectPicker } from "rsuite"

let selectionData = {}
const SelectFilter = ({ data, dataType, selectedData, onUpdate }) => {
  const selectionType = [{ name: dataType }]

  if (data) {
    selectionType.forEach(filter => {
      const selectionLabel = dataType
      const selectiondata = [...new Set(data.map(res => res[selectionLabel]))]
      selectionData[selectionLabel] = selectiondata
      console.log(selectionLabel)
    })
  }
  const dataInSelection = []
  const filterData = selectionData[dataType]

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

  function onChangeSelection(e) {
    onUpdate(e)
  }

  return (
    <SelectPicker
      className="modalSelectFilter"
      data={dataInSelection}
      value={selectedData ? selectedData.value : null}
      onChange={(value, e) =>
        onChangeSelection({ target: { name: dataType, value: value } })
      }
    />
  )
}

export default SelectFilter
