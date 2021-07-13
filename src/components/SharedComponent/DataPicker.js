import React from "react"
import { InputPicker } from "rsuite"
import CreatableSelect from "react-select/creatable"

const SelectionData = {}
const DataPicker = ({
  OriginalData,
  completedData,
  dataType,
  dataValue,
  placeholder,
  searchable,
  selectAllData,
  ...props
}) => {
  const Picker = [dataType]
  Picker.forEach(obj => {
    if (OriginalData !== undefined) {
      const data = [...new Set(OriginalData.map(res => res[obj]))]
      SelectionData[Picker] = data
    } else {
      SelectionData[Picker] = completedData
    }
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

  function handleInputChange(value) {
    console.log(value)
    props.onChange(value.value)
  }

  return (
    <>
      {searchable === "true" ? (
        <CreatableSelect
          name={dataType}
          className="InputSelectPicker"
          placeholder={placeholder}
          value={dataValue}
          onChange={(value, e) => handleInputChange(value)}
          options={DataInPicker}
        />
      ) : (
        <InputPicker
          name={dataType}
          placeholder={placeholder}
          className="dataPicker"
          data={DataInPicker}
          value={dataValue}
          onChange={(value, e) => handleChange(value)}
        />
      )}
    </>
  )
}

export default DataPicker
