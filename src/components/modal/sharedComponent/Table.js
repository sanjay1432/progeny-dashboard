import React, { useState } from "react"
import { getDashboardData } from "redux/actions/dashboarddata.action"
import { Table, Loader, Checkbox } from "rsuite"
const { Column, HeaderCell, Cell } = Table

const currentTableDataFields = []
const DataTable = ({ columns, data, expandedCell, renderExpandedCell }) => {
  const [loading, setLoading] = useState(false)
  const [checkStatus, setCheckStatus] = useState([])

  const availableKeys = Object.keys(data[0])
  console.log("availableKeys", availableKeys)
  availableKeys.forEach(setKey => {
    const field = columns.find(field => field.value === setKey)
    if (field) {
      currentTableDataFields.push(field)
    }
  })

  function getData() {
    return data.filter((v, i) => {
      v["check"] = false
      v["rowNumber"] = i
      return i
    })
  }
  console.log(data)
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
    disabled = true
  } else if (checkStatus.length > 0 && checkStatus.length < data.length) {
    indeterminate = true
  } else if (checkStatus.length === data.length) {
    checked = true
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? data.map(item => item.rowNumber) : []
    setCheckStatus(keys)
  }

  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
  }

  return (
    <div>
      {columns && data ? (
        <div>
          <Table
            data={getData()}
            height={400}
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
                dataKey="rowNumber"
                checkedKeys={checkStatus}
                onChange={handleCheck}
              />
            </Column>

            {columns.map(col => {
              const width = col.width ? col.width : false
              const flexGrow = col.flexGrow ? col.flexGrow : false
              const fixed = col.fixed ? col.fixed : false
              return (
                <Column width={width ? width : flexGrow} fixed={fixed}>
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
