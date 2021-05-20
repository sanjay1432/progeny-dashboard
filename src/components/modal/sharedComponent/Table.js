import React, { useState } from "react"
import { Table, Loader } from "rsuite"
import Estate from "views/Estate"
const { Column, HeaderCell, Cell } = Table

const DataTable = ({ columns, data, expandedCell, renderExpandedCell }) => {
  const [loading, setLoading] = useState(false)

  function getData() {
    //if(Object.keys())
  }

  return (
    <div>
      {columns && data ? (
        <div>
          <Table
            data={data}
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
                    <col.cell />
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
