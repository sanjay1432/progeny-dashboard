import React, { useEffect, useState, useCallback } from "react"
import LostcookService from "../../../services/lostcook.service"
import { ACTION, CANCEL_REQUEST, MODULE } from "../../../constants/index"
import { Alert, Icon, IconButton, Loader, Table } from "rsuite"
import axios from "axios"
import moment from "moment"
import { CardBody, Card } from "reactstrap"
import FilterCollapsible from "../../shared/FilterCollapsible"
import { useSelector } from "react-redux"
import ReadMoreOnTable from "../../shared/ReadMoreOnTable"
import GeneralHelper from "../../../helper/general.helper"
const { Column, HeaderCell, Cell, Pagination } = Table

const cols = [
  {
    label: "Index",
    dataKey: "index"
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
    label: "Explanation",
    dataKey: "lc_explanation",
    rows: 5
  },
  {
    label: "Root Cause",
    dataKey: "lc_root_cause",
    rows: 3
  },
  {
    label: "Action",
    dataKey: "lc_next_action",
    rows: 5
  },
  {
    label: "Next Action",
    dataKey: "lc_next_action",
    rows: 5
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
  }
]

const Top5 = ({ selectedDate, frequency }) => {
  const mill = useSelector(state => state.appReducer.mill)
  const [tableData, setTableData] = useState(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedFiberline, setSelectedFiberline] = useState("all")
  const [fiberlineList, setFiberlineList] = useState(null)
  const [readMore, setReadmore] = useState(false)
  const [selectedRow, setSelectedRow] = useState(false)
  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)

  const handleChangePage = dataKey => {
    setPage(dataKey)
  }
  const handleChangeLength = dataKey => {
    setPage(1)
    setDisplayLength(dataKey)
  }
  const getData = () => {
    return tableData.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })
  }
  const fetchData = useCallback(
    async source => {
      await LostcookService.fiberlineList({ millId: mill.millId }, source).then(
        data => {
          setFiberlineList(data)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )

      LostcookService.getTop5(
        {
          displayAsDate: selectedDate,
          frequency,
          processLine: selectedFiberline
        },
        source
      ).then(
        data => {
          setTableData(data.dataSet)
          setStartDate(moment(data.startDate).format("DD MMM YYYY"))
          setEndDate(moment(data.endDate).format("DD MMM YYYY"))
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
    [selectedDate, frequency, selectedFiberline]
  )

  const filterByFiberline = filberlineId => {
    setSelectedFiberline(filberlineId)
  }
  const ReadMoreCell = ({ rowData, dataKey, ...props }) =>
    GeneralHelper.ReadMoreCell(
      { rowData, dataKey, ...props },
      setReadmore,
      setSelectedRow
    )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])
  return (
    <>
      <FilterCollapsible header="Top 5 Production Lost Incident">
        <Card>
          <CardBody>
            <h3 className="text-base-font text-bold text-heading text-default">
              Result show from {startDate} until {endDate}
            </h3>
            <div className="d-flex mb-3">
              {fiberlineList
                ? fiberlineList.map((fiberline, index) => {
                    return (
                      <div
                        key={index}
                        className="custom-control opex-radio custom-radio"
                        onClick={() => filterByFiberline(fiberline.value)}
                      >
                        <input
                          className="custom-control-input"
                          value={fiberline.value}
                          name="fiberline"
                          type="radio"
                          checked={selectedFiberline === fiberline.value}
                          onChange={() => filterByFiberline(fiberline.value)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadio2"
                        >
                          <span>{fiberline.label}</span>
                        </label>
                      </div>
                    )
                  })
                : ""}
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
                      <Cell dataKey="index" />
                    </Column>

                    <Column width={150} fixed resizable>
                      <HeaderCell>Date</HeaderCell>
                      <Cell dataKey="date" />
                    </Column>
                    <Column width={150} resizable>
                      <HeaderCell>Fiberline</HeaderCell>
                      <Cell dataKey="fiberlineName" />
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
          </CardBody>
        </Card>
      </FilterCollapsible>
      {readMore && selectedRow && cols && (
        <ReadMoreOnTable
          show={readMore}
          onHide={setReadmore}
          cols={cols}
          data={selectedRow}
          title={`${selectedRow["index"]}`}
        />
      )}
    </>
  )
}

export default Top5
