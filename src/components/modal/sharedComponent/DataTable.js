import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Table, Loader, Checkbox } from "rsuite"
const { Column, HeaderCell, Cell } = Table

const currentTableDataFields = []
const DataTable = ({ columns, data, selectedItem, modalType, ...props }) => {
  const [checkStatus, setCheckStatus] = useState([])

  const filterData = useSelector(state => state.filterReducer)

  const availableKeys = Object.keys(data[0])
  availableKeys.forEach(setKey => {
    const field = columns.find(columnField => columnField.value === setKey)
    if (field) {
      currentTableDataFields.push(field)
    }
  })

  function getData() {
    if (Object.keys(filterData).length > 0 && filterData.filter !== "") {
      data = filterTable(filterData.filter, data)
    }
    return data
  }

  function filterTable(filters, tableData) {
    var filterKeys = Object.keys(filters)
    return tableData.filter(function (eachObj) {
      return filterKeys.every(function (eachKey) {
        return eachObj[eachKey] === filters[eachKey]
      })
    })
  }

  const CheckCell = ({
    rowData,
    onChange,
    checkedKeys,
    dataKey,
    ...checkProps
  }) => (
    <Cell {...checkProps} style={{ padding: 0 }}>
      <div>
        <Checkbox
          value={rowData[dataKey]}
          inline
          onChange={onChange} //onChange = handleCheck
          checked={checkedKeys.some(item => item === rowData[dataKey])} //checkedKeys === checkStatus
        />
      </div>
    </Cell>
  )

  let checked = false
  let indeterminate = false

  if (checkStatus.length > 0 && checkStatus.length < data.length) {
    indeterminate = true
  } else if (checkStatus.length === data.length) {
    checked = true
  }

  const handleCheckAll = (value, checkedAllItem) => {
    if (modalType === "AssignUser") {
      const keys = checkedAllItem ? data.map(item => item.userId) : []
      setCheckStatus(keys)
      props.onChange(keys)
    } else if (modalType === "AssignEstate") {
      const keys = checkedAllItem ? data.map(item => item.estate) : []
      setCheckStatus(keys)
      props.onChange(keys)
    }
  }

  const handleCheck = (value, checkedItem, e) => {
    const keys = checkedItem
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
    props.onChange(keys)
    //console.log(checkStatus)
  }

  return (
    <div>
      {columns && data ? (
        <div>
          <Table id="modalTable" data={getData()} height={400} bordered>
            <Column width={60}>
              <HeaderCell>
                {" "}
                <Checkbox
                  checked={checked}
                  indeterminate={indeterminate}
                  onChange={handleCheckAll}
                />
              </HeaderCell>
              <CheckCell
                dataKey={columns[0].dataKey} //Primary key of table
                checkedKeys={checkStatus}
                onChange={handleCheck}
              />
            </Column>

            {columns.map(col => {
              const width = col.width ? col.width : false
              const flexGrow = col.flexGrow ? col.flexGrow : false
              const fixed = col.fixed ? col.fixed : false
              return (
                <Column width={width} flexGrow={flexGrow} fixed={fixed}>
                  <HeaderCell>{col.name}</HeaderCell>

                  {col.customCell ? (
                    <col.customCell dataKey={col.dataKey} />
                  ) : (
                    <Cell dataKey={col.dataKey} />
                  )}
                </Column>
              )
            })}
          </Table>
        </div>
      ) : (
        <Loader center content="Loading" />
      )}
    </div>
  )
}

export default DataTable
