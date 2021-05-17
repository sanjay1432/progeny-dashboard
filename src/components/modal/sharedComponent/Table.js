import React, { useState } from "react"
import { Table, Loader } from "rsuite"
const { Column, HeaderCell, Cell, Pagination } = Table

const DataTable = ({ columns, data }) => {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortType, setSortType] = useState(null)

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
          <Table data={getData()} height={450} bordered loading={loading}>
            {columns.map(col => {
              const width = col.width ? col.width : 50
              const fixed = col.fixed ? col.fixed : false
              const dataKey = col.dataKey
              const customCell = col.customCell
              return (
                <Column width={width} fixed={fixed}>
                  <HeaderCell>{col.name}</HeaderCell>
                  {customCell ? customCell : <Cell dataKey={dataKey} />}
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
