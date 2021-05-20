import React, { useState } from "react"
import { Table, Loader } from "rsuite"
import Estate from "views/Estate"
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
            {columns.map(col => {
              const width = col.width ? col.width : 50
              const fixed = col.fixed ? col.fixed : false
              return (
                <Column width={width} fixed={fixed}>
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
