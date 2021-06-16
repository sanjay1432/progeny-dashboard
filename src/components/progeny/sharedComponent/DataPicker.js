import React from "react"
import { InputPicker } from "rsuite"

const SelectionData = {}
const DataPicker = ({ OriginalData, dataType, dataValue, ...props }) => {
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
      <InputPicker
        name={dataType}
        data={DataInPicker}
        value={dataValue}
        onChange={(value, e) => handleChange(value)}
      />
    </>
  )
}

export default DataPicker
