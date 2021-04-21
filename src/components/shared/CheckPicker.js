import React, { useEffect, useRef, useState } from "react"
import { Button } from "reactstrap"
import { CheckPicker, Checkbox } from "rsuite"

const footerStyles = {
  padding: "10px 2px",
  borderTop: "1px solid #e5e5e5"
}

const footerButtonStyle = {
  float: "right",
  marginRight: 10,
  marginTop: 2
}

const CheckPickerOpex = ({
  data,
  valueKey = "value",
  labelKey = "label",
  placeholder = "Select",
  onChange,
  value,
  defaultCheckAll = false,
  ...props
}) => {
  const [checkAll, setCheckAll] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  let picker = useRef()

  const handleCheckAll = (valueLabel, checked) => {
    const allValue = data.map(item => item[valueKey])
    const nextValue = checked ? allValue : []
    setCheckAll(checked)
    setIndeterminate(false)
    onChange(nextValue)
  }

  const handleChange = valueLabel => {
    const allValue = data.map(item => item[valueKey])
    setCheckAll(valueLabel.length === allValue.length)
    setIndeterminate(
      valueLabel.length > 0 && valueLabel.length < allValue.length
    )
    onChange(valueLabel)
  }

  useEffect(() => {
    let selectedAllData = []
    if (data !== null && defaultCheckAll) {
      selectedAllData = data.map(item => item[valueKey])
      setCheckAll(true)
      setIndeterminate(false)
      onChange(selectedAllData)
    }
  }, [data, defaultCheckAll])

  return (
    <>
      <CheckPicker
        {...props}
        onChange={selected => handleChange(selected)}
        placeholder={placeholder}
        data={data}
        labelKey={labelKey}
        valueKey={valueKey}
        value={value}
        ref={ref => (picker = ref)}
        renderExtraFooter={() => (
          <div style={footerStyles}>
            <Checkbox
              inline
              indeterminate={indeterminate}
              checked={checkAll}
              onChange={(valueLabel, checked) =>
                handleCheckAll(valueLabel, checked)
              }
            >
              Select All
            </Checkbox>

            <Button
              style={footerButtonStyle}
              color="primary"
              size="sm"
              onClick={() => {
                picker.close()
              }}
            >
              Ok
            </Button>
          </div>
        )}
      />
    </>
  )
}
export default CheckPickerOpex
