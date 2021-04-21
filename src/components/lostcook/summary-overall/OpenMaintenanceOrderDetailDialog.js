import React, { useState, useEffect, useCallback } from "react"
import { Modal, Alert, Table, Nav, Placeholder } from "rsuite"
import { CANCEL_REQUEST } from "../../../constants/index"
import LostcookService from "../../../services/lostcook.service"
import moment from "moment"
import axios from "axios"

const { Column, HeaderCell, Cell } = Table

const OpenMaintenanceOrderDetailDialog = ({
  isShowDetailDialog,
  selectedRow,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState("lcItem")
  const [lcItemData, setLcItemData] = useState(null)
  const [sapMoData, setSAPMoData] = useState(null)
  const [sapNoData, setSAPNoData] = useState(null)
  const fetchData = useCallback(
    source => {
      if (selectedRow) {
        LostcookService.openMaintenanceOrderMO(
          { moNumber: selectedRow.mo_number },
          source
        ).then(
          data => {
            setSAPMoData(parseSAPMOTableData(data))
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
        LostcookService.openMaintenanceLcItem(
          { lcId: selectedRow.lc_id },
          source
        ).then(
          data => {
            setLcItemData(parseLCItemTableData(data))
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )

        LostcookService.openMaintenanceOrderNO(
          { moNumber: selectedRow.mo_number },
          source
        ).then(
          data => {
            setSAPNoData(parseSAPNOTableData(data))
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
      }
    },
    [selectedRow]
  )

  const parseLCItemTableData = data => {
    let result = []
    Object.keys(data).forEach(dataName => {
      switch (dataName) {
        case "root_cause":
          result.push({
            description: "Root cause",
            details: data[dataName]
          })
          break
        case "action":
          result.push({
            description: "Action",
            details: data[dataName]
          })
          break
        case "next_action":
          result.push({
            description: "Next Action",
            details: data[dataName]
          })
          break
        case "pic":
          result.push({
            description: "PIC",
            details: data[dataName]
          })
          break
        case "due_date":
          result.push({
            description: "Due Date",
            details: moment(data[dataName]).format("DD MMM YYYY")
          })
          break
        case "remark":
          result.push({
            description: "Remark",
            details: data[dataName]
          })
          break
        default:
          break
      }
    })
    return result
  }

  const parseSAPMOTableData = data => {
    let result = []
    Object.keys(data).forEach(dataName => {
      switch (dataName) {
        case "notification_number":
          result.push({
            description: "Notification Number",
            details: data[dataName]
          })
          break
        case "notification_type":
          result.push({
            description: "Notification Type",
            details: data[dataName]
          })
          break
        case "order_number":
          result.push({
            description: "Order Number",
            details: data[dataName]
          })
          break
        case "functional_location":
          result.push({
            description: "Functional Location",
            details: data[dataName]
          })
          break
        case "description":
          result.push({
            description: "Description",
            details: data[dataName]
          })
          break
        case "priority":
          result.push({
            description: "Priority",
            details: data[dataName]
          })
          break
        case "system_status":
          result.push({
            description: "System Status",
            details: data[dataName]
          })
          break
        case "system_status_desc":
          result.push({
            description: "System Status Description",
            details: data[dataName]
          })
          break
        case "user_status":
          result.push({
            description: "User Status",
            details: data[dataName]
          })
          break
        case "user_status_desc":
          result.push({
            description: "User Status Description",
            details: data[dataName]
          })
          break
        case "notification_create_date":
          result.push({
            description: "Notification Create Date",
            details: data[dataName]
          })
          break
        case "notification_create_time":
          result.push({
            description: "Notification Create Time",
            details: data[dataName]
          })
          break
        case "last_change_date":
          result.push({
            description: "Last Change Date",
            details: data[dataName]
          })
          break
        case "last_change_time":
          result.push({
            description: "Last Change Time",
            details: data[dataName]
          })
          break
        case "start_of_malfunction_date":
          result.push({
            description: "Start Of Malfunction Date",
            details: data[dataName]
          })
          break
        case "start_of_malfunction_time":
          result.push({
            description: "Start Of Malfunction Time",
            details: data[dataName]
          })
          break
        case "end_of_malfunction_date":
          result.push({
            description: "End Of Malfunction Date",
            details: data[dataName]
          })
          break
        case "end_of_malfunction_time":
          result.push({
            description: "End Of Malfunction Time",
            details: data[dataName]
          })
          break

        default:
          break
      }
    })
    return result
  }

  const parseSAPNOTableData = data => {
    let result = []
    Object.keys(data).forEach(dataName => {
      switch (dataName) {
        case "order_number":
          result.push({
            description: "Order Number",
            details: data[dataName]
          })
          break
        case "order_create_date":
          result.push({
            description: "Order Date",
            details: moment(data[dataName]).format("DD MMM YYYY")
          })
          break
        case "last_change_date":
          result.push({
            description: "Last Change Date",
            details: moment(data[dataName]).format("DD MMM YYYY")
          })
          break
        case "actual_start_date":
          result.push({
            description: "Malfunction Start Date",
            details: moment(data[dataName]).format("DD MMM YYYY")
          })
          break
        case "priority":
          result.push({
            description: "Priority",
            details: data[dataName]
          })
          break
        case "system_status":
          result.push({
            description: "System Status",
            details: data[dataName]
          })
          break
        case "system_status_desc":
          result.push({
            description: "System Status Description",
            details: data[dataName]
          })
          break
        case "user_status":
          result.push({
            description: "User Status",
            details: data[dataName]
          })
          break
        case "user_status_desc":
          result.push({
            description: "User Status Description",
            details: data[dataName]
          })
          break
        default:
          break
      }
    })
    return result
  }

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const DescriptionCell = ({ rowData, dataKey, ...props }) => {
    if (typeof rowData[dataKey] === "object" && rowData[dataKey].length > 0) {
      return (
        <Cell {...props} className="__action_col">
          {rowData[dataKey].map(item => {
            return <div className="mb-1 mt-0 table-text">{item}</div>
          })}
        </Cell>
      )
    } else {
      return (
        <Cell {...props} className="__action_col">
          {rowData[dataKey]}
        </Cell>
      )
    }
  }

  return (
    <>
      <Modal
        size="md"
        overflow={false}
        show={isShowDetailDialog}
        onHide={() => onClose()}
      >
        <Modal.Header>
          <Modal.Title>
            Details on {selectedRow ? selectedRow.lc_id : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Nav
            appearance="tabs"
            activeKey={activeTab}
            onSelect={activeKey => setActiveTab(activeKey)}
          >
            <Nav.Item eventKey="lcItem">LC Item</Nav.Item>
            <Nav.Item eventKey="sapMo">SAP MO</Nav.Item>
            <Nav.Item eventKey="sapNo">SAP NO</Nav.Item>
          </Nav>
          {activeTab === "lcItem" ? (
            <div className="custom-tab">
              {lcItemData ? (
                <Table
                  height={400}
                  data={lcItemData}
                  bordered
                  wordWrap
                  cellBordered
                  size="md"
                  affixHeader
                  affixHorizontalScrollbar
                >
                  <Column width={180} resizable>
                    <HeaderCell>Description</HeaderCell>
                    <Cell dataKey="description" />
                  </Column>
                  <Column width={400} resizable>
                    <HeaderCell>Details</HeaderCell>
                    <Cell dataKey="details" />
                  </Column>
                </Table>
              ) : (
                <Placeholder.Paragraph rows={10} />
              )}
            </div>
          ) : (
            ""
          )}
          {activeTab === "sapMo" ? (
            <div className="custom-tab">
              {sapMoData ? (
                <Table
                  height={400}
                  data={sapMoData}
                  bordered
                  wordWrap
                  cellBordered
                  affixHeader
                  affixHorizontalScrollbar
                  rowHeight={rowData => {
                    if (
                      rowData &&
                      typeof rowData.details === "object" &&
                      rowData.details.length > 1
                    ) {
                      return (rowData.details.length + 1) * 21 + 10
                    } else {
                      return 46
                    }
                  }}
                >
                  <Column width={200} resizable>
                    <HeaderCell>Description</HeaderCell>
                    <Cell dataKey="description" />
                  </Column>
                  <Column width={400} resizable>
                    <HeaderCell>Details</HeaderCell>
                    <DescriptionCell dataKey="details" />
                  </Column>
                </Table>
              ) : (
                <Placeholder.Paragraph rows={10} />
              )}
            </div>
          ) : (
            ""
          )}
          {activeTab === "sapNo" ? (
            <div className="custom-tab">
              {sapNoData ? (
                <Table
                  height={400}
                  data={sapNoData}
                  bordered
                  wordWrap
                  cellBordered
                  size="md"
                  affixHeader
                  affixHorizontalScrollbar
                  rowHeight={rowData => {
                    console.log(rowData)
                    if (
                      rowData &&
                      typeof rowData.details === "object" &&
                      rowData.details.length > 1
                    ) {
                      return (rowData.details.length + 1) * 21 + 10
                    } else {
                      return 46
                    }
                  }}
                >
                  <Column width={200} resizable>
                    <HeaderCell>Description</HeaderCell>
                    <Cell dataKey="description" />
                  </Column>
                  <Column width={400} resizable>
                    <HeaderCell>Details</HeaderCell>
                    <DescriptionCell dataKey="details" />
                  </Column>
                </Table>
              ) : (
                <Placeholder.Paragraph rows={10} />
              )}
            </div>
          ) : (
            ""
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default OpenMaintenanceOrderDetailDialog
