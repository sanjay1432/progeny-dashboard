import React, { useEffect, useState, useCallback } from "react"
import { CANCEL_REQUEST } from "../../../constants/index"
import { Alert, Loader, Table, IconButton, Icon } from "rsuite"
import axios from "axios"
import { CardBody, Card } from "reactstrap"
import FilterCollapsible from "../../shared/FilterCollapsible"
import LostcookService from "../../../services/lostcook.service"
import moment from "moment"
import OpenMaintenanceOrderDetailDialog from "./OpenMaintenanceOrderDetailDialog"
const { Column, HeaderCell, Cell, Pagination } = Table

const OpenMaintenanceOrder = ({ selectedDate, frequency }) => {
  const [tableData, setTableData] = useState(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isShowDetailDialog, setIsShowDetailDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)

  const onClose = () => {
    setIsShowDetailDialog(false)
  }
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
  const viewDetail = rowData => {
    if (rowData) {
      setIsShowDetailDialog(true)
      setSelectedRow(rowData)
    }
  }
  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="__action_col">
        <div className="d-flex justify-content-space-center align-items-center">
          <IconButton
            onClick={() => viewDetail(rowData)}
            size="sm"
            className="mr-2"
            icon={<Icon icon="eye" />}
            placement="left"
          >
            View More
          </IconButton>
        </div>
      </Cell>
    )
  }

  const fetchData = useCallback(
    source => {
      LostcookService.getOpenMaintenanceOrder(
        { displayAsDate: selectedDate, frequency },
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
    [selectedDate, frequency]
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
      <FilterCollapsible header="Open Maintenance Order for Lostcook Incident">
        <Card>
          <CardBody>
            <h3 className="text-base-font text-bold text-heading text-default">
              Result show from {startDate} until {endDate}
            </h3>
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
                      <Cell dataKey="explanation" />
                    </Column>
                    <Column width={200} resizable>
                      <HeaderCell>Maintenance Order (MO) Number</HeaderCell>
                      <Cell dataKey="mo_number" />
                    </Column>
                    <Column width={200} resizable>
                      <HeaderCell>Maintenance Order (MO) Date</HeaderCell>
                      <Cell dataKey="mo_date" />
                    </Column>
                    <Column width={200} fixed="right" resizable>
                      <HeaderCell>Action</HeaderCell>
                      <ActionCell dataKey="lc_id" />
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
      <OpenMaintenanceOrderDetailDialog
        isShowDetailDialog={isShowDetailDialog}
        selectedRow={selectedRow}
        onClose={onClose}
      />
    </>
  )
}

export default OpenMaintenanceOrder
