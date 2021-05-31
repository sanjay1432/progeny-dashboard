import React, { useState } from "react"
import { Table, Loader, Checkbox } from "rsuite"
const { Column, HeaderCell, Cell } = Table

const DataTable = ({ columns, data, expandedCell, renderExpandedCell }) => {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortType, setSortType] = useState(null)
  const [checkStatus, setCheckStatus] = useState([])
  //console.log(renderExpandedCell)
  const getData = () => {
    //setLoading(true)
    return data.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
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
            <Column>
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
              const flexgrow = col.flexgrow ? col.flexgrow : false
              const fixed = col.fixed ? col.fixed : false
              return (
                <Column width={width ? width : flexgrow} fixed={fixed}>
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
