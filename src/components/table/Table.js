import React, { useState } from "react"
import { Scrollbars } from "react-custom-scrollbars"
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

  //const sortData

  const paging = dataArr => {
    return dataArr.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i => start && i < end
    })
  }

  const handleSortColumn = (sortColumnData, sortTypeLabel) => {
    setLoading(true)

    setTimeout(() => {
      setSortColumn(sortColumnData)
      setSortColumn(sortTypeLabel)
      setLoading(false)
    })
  }

  const handleChangePage = dataKey => {
    setPage(dataKey)
  }

  const handleChangeLength = dataKey => {
    setPage(1)
    setDisplayLength(dataKey)
  }

  //const CheckCell = ({ rowData, dataKey, ...props }) => (
  //    <Cell {...props}>
  //          <input type="checkbox" id="id" value={rowData[dataKey]} />
  //    </Cell>
  //)

  return (
    <div>
      <Scrollbars style={{ height: `calc(100vh - 190px)` }}>
        {columns && data ? (
          <div>
            <Table data={getData()} autoHeight bordered loading={loading}>
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
            <Pagination
              lengthMenu={[
                {
                  value: 10,
                  label: 10
                },
                {
                  value: 20,
                  label: 20
                }
              ]}
              activePage={page}
              displayLength={displayLength}
              total={data.length}
              onChangePage={handleChangePage}
              onChangeLength={handleChangeLength}
            />
          </div>
        ) : (
          <Loader center content="Loading" />
        )}
      </Scrollbars>
    </div>
  )
}

export default DataTable
