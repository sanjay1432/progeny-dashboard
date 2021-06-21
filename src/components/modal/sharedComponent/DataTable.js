import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Table, Loader, Checkbox } from "rsuite"
const { Column, HeaderCell, Cell } = Table

const currentTableDataFields = []
const DataTable = ({
  columns,
  data,
  expandedCell,
  renderExpandedCell,
  selectedItem,
  ...props
}) => {
  const [loading, setLoading] = useState(false)
  const [checkStatus, setCheckStatus] = useState([])

  const filterData = useSelector(state => state.filterReducer)

  const availableKeys = Object.keys(data[0])
  availableKeys.forEach(setKey => {
    const field = columns.find(field => field.value === setKey)
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

  function filterTable(filters, data) {
    var filterKeys = Object.keys(filters)
    return data.filter(function (eachObj) {
      return filterKeys.every(function (eachKey) {
        return eachObj[eachKey] === filters[eachKey]
      })
    })
  }

  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div>
        <Checkbox
          value={rowData[dataKey]}
          inline
          onChange={onChange}
          checked={checkedKeys.some(item => item === rowData[dataKey])}
        />
      </div>
    </Cell>
  )

  let checked = false
  let indeterminate = false
  let disabled = true

  if (checkStatus.length === 0) {
    checked = false
    indeterminate = false
    disabled = true
  } else if (checkStatus.length > 0 && checkStatus.length < data.length) {
    checked = false
    indeterminate = true
    disabled = false
  } else if (checkStatus.length === data.length) {
    checked = true
    indeterminate = false
    disabled = false
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? data.map(item => item.userId) : []
    setCheckStatus(keys)
  }

  const handleCheck = (value, checked, e) => {
    const keys = checked
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
    props.onChange(keys)
  }

  return (
    <div>
      {columns && data ? (
        <div>
          <Table
            id="modalTable"
            data={getData()}
            height={390}
            bordered
            loading={loading}
            expandedRowKeys={expandedCell}
            renderRowExpanded={renderExpandedCell}
          >
            <Column width={80}>
              <HeaderCell>
                {" "}
                <Checkbox
                  checked={checked}
                  indeterminate={indeterminate}
                  onChange={handleCheckAll}
                />
              </HeaderCell>
              <CheckCell
                dataKey={columns[0].dataKey}
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
                  {col.name ? (
                    <HeaderCell>{col.name}</HeaderCell>
                  ) : (
                    <HeaderCell>{col.name}</HeaderCell>
                  )}

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
