import React, { forwardRef } from "react"
import { Input, SelectPicker } from "rsuite"

const Filter = forwardRef(
  (
    { selected, onUpdate, filter, filterData, currentSubNavState, ...props },
    ref
  ) => {
    const dataToFilter = []
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

    return (
      <SelectPicker
        className="filter"
        data={dataToFilter}
        value={selected ? selected.value : null}
        onChange={(value, e) =>
          onChangeSelection({ target: { name: filter.name, value: value } })
        }
      />
    )
  }
)

export default Filter
