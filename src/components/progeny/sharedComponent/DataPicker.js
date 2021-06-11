import React from "react"
import { SelectPicker } from "rsuite"

const SelectionData = {}
const DataPicker = ({ OriginalData, dataType, ...props }) => {
  const Picker01 = [dataType]
  Picker01.forEach(obj => {
    const data = [...new Set(OriginalData.map(res => res[obj]))]
    SelectionData[Picker01] = data
  })

  const pureData = SelectionData[Picker01]
  let DataInPicker = []
  if (pureData) {
    pureData.forEach(data => {
      DataInPicker.push({
        label: data,
        value: data
      })
    })
  } else {
    DataInPicker.push({
      label: "no data",
      value: "no data"
    })
  }

  const handleChange = value => {
    props.onChange(value)
  }

  return (
    <>
      <SelectPicker
        name={dataType}
        data={DataInPicker}
        onChange={(value, e) => handleChange(value)}
      />
    </>
  )
}

export default DataPicker
