import React, { forwardRef } from "react"
import { Input, SelectPicker, ControlLabel } from "rsuite"
const Filter = forwardRef(
  (
    { selected, onUpdate, filter, filterData, currentSubNavState, ...props },
    ref
  ) => {
    const dataToFilter = []
    console.log(filterData)
    if (filterData) {
      filterData.forEach(filter => {
        dataToFilter.push({
          label: filter,
          value: filter
        })
      })
    } else {
      dataToFilter.push({
        label: "not available",
        value: "not available"
      })
    }

    function onChangeSelection(e) {
      onUpdate(e)
    }
    console.log(filter.name)
    console.log("selected", selected)
    return (
      <>
        <ControlLabel>{filter.label}</ControlLabel>
        {filter.type === "select" ? (
          <SelectPicker
            id={filter.name}
            data={dataToFilter}
            value={selected ? selected.value : null}
            style={{ width: "100%" }}
            disabled={filter.disable}
            onChange={(value, e) =>
              onChangeSelection({ target: { name: filter.name, value: value } })
            }
          />
        ) : (
          <Input
            id={filter.name}
            name={filter.name}
            placeholder={` Enter ${filter.label}`}
            onChange={(value, e) =>
              onUpdate({ target: { name: filter.name, value: value } })
            }
          />
        )}
      </>
    )
  }
)

export default Filter
