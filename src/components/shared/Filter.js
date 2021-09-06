import React, { forwardRef } from "react"
import { Input, SelectPicker, ControlLabel } from "rsuite"
const Filter = forwardRef(
  (
    { selected, onUpdate, filter, filterData, currentSubNavState, ...props },
    ref
  ) => {
    const dataToFilter = []
   console.log({selected})
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

    function onChangeSelection(e, value) {
      onUpdate(e)
      console.log(e)
    }

    return (
      <>
        <ControlLabel className="labelFilter">{filter.label}</ControlLabel>
        {filter.type === "select" ? (
          <SelectPicker
            id={filter.name}
            className="dashboardSelectFilter"
            data={dataToFilter}
            value={selected ? selected.value : null}
            disabled={filter.disable}
            onChange={(value, e) =>
              onChangeSelection({ target: { name: filter.name, value: value } })
            }
          />
        ) : (
          <Input
            id={filter.name}
            className="dashboardInputFilter"
            name={filter.name}
            value={selected ? selected : null}
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
