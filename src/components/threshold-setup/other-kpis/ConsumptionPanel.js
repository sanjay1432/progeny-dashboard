import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { CANCEL_REQUEST, BPI } from "../../../constants/index"
import { CardBody, Card, Button, Container, Row, Col } from "reactstrap"
import { Alert } from "rsuite"
import axios from "axios"
import { Icon, Table, IconButton, InputPicker } from "rsuite"
import ConfigPanel from "../ConfigPanel"
import ThresholdService from "../../../services/threshold.service"
import AddConsumptionThresholdDialog from "./consumption/AddConsumptionThresholdDialog"
import EditConsumptionThresholdDialog from "./consumption/EditConsumptionThresholdDialog"
import FilterCollapsible from "../../shared/FilterCollapsible"
import GeneralHelper from "../../../helper/general.helper"
const { Cell } = Table

const ConsumptionPanel = () => {
  const [tableData, setTableData] = useState([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const mill = useSelector(state => state.appReducer.mill)
  const buId = useSelector(state => state.appReducer.buId)
  const processLines = useSelector(state => state.dashboardReducer.processLines)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedKpi, setSelectedKpi] = useState(null)
  const [kpis, setKpis] = useState([])
  const [selectedBPI, setSelectedBPI] = useState(null)
  const [isEdit, setIsEdit] = useState(false)

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="__action_col">
        <div className="d-flex justify-content-space-center align-items-center">
          <IconButton
            onClick={() => editConfig(rowData)}
            size="sm"
            className="mr-2"
            icon={<Icon icon="pencil" />}
            placement="left"
          >
            Edit
          </IconButton>
        </div>
      </Cell>
    )
  }

  const ProcessLineCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{rowData[dataKey].processLineName}</Cell>
  }

  const DateCell = ({ rowData, dataKey, ...props }) =>
    GeneralHelper.DateCell({ rowData, dataKey, ...props })

  const ThresholdCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        {rowData[dataKey]}
        {rowData["thresholdMax"] ? ` - ${rowData["thresholdMax"]}` : ""}
      </Cell>
    )
  }
  const COLUMNS = [
    {
      name: "No.",
      dataKey: "no",
      width: 70,
      resizable: true,
      sortable: true
    },
    {
      name: "Process Line",
      dataKey: "processLine",
      customCell: ProcessLineCell,
      flexGrow: 1,
      resizable: true,
      sortable: true
    },
    {
      name: "Threshold",
      dataKey: "threshold",
      width: 150,
      customCell: ThresholdCell,
      sortable: true,
      resizable: true
    },
    {
      name: "Start Date",
      dataKey: "startDate",
      sortable: true,
      resizable: true,
      customCell: DateCell
    },
    {
      name: "End Date",
      dataKey: "endDate",
      sortable: true,
      resizable: true,
      customCell: DateCell
    },
    {
      name: "Action",
      dataKey: "action",
      customCell: ActionCell,
      fixed: "right"
    }
  ]

  const editConfig = rowData => {
    if (rowData) {
      setShowEditDialog(true)
      setSelectedRow(rowData)
    }
  }

  const submitEditConfig = () => {
    setShowEditDialog(false)
    getConfig(mill, setTableData, selectedKpi)
  }

  const cancelEditConfig = () => {
    setShowEditDialog(false)
  }

  const deleteConfig = () => {
    setShowEditDialog(false)
    getConfig(mill, setTableData, selectedKpi)
  }

  const submitAddConfig = () => {
    setShowAddDialog(false)
    getConfig(mill, setTableData, selectedKpi)
  }

  const cancelAddConfig = () => {
    setShowAddDialog(false)
  }
  const applyFilter = () => {
    if (selectedCategory && selectedKpi) {
      getConfig(mill, setTableData, selectedKpi)
    }
  }

  const onChangeCategory = selected => {
    setSelectedCategory(selected)
    setSelectedKpi(null)
    setSelectedBPI(null)
    setTableData([])
  }

  const onchangeKPI = (value, item, event) => {
    setSelectedKpi(value)
    setSelectedBPI(item.betterPerformance)
  }

  const editBPI = () => {
    if (isEdit) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      const param = {
        buId: mill.buId,
        kpiId: selectedKpi,
        bpi: selectedBPI
      }
      ThresholdService.editBPIConfig(param, source).then(
        data => {
          Alert.success("Successful", 2000)
          getKPIs(selectedCategory, mill, setKpis)
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
    setIsEdit(!isEdit)
  }

  useEffect(() => {
    setCategories(GeneralHelper.getKpiCategoryListByBUID(buId))
  }, [buId])

  useEffect(() => {
    getKPIs(selectedCategory, mill, setKpis)
  }, [selectedCategory, mill])

  if (!mill) {
    return ""
  }

  return (
    <>
      <div className="opex-panel-content">
        <Container fluid>
          <Row className="__row">
            <Col>
              <div className="pt-2 pb-2">
                <FilterCollapsible>
                  <Card>
                    <CardBody>
                      {categories && (
                        <InputPicker
                          placeholder="Select Category"
                          labelKey="kpiCategoryName"
                          valueKey="kpiCategoryId"
                          onChange={selected => {
                            onChangeCategory(selected)
                          }}
                          className="mr-3"
                          data={categories}
                          value={selectedCategory}
                          cleanable={false}
                          style={{ maxWidth: 400, width: 250 }}
                        />
                      )}
                      {kpis && (
                        <InputPicker
                          placeholder="Select KPI"
                          onSelect={(value, item, event) =>
                            onchangeKPI(value, item, event)
                          }
                          labelKey="kpiNameWithUnit"
                          valueKey="kpiId"
                          className="mr-3"
                          data={kpis}
                          disabled={selectedCategory == null}
                          value={selectedKpi}
                          cleanable={false}
                          style={{ maxWidth: 400, width: 250 }}
                        />
                      )}
                      <Button
                        color="primary"
                        size="sm"
                        disabled={selectedKpi === null}
                        type="button"
                        className="btn-rounded pd-big"
                        onClick={applyFilter}
                      >
                        Apply
                      </Button>
                    </CardBody>
                  </Card>
                </FilterCollapsible>
              </div>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row className="__row mt-3 mb-3">
            <Col>
              <label>KPI Better Performance Indicator:</label>

              <InputPicker
                disabled={!isEdit}
                onChange={selected => {
                  setSelectedBPI(selected)
                }}
                className="mr-3 ml-3"
                data={BPI}
                value={selectedBPI}
                cleanable={false}
                style={{ maxWidth: 400, width: 250 }}
              />

              <IconButton
                disabled={selectedKpi === null}
                appearance={isEdit ? "primary" : "default"}
                icon={<Icon icon="edit" />}
                onClick={() => editBPI()}
                placement="left"
              >
                {isEdit ? "Save" : "Edit"}
              </IconButton>
            </Col>
          </Row>
        </Container>
        <ConfigPanel
          hasFilter={true}
          columns={COLUMNS}
          data={tableData}
          addConfig={() => setShowAddDialog(true)}
        />
      </div>
      <AddConsumptionThresholdDialog
        processLines={processLines}
        showDialog={showAddDialog}
        submitConfig={submitAddConfig}
        cancelConfig={cancelAddConfig}
      />

      <EditConsumptionThresholdDialog
        selectedCategory={selectedCategory}
        processLines={processLines}
        showDialog={showEditDialog}
        submitConfig={submitEditConfig}
        cancelConfig={cancelEditConfig}
        deleteConfig={deleteConfig}
        data={selectedRow}
      />
    </>
  )
}

export default ConsumptionPanel

function getKPIs(selectedCategory, mill, setKpis) {
  if (selectedCategory && mill) {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    GeneralHelper.getKpiList(mill, selectedCategory, source, setKpis)
  }
}

function getConfig(mill, setTableData, kpiId) {
  if (mill && kpiId) {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    ThresholdService.getProcessLineConfig(
      { buId: mill.buId, millId: mill.millId, kpiId: kpiId },
      source
    ).then(
      data => {
        if (data && data.data) {
          const sortedData = GeneralHelper.sortDataByStartDate(data.data)
          setTableData(
            sortedData.map((item, index) => {
              return { no: index + 1, ...item }
            })
          )
        }
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
}
