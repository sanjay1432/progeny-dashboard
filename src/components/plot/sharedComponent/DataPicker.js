import React from "react"
import { InputPicker } from "rsuite"

const SelectionData = {}
const DataPicker = ({
  OriginalData,
  dataType,
  dataValue,
  selectAllData,
  ...props
}) => {
  const Picker = [dataType]
  Picker.forEach(obj => {
    const data = [...new Set(OriginalData.map(res => res[obj]))]
    SelectionData[Picker] = data
  })

  const pureData = SelectionData[Picker]
  let DataInPicker = []
  if (pureData) {
    pureData.forEach(data => {
      DataInPicker.push({
        label: data,
        value: data
      })
    })
    if (selectAllData !== undefined) {
      DataInPicker.unshift({
        label: selectAllData,
        value: "all"
      })
    }
  } else {
    DataInPicker.push({
      label: "no data",
      value: "no data"
    })
  }

  function handleChange(value) {
    props.onChange(value)
  }

  return (
    <>
      <InputPicker
        name={dataType}
        className="dashboardSelectFilter"
        data={DataInPicker}
        value={dataValue}
        onChange={(value, e) => handleChange(value)}
      />
    </>
  )
}

export default DataPicker
