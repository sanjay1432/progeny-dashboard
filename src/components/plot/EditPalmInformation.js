import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import PlotService from "../../services/plot.service"
import DataPicker from "./sharedComponent/DataPicker"
import ConfirmationModal from "../modal/sharedComponent/ConfirmationModal"
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
import memoize from "memoize-one"
const { Column, HeaderCell, Cell } = Table

const EditPalmInformation = ({ option }) => {
  console.log(option)
  const initialFilterValue = {
    trialid: option.trialid,
    estate: option.estate,
    replicate: option.replicate,
    plot: option.plot
  }

  const [initialData, setInitialData] = useState([])
  const [filterValue, setFilterValue] = useState(initialFilterValue)
  const [trialFilterData, setTrialFilterData] = useState([])
  const [estateFilterData, setEstateFilterData] = useState([])
  const [replicateFilterData, setReplicateFilterData] = useState([])
  const [plotFilterData, setPlotFilterData] = useState([])
  const [tableData, setTableData] = useState([])
  const [confirmationModal, setConfirmationModal] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    async function fetchData() {
      const data = await PlotService.getPalmInformation()
      const initialTableData = data.filter(
        data =>
          data.trialid === filterValue.trialid &&
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
    setFilterValue({ ...filterValue, trialid: value })
    const filteredEstate = initialData.filter(data => data.trialid === value)
    const filteredReplicate = initialData.filter(data => data.trialid === value)
    const filteredPlot = initialData.filter(data => data.trialid === value)
    setEstateFilterData(filteredEstate)
    setReplicateFilterData(filteredReplicate)
    setPlotFilterData(filteredPlot)
  }

  function handleEstateFilterChange(value) {
    setFilterValue({ ...filterValue, estate: value })
    if (value === "all") {
      const filteredReplicate = initialData.filter(
        data => data.trialid === filterValue.trialid
      )
      const filteredPlot = initialData.filter(
        data => data.trialid === filterValue.trialid
      )
      setReplicateFilterData(filteredReplicate)
      setPlotFilterData(filteredPlot)
      console.log(filterValue.estate)
    } else {
      const filteredReplicate = initialData.filter(
        data => data.estate === value
      )
      const filteredPlot = initialData.filter(data => data.estate === value)
      setReplicateFilterData(filteredReplicate)
      setPlotFilterData(filteredPlot)
      console.log(filterValue.estate)
    }
  }

  function handleReplicateFilterChange(value) {
    setFilterValue({ ...filterValue, replicate: value })
    if (value === "all") {
      const filteredEstate = initialData.filter(
        data => data.estate === filterValue.estate
      )
      const filteredPlot = initialData.filter(
        data => data.estate === filterValue.estate
      )
      setEstateFilterData(filteredEstate)
      setPlotFilterData(filteredPlot)
      console.log(filterValue.replicate)
    } else {
      const filteredEstate = initialData.filter(
        data => data.replicate === value
      )
      const filteredPlot = initialData.filter(data => data.replicate === value)
      setEstateFilterData(filteredEstate)
      setPlotFilterData(filteredPlot)
      console.log(filterValue.replicate)
    }
  }

  function handlePlotFilterChange(value) {
    setFilterValue({ ...filterValue, plot: value })
    const filteredEstate = initialData.filter(data => data.estate === value)
    const filteredReplicate = initialData.filter(data => data.estate === value)
    setEstateFilterData(filteredEstate)
    setReplicateFilterData(filteredReplicate)
    console.log(filterValue.plot)
  }

  function applyFilter() {
    const filteredTrial = initialData.filter(
      data => data.trialid === filterValue.trialid
    )
    if (filterValue.estate === "all" || filterValue.estate === "") {
      setTableData(filteredTrial)
    } else {
      const filteredEstate = filteredTrial.filter(
        data => data.estate === filterValue.estate
      )
      if (filterValue.replicate === "all" || filterValue.replicate === "") {
        setTableData(filteredEstate)
      } else {
        const filteredReplicate = filteredEstate.filter(
          data => data.replicate === filterValue.replicate
        )
        if (filterValue.plot === "all" || filterValue.plot === "") {
          setTableData(filteredReplicate)
        } else {
          const filterPlot = filteredReplicate.filter(
            data => data.plot === filterValue.plot
          )
          setTableData(filterPlot)
        }
      }
    }
  }

  function resetFilter() {
    setFilterValue({
      ...filterValue,
      trialid: "",
      estate: "",
      replicate: "",
      plot: ""
    })
    setTableData(initialData)
  }

  const columns = [
    {
      name: "Trial ID",
      dataKey: "trialid",
      width: 150
    },
    {
      name: "Estate",
      dataKey: "estate",
      width: 150
    },
    {
      name: "Replicate",
      dataKey: "replicate",
      width: 150
    },
    {
      name: "Estate Block",
      dataKey: "estateblock",
      width: 150
    },
    {
      name: "Plot",
      dataKey: "plot",
      width: 150
    },
    {
      name: "Palm Number",
      dataKey: "palmNum",
      width: 150
    },
    {
      name: "Palm Name",
      dataKey: "palmName",
      width: 150
    }
  ]

  const EditableCell = memoize(
    ({ rowData, dataKey, onChange, ...cellProps }) => {
      return (
        <Cell {...cellProps}>
          <Input
            defaultValue={rowData[dataKey]}
            disabled={[
              "trialid",
              "estate",
              "replicate",
              "estateblock",
              "design",
              "density",
              "progeny",
              "ortet",
              "fp",
              "mp",
              "noofPalm"
            ].includes(dataKey)}
            onChange={value =>
              handleEditChange &&
              handleEditChange(
                rowData.trialid,
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
  )

  const handleEditChange = (trialid, estate, replicate, plot, key, value) => {
    var nextData = Object.assign([], tableData)
    nextData.find(
      item =>
        item.trialid === trialid &&
        item.estate === estate &&
        item.replicate === replicate &&
        item.plot === plot
    )[key] = value
    setTableData(nextData)
  }

  const saveEditabedData = () => {
    console.log(tableData)
  }

  return (
    <div id="TrialAction">
      <ConfirmationModal
        show={confirmationModal}
        hide={() => setConfirmationModal(false)}
        save={saveEditabedData}
        data={filterValue}
        currentPage="palmEdit"
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
            <Col md={4} lg={3}>
              <div className="show-col">
                <ControlLabel className="labelFilter">Trial ID</ControlLabel>
                <DataPicker
                  dataType="trialid"
                  OriginalData={trialFilterData}
                  dataValue={filterValue.trialid}
                  onChange={value => handleTrialFilterChange(value)}
                />
              </div>
            </Col>
          </div>
          <div>
            <Col md={4} lg={3}>
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
          <div>
            <Col md={4} lg={3}>
              <div className="show-col">
                <ControlLabel className="labelFilter">Replicate</ControlLabel>
                <DataPicker
                  dataType="replicate"
                  selectAllData="All Replicate"
                  OriginalData={replicateFilterData}
                  dataValue={filterValue.replicate}
                  onChange={value => handleReplicateFilterChange(value)}
                />
              </div>
            </Col>
          </div>
          <div>
            <Col md={4} lg={3}>
              <div className="show-col">
                <ControlLabel className="labelFilter">Plot</ControlLabel>
                <DataPicker
                  dataType="plot"
                  selectAllData="All Plot"
                  OriginalData={plotFilterData}
                  dataValue={filterValue.plot}
                  onChange={value => handlePlotFilterChange(value)}
                />
              </div>
            </Col>
          </div>
          <Col md={4} lg={3}>
            <Button
              appearance="primary"
              className="applyButton"
              onClick={applyFilter}
            >
              Apply
            </Button>
          </Col>
          <Col md={4} lg={3}>
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

      <hr
        style={{ marginTop: "4rem", borderTop: "2px solid rgb(0 0 0 / 28%)" }}
      />

      <div>
        <h4 className="title">
          <span className="desc">Step 2:</span>{" "}
          <span className="purpose">Edit Palms Information</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid" id="dashboardTableSetting">
          <Col sm={6} md={6} lg={6} className="totalRecordLayout">
            <b>Total records ({tableData ? tableData.length : null})</b>
          </Col>
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
              <EditableCell dataKey={col.dataKey} />
            </Column>
          )
        })}
      </Table>

      <Grid fluid className="footerLayout">
        <Row className="show-grid">
          <FlexboxGrid justify="end">
            <Col md={5} lg={4}>
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
            <Col md={5} lg={4}>
              <FlexboxGrid.Item>
                <Button
                  className="saveButton"
                  appearance="primary"
                  onClick={() => setConfirmationModal(true)}
                  type="button"
                >
                  Save
                </Button>
              </FlexboxGrid.Item>
            </Col>
          </FlexboxGrid>
        </Row>
      </Grid>
    </div>
  )
}

export default EditPalmInformation
