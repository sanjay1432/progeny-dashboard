import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import LostcookService from "../../../services/lostcook.service"
import { CANCEL_REQUEST } from "../../../constants"
import axios from "axios"
import { Alert, Loader, Table } from "rsuite"
import GeneralHelper from "../../../helper/general.helper"
import ReadMoreOnTable from "../../shared/ReadMoreOnTable"
const { Column, HeaderCell, Cell, Pagination } = Table

const cols = [
  {
    label: "Index",
    dataKey: "lc_id"
  },
  {
    label: "Date",
    dataKey: "date"
  },
  {
    label: "Fiberline",
    dataKey: "fiberlineName"
  },
  {
    label: "Area",
    dataKey: "area"
  },
  {
    label: "Responsibility",
    dataKey: "responsibility"
  },
  {
    label: "Equipment",
    dataKey: "equipment"
  },
  {
    label: "Problems",
    dataKey: "problem"
  },
  {
    label: "Loss(Adt)",
    dataKey: "lostcook"
  },
  {
    label: "Loss(Cook Number)",
    dataKey: "loss"
  },
  {
    label: "Throughput",
    dataKey: "adt"
  },
  {
    label: "Explanation",
    dataKey: "lc_explanation",
    rows: 3
  },
  {
    label: "Root Cause",
    dataKey: "lc_root_cause",
    rows: 3
  },
  {
    label: "Action",
    dataKey: "lc_action",
    rows: 3
  },
  {
    label: "Next Action",
    dataKey: "lc_next_action",
    rows: 3
  },
  {
    label: "PIC",
    dataKey: "lc_pic"
  },
  {
    label: "Due Date",
    dataKey: "lc_due_date"
  },
  {
    label: "Remarks",
    dataKey: "lc_remark",
    rows: 3
  },
  {
    label: "Maintenance Order (MO) Number",
    dataKey: "qmnum",
    rows: 3
  },
  {
    label: "Notification Order (NO) Number",
    dataKey: "aufnr",
    rows: 3
  }
]
const LCSearchResultTable = ({ params }) => {
  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)

  const [tableData, setTableData] = useState([])
  const [readMore, setReadmore] = useState(false)
  const [selectedRow, setSelectedRow] = useState(false)

  const fetchData = useCallback(
    source => {
      LostcookService.lcSearchResultTable(params, source).then(
        data => {
          setTableData(data)
          setPage(1)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
    },
    [params]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const getData = () => {
    return tableData.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })
  }

  const handleChangePage = dataKey => {
    setPage(dataKey)
  }
  const handleChangeLength = dataKey => {
    setPage(1)
    setDisplayLength(dataKey)
  }

  const ReadMoreCell = ({ rowData, dataKey, ...props }) =>
    GeneralHelper.ReadMoreCell(
      { rowData, dataKey, ...props },
      setReadmore,
      setSelectedRow
    )

  return (
    <>
      <BasicCardContainer bg="dark">
        <div className="process-line-chart__header mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <h2>
              {params.searchText ? (
                <span>
                  Search result for <strong>{params.searchText}</strong>
                </span>
              ) : (
                "Search result table"
              )}
            </h2>
          </div>
        </div>
        <div>
          {tableData ? (
            <div>
              <Table
                height={420}
                data={getData()}
                bordered
                cellBordered
                autoHeight
                affixHeader
                affixHorizontalScrollbar
              >
                <Column width={130} fixed resizable>
                  <HeaderCell>Index</HeaderCell>
                  <Cell dataKey="lc_id" />
                </Column>

                <Column width={150} fixed resizable>
                  <HeaderCell>Date</HeaderCell>
                  <Cell dataKey="date" />
                </Column>

                <Column width={150} resizable>
                  <HeaderCell>Fiberline</HeaderCell>
                  <Cell dataKey="fiberlineName" />
                </Column>

                <Column width={200} resizable>
                  <HeaderCell>Area</HeaderCell>
                  <Cell dataKey="area" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Responsibility</HeaderCell>
                  <Cell dataKey="responsibility" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Equipment</HeaderCell>
                  <Cell dataKey="equipment" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Problems</HeaderCell>
                  <Cell dataKey="problem" />
                </Column>

                <Column width={150} resizable>
                  <HeaderCell>Loss(Adt)</HeaderCell>
                  <Cell dataKey="lostcook" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Loss(Cook Number)</HeaderCell>
                  <Cell dataKey="loss" />
                </Column>
                <Column width={150} resizable>
                  <HeaderCell>Throughput</HeaderCell>
                  <Cell dataKey="adt" />
                </Column>

                <Column width={200} resizable>
                  <HeaderCell>Explanation</HeaderCell>
                  <Cell dataKey="lc_explanation" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Root Cause</HeaderCell>
                  <Cell dataKey="lc_root_cause" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Action</HeaderCell>
                  <Cell dataKey="lc_action" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Next Action</HeaderCell>
                  <Cell dataKey="lc_next_action" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>PIC</HeaderCell>
                  <Cell dataKey="lc_pic" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Due Date</HeaderCell>
                  <Cell dataKey="lc_due_date" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Remarks</HeaderCell>
                  <Cell dataKey="lc_remark" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Maintenance Order (MO) Number</HeaderCell>
                  <Cell dataKey="qmnum" />
                </Column>
                <Column width={200} resizable>
                  <HeaderCell>Notification Order (NO) Number</HeaderCell>
                  <Cell dataKey="aufnr" />
                </Column>
                <Column width={90} fixed="right" resizable>
                  <HeaderCell>Read more</HeaderCell>
                  <ReadMoreCell />
                </Column>
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
                total={tableData.length}
                onChangePage={handleChangePage}
                onChangeLength={handleChangeLength}
              />
            </div>
          ) : (
            <Loader center content="Loading" />
          )}
        </div>
      </BasicCardContainer>
      {readMore && selectedRow && cols && (
        <ReadMoreOnTable
          show={readMore}
          onHide={setReadmore}
          cols={cols}
          data={selectedRow}
          title={`${selectedRow["lc_id"]}`}
        />
      )}
    </>
  )
}

export default LCSearchResultTable
