import React from "react"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Pagination from "@material-ui/lab/Pagination"

const OpexBasicTable = ({ tableData }) => {
  const [page, setPage] = React.useState(1)
  const rowsPerPage = 5
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  return (
    <>
      <div className="opex-table">
        {tableData && tableData.columns && tableData.rows ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {tableData.columns.map(column => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.rows
                    .slice(
                      (page - 1) * rowsPerPage,
                      (page - 1) * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => {
                      return (
                        <TableRow tabIndex={-1} key={index + Date.now()}>
                          {tableData.columns.map(column => {
                            const value = row[column.id]
                            if (typeof value === "object") {
                              return (
                                <TableCell
                                  key={column.id + Date.now()}
                                  align={column.align}
                                >
                                  {column.format
                                    ? column.format(value)
                                    : value.value}
                                </TableCell>
                              )
                            } else {
                              return (
                                <TableCell
                                  key={column.id + Date.now()}
                                  align={column.align}
                                >
                                  {column.format ? column.format(value) : value}
                                </TableCell>
                              )
                            }
                          })}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(tableData.rows.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
            />
          </>
        ) : (
          ""
        )}
      </div>
    </>
  )
}

export default OpexBasicTable
