import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import PlotService from "../../services/plot.service"
import { publish } from "../../services/pubsub.service"
import DataPicker from "../SharedComponent/DataPicker"
import ConfirmationModal from "../SharedComponent/ConfirmationModal"
import SuccessMessage from "../SharedComponent/SuccessMessage"
import SearchMessage from "../../assets/img/SearchMessage.svg"
import {
  Table,
  FlexboxGrid,
  Grid,
  Row,
  Col,
  Input,
  ControlLabel,
  Button
} from "rsuite"

const { Column, HeaderCell, Cell } = Table

const EditableCell = ({
  rowData,
  dataKey,
  onChange,
  handleEditChange,
  ...cellProps
}) => {
  return (
    <Cell {...cellProps}>
      <Input
        className="editTableInput"
        // defaultValue={rowData[dataKey]}
        value={rowData[dataKey]}
        disabled={[
          "trialCode",
          "estate",
          "replicate",
          "estateblock",
          "plot"
        ].includes(dataKey)}
        onChange={value =>
          handleEditChange &&
          handleEditChange(
            rowData.trialCode,
            rowData.estate,
            rowData.replicate,
            rowData.plot,
            dataKey,
            value
          )
        }
      />
    </Cell>
  )
}

const EditPalmInformation = ({ option }) => {
  const initialFilterValue = {
    trialCode: option.trialCode,
    estate: option.estate,
    replicate: option.replicate,
    plot: option.plot
  }

  const [initialData, setInitialData] = useState([])
  const [appliedData, setAppliedData] = useState([])
  const [filterValue, setFilterValue] = useState(initialFilterValue)
  const [trialFilterData, setTrialFilterData] = useState([])
  const [estateFilterData, setEstateFilterData] = useState([])
  const [replicateFilterData, setReplicateFilterData] = useState([])
  const [plotFilterData, setPlotFilterData] = useState([])
  const [tableData, setTableData] = useState([])
  const [successMessage, setSuccessMessage] = useState("")
  const [confirmationModal, setConfirmationModal] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    async function fetchData() {
      const data = await PlotService.getPalmInformation()
      const initialTableData = data.filter(
        data =>
          data.trialCode === filterValue.trialCode &&
          data.estate === filterValue.estate &&
          data.replicate === filterValue.replicate &&
          data.plot === filterValue.plot
      )
      setTrialFilterData(data)
      setEstateFilterData(data)
      setReplicateFilterData(data)
      setPlotFilterData(data)
      setInitialData(data)
      setTableData(initialTableData)
    }
    fetchData()
  }, [])

  function handleTrialFilterChange(value) {
    setFilterValue({ ...filterValue, trialCode: value })
    const renewFilterData = initialData.filter(data => data.trialCode === value)
    setEstateFilterData(renewFilterData)
    setReplicateFilterData(renewFilterData)
    setPlotFilterData(renewFilterData)
  }

  function handleEstateFilterChange(value) {
    setFilterValue({ ...filterValue, estate: value })
    const renewFilterData = initialData.filter(data => {
      if (value === "all") {
        return data.trialCode === filterValue.trialCode
      } else {
        return data.trialCode === filterValue.trialCode && data.estate === value
      }
    })
    setReplicateFilterData(renewFilterData)
    setPlotFilterData(renewFilterData)
  }

  function handleReplicateFilterChange(value) {
    setFilterValue({ ...filterValue, replicate: value })
    const renewData = appliedData.filter(data => {
      if (value === "all" && filterValue.plot === "all") {
        return data
      } else if (value !== "all" && filterValue.plot === "all") {
        return data.replicate === value
      } else if (value === "all" && filterValue.plot !== "all") {
        return data.plot === filterValue.plot
      } else {
        return data.plot === value && data.replicate === filterValue.replicate
      }
    })
    setPlotFilterData(renewData)
    setTableData(renewData)
  }

  function handlePlotFilterChange(value) {
    setFilterValue({ ...filterValue, plot: value })
    const renewData = appliedData.filter(data => {
      if (value === "all" && filterValue.replicate === "all") {
        return data
      } else if (value !== "all" && filterValue.replicate === "all") {
        return data.plot === value
      } else if (value === "all" && filterValue.replicate !== "all") {
        return data.replicate === filterValue.replicate
      } else {
        return data.plot === value && data.replicate === filterValue.replicate
      }
    })
    setReplicateFilterData(renewData)
    setTableData(renewData)
  }

  function applyFilter() {
    setFilterValue({ ...filterValue, replicate: "all", plot: "all" })
    const renewTableData = initialData.filter(data => {
      if (filterValue.estate === "all") {
        return data.trialCode === filterValue.trialCode
      } else {
        return (
          data.trialCode === filterValue.trialCode &&
          data.estate === filterValue.estate
        )
      }
    })
    setTableData(renewTableData)
    setAppliedData(renewTableData)
    setReplicateFilterData(renewTableData)
    setPlotFilterData(renewTableData)
  }

  function resetFilter() {
    setFilterValue({
      ...filterValue,
      trialCode: "",
      estate: "",
      replicate: "",
      plot: ""
    })
    setTableData([])
  }

  const columns = [
    {
      name: "Replicate",
      dataKey: "replicate",
      flexGrow: 1
    },
    {
      name: "Estate Block",
      dataKey: "estateblock",
      flexGrow: 1
    },
    {
      name: "Plot",
      dataKey: "plot",
      flexGrow: 1
    },
    {
      name: "Palm Number",
      dataKey: "palmno",
      flexGrow: 1
    }
  ]

  const handleEditChange = (trialCode, estate, replicate, plot, key, value) => {
    var nextData = Object.assign([], tableData)
    nextData.find(
      item =>
        item.trialCode === trialCode &&
        item.estate === estate &&
        item.replicate === replicate &&
        item.plot === plot
    )[key] = value
    setTableData(nextData)
    console.log(tableData)
  }

  const quickSaveEditedData = () => {
    console.log(tableData)
    PlotService.editPalmInformation(tableData).then(
      data => {
        setSuccessMessage(true)
      },
      error => {}
    )
  }

  const completedEditData = () => {
    PlotService.editPalmInformation(tableData).then(
      data => {
        const savedData = {
          type: "PALMINFORMATION_UPDATE",
          data: tableData,
          action: "UPDATE"
        }
        publish(savedData)
        dispatch(clearBreadcrumb())
      },
      error => {}
    )
  }

  return (
    <div id="TrialAction">
      <ConfirmationModal
        show={confirmationModal}
        hide={() => setConfirmationModal(false)}
        save={completedEditData}
        data={filterValue}
        action="MULTIPALMDATA_UPDATE"
      />

      <SuccessMessage
        show={successMessage}
        hide={() => setSuccessMessage("")}
        action="MULTIPALMDATA_UPDATE"
      />

      <div>
        <h4 className="title">
          <span className="desc">Step 1:</span>{" "}
          <span className="purpose">Search Palms</span>
        </h4>
      </div>

      <Grid fluid id="dashboardFilterPanel">
        <Row>
          <div>
            <Col md={4} lg={3} className="dashboardFilterLayout">
              <div className="show-col">
                <ControlLabel className="labelFilter">Trial ID</ControlLabel>
                <DataPicker
                  dataType="trialCode"
                  OriginalData={trialFilterData}
                  dataValue={filterValue.trialCode}
                  onChange={value => handleTrialFilterChange(value)}
                />
              </div>
            </Col>
          </div>
          <div>
            <Col md={4} lg={3} className="dashboardFilterLayout">
              <div className="show-col">
                <ControlLabel className="labelFilter">Estate</ControlLabel>
                <DataPicker
                  dataType="estate"
                  selectAllData="All Estate"
                  OriginalData={estateFilterData}
                  dataValue={filterValue.estate}
                  onChange={value => handleEstateFilterChange(value)}
                />
              </div>
            </Col>
          </div>

          <Col md={4} lg={3} className="applyButtonLayout">
            <Button
              appearance="primary"
              className="applyButton"
              onClick={applyFilter}
            >
              Apply
            </Button>
          </Col>
          <Col md={4} lg={3} className="resetButtonLayout">
            <Button
              appearance="subtle"
              className="resetButton"
              onClick={resetFilter}
            >
              Reset Filter
            </Button>
          </Col>
        </Row>
      </Grid>

      <hr className="lineBetweenStep" />

      <div>
        <h4 className="title">
          <span className="desc">Step 2:</span>{" "}
          <span className="purpose">Edit Palms Information</span>
        </h4>
      </div>

      {tableData.length < 1 ? (
        <div className="imageLayout">
          <img src={SearchMessage} alt="" />
          <p className="desc">
            Please enter <b className="title">Trial ID and Estate</b> to edit
            Palms Information.
          </p>
        </div>
      ) : (
        <>
          <Grid fluid>
            <Row className="show-grid" id="dashboardTableSetting">
              <Col sm={6} md={6} lg={6} className="totalRecordLayout">
                <b>Total records ({tableData.length})</b>
              </Col>

              <FlexboxGrid justify="end">
                <Col mdOffset={6} md={4} lgOffset={9} lg={3}>
                  <DataPicker
                    dataType="replicate"
                    selectAllData="All Replicate"
                    OriginalData={replicateFilterData}
                    dataValue={filterValue.replicate}
                    onChange={value => handleReplicateFilterChange(value)}
                  />
                </Col>
                <Col md={4} lg={3}>
                  <DataPicker
                    dataType="plot"
                    selectAllData="All Plot"
                    OriginalData={plotFilterData}
                    dataValue={filterValue.plot}
                    onChange={value => handlePlotFilterChange(value)}
                  />
                </Col>

                <Col md={3} lg={2} className="quickSaveLayout">
                  <Button
                    className="quickSaveButton"
                    appearance="primary"
                    onClick={quickSaveEditedData}
                  >
                    Quick Save
                  </Button>
                </Col>
              </FlexboxGrid>
            </Row>
          </Grid>
          <Table id="dashboardTable" data={tableData} autoHeight wordWrap>
            {columns.map(col => {
              const width = col.width ? col.width : false
              const flexGrow = col.flexGrow ? col.flexGrow : false
              const fixed = col.fixed ? col.fixed : false
              return (
                <Column width={width} flexGrow={flexGrow} fixed={fixed}>
                  <HeaderCell className="tableHeader">{col.name}</HeaderCell>
                  <EditableCell
                    dataKey={col.dataKey}
                    handleEditChange={handleEditChange}
                  />
                </Column>
              )
            })}
          </Table>

          <Grid fluid className="footerLayout">
            <Row className="show-grid">
              <FlexboxGrid justify="end">
                <Col md={5} lg={4} className="cancelButtonLayout">
                  <FlexboxGrid.Item>
                    <Button
                      appearance="subtle"
                      className="cancelButton"
                      onClick={() => dispatch(clearBreadcrumb())}
                    >
                      Cancel
                    </Button>
                  </FlexboxGrid.Item>
                </Col>
                <Col md={5} lg={4} className="completeButtonLayout">
                  <FlexboxGrid.Item>
                    <Button
                      className="saveButton"
                      appearance="primary"
                      onClick={() => setConfirmationModal(true)}
                      type="button"
                    >
                      Complete
                    </Button>
                  </FlexboxGrid.Item>
                </Col>
              </FlexboxGrid>
            </Row>
          </Grid>
        </>
      )}
    </div>
  )
}

export default EditPalmInformation
