import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Input, InputGroup, Icon, SelectPicker, ControlLabel } from "rsuite"
const Filter = forwardRef(
  ({ onUpdate, filter, currentSubNavState, ...props }, ref) => {
    const selectInputRef = useRef()
    const styles = {
      width: 300,
      marginBottom: 10
    }

    const data = [
      {
        label: "Eugenia",
        value: "Eugenia",
        role: "Master"
      },
      {
        label: "Kariane",
        value: "Kariane",
        role: "Master"
      },
      {
        label: "Louisa",
        value: "Louisa",
        role: "Master"
      },
      {
        label: "Marty",
        value: "Marty",
        role: "Master"
      },
      {
        label: "Kenya",
        value: "Kenya",
        role: "Master"
      },
      {
        label: "Hal",
        value: "Hal",
        role: "Developer"
      },
      {
        label: "Julius",
        value: "Julius",
        role: "Developer"
      },
      {
        label: "Travon",
        value: "Travon",
        role: "Developer"
      },
      {
        label: "Vincenza",
        value: "Vincenza",
        role: "Developer"
      },
      {
        label: "Dominic",
        value: "Dominic",
        role: "Developer"
      },
      {
        label: "Pearlie",
        value: "Pearlie",
        role: "Guest"
      },
      {
        label: "Tyrel",
        value: "Tyrel",
        role: "Guest"
      },
      {
        label: "Jaylen",
        value: "Jaylen",
        role: "Guest"
      },
      {
        label: "Rogelio",
        value: "Rogelio",
        role: "Guest"
      }
    ]

    const [selectedOption, setSelectedOption] = useState({})

    useImperativeHandle(ref, () => ({
      onClear() {
        console.log(selectedOption)
        // selectInputRef.current.state.value = null
        setSelectedOption(null)
      }
    }))

    function onChangeSelection(e) {
      console.log(e.target.value)

      // setSelectedOption(e.target.value)
      setSelectedOption(() => ({
        ...selectedOption,
        [e.target.name]: e.target.value
      }))
      onUpdate(e)
    }
    return (
      <>
        <ControlLabel>{filter.label}</ControlLabel>
        {filter.type === "select" ? (
          <SelectPicker
            ref={selectInputRef}
            id={filter.name}
            data={data}
            value={selectedOption?.value}
            style={{ width: "100%" }}
            onChange={(value, e) =>
              onChangeSelection({ target: { name: filter.name, value: value } })
            }
          />
        ) : (
          <Input
            ref={selectInputRef}
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
