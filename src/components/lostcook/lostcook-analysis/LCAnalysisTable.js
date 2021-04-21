import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import LostcookService from "../../../services/lostcook.service"
import { CANCEL_REQUEST } from "../../../constants"
import axios from "axios"
import { Alert, Loader, Table } from "rsuite"
import {
  setSelectedDateOnBarChart,
  setLCAnalysisFilteredTable,
  setLCAnalysisTable,
  setSelectedTypeOnPieChart
} from "../../../redux/actions/lostcook.action"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "reactstrap"
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
const LCAnalysisTable = ({ params }) => {
  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)
  const [readMore, setReadmore] = useState(false)
  const [selectedRow, setSelectedRow] = useState(false)

  const dispatch = useDispatch()
  const selectedDateOnBarChart = useSelector(
    state => state.lostcookReducer.selectedDateOnBarChart
  )
  const lcAnalysisFilteredTable = useSelector(
    state => state.lostcookReducer.lcAnalysisFilteredTable
  )
  const lcAnalysisTable = useSelector(
    state => state.lostcookReducer.lcAnalysisTable
  )
  const selectedTypeOnPieChart = useSelector(
    state => state.lostcookReducer.selectedTypeOnPieChart
  )

  const ReadMoreCell = ({ rowData, dataKey, ...props }) =>
    GeneralHelper.ReadMoreCell(
      { rowData, dataKey, ...props },
      setReadmore,
      setSelectedRow
    )

  const fetchData = useCallback(
    source => {
      LostcookService.getLCAnalysisDataTable(params, source).then(
        data => {
          dispatch(setLCAnalysisFilteredTable(data))
          dispatch(setLCAnalysisTable(data))
          dispatch(setSelectedDateOnBarChart(null))
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
    [params, dispatch]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const handleChangePage = dataKey => {
    setPage(dataKey)
  }
  const handleChangeLength = dataKey => {
    setPage(1)
    setDisplayLength(dataKey)
  }

  const getData = () => {
    if (
      lcAnalysisFilteredTable &&
      lcAnalysisFilteredTable.length < displayLength
    ) {
      return lcAnalysisFilteredTable
    }
    return lcAnalysisFilteredTable.filter((v, i) => {
      let start = displayLength * (page - 1)
      let end = start + displayLength
      return i >= start && i < end
    })
  }

  const onResetDate = () => {
    dispatch(setLCAnalysisFilteredTable(lcAnalysisTable))
    dispatch(setSelectedDateOnBarChart(null))
  }

  const onResetChartType = () => {
    dispatch(setLCAnalysisFilteredTable(lcAnalysisTable))
    dispatch(setSelectedTypeOnPieChart(null))
  }

  return (
    <>
      <BasicCardContainer bg="dark">
        <div className="process-line-chart__header mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <h2>
              Total Number of Loss and Total Loss event distribution
              {selectedDateOnBarChart && (
                <span>{`(Filter: ${selectedDateOnBarChart})`}</span>
              )}
              {selectedTypeOnPieChart && (
                <span> {`(Filter: ${selectedTypeOnPieChart.chartType})`}</span>
              )}
            </h2>
          </div>
          {selectedDateOnBarChart && (
            <div>
              <Button
                color="primary"
                size="sm"
                type="button"
                className="btn-rounded pd-big"
                onClick={onResetDate}
              >
                Reset Filter Date
              </Button>
            </div>
          )}
          {selectedTypeOnPieChart && (
            <div>
              <Button
                color="primary"
                size="sm"
                type="button"
                className="btn-rounded pd-big"
                onClick={onResetChartType}
              >
                Reset Type
              </Button>
            </div>
          )}
        </div>
        <div>
          {lcAnalysisFilteredTable ? (
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
                total={lcAnalysisFilteredTable.length}
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

export default LCAnalysisTable
