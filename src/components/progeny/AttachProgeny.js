import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Table,
  FlexboxGrid,
  Button,
  Grid,
  Row,
  Col,
  Checkbox,
  Input,
  SelectPicker,
  Pagination,
  Modal,
  ControlLabel
} from "rsuite"

import DashboardService from "../../services/dashboarddata.service"

import TrialService from "../../services/trial.service"

import PlotService from "../../services/plot.service"
const { Column, HeaderCell, Cell } = Table
const initialState = {
  displaylength: 10,
  prev: true,
  next: true,
  first: false,
  last: false,
  ellipsis: true,
  boundaryLinks: true,
  activePage: 1
}

const AttachProgeny = ({
  currentSubNavState,
  currentItem,
  option,
  ...props
}) => {
  const initialFilterState = {
    trialId: option.trial,
    estate: option.estate,
    replicate: "All"
  }

  const [filters, setFilters] = useState(initialFilterState)
  const [pagination, setPagination] = useState(initialState)
  const [show, setShow] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [nPalm, setnPalm] = useState(16)
  const [trialIds, setTrialIds] = useState([])
  const [estates, setEstates] = useState([])
  const [progenies, setProgenies] = useState([])
  const [progenyIds, setProgenyIds] = useState([])
  const [disabledProgenyIds, setDisabledProgenyIds] = useState([])
  const [replicates, setReplicates] = useState([])
  const [trialPlots, setTrialPlots] = useState([])
  const [checkStatus, setCheckStatus] = useState([])
  const { activePage, displaylength } = pagination
  useEffect(() => {
    setTrials()
    setPlots()
    setProgeny()
  }, [])

  async function setProgeny() {
    const result = await DashboardService.getDashboardData("progeny")
    console.log(result.data)
    setProgenies(result.data)
    const selectorProgenyIds = []
    result.data.forEach(progeny => {
      selectorProgenyIds.push({
        label: progeny.progenyId,
        value: progeny.progenyId
      })
    })
    setProgenyIds(selectorProgenyIds)
  }
  const trialData = useSelector(
    state => state.dashboardDataReducer.result.trial
  )

  function setFilterData(value, name) {
    console.log(value, name)
    setFilters(() => ({ ...filters, [name]: value }))
  }

  function onApply() {
    console.log(filters)
    setTrials()
    setPlots()
    setProgeny()
  }
  function setTrials() {
    const selectorTrialIds = []
    const trialIdxs = [...new Set(trialData.map(trial => trial.trialid))]
    trialIdxs.forEach(id => {
      selectorTrialIds.push({
        label: id,
        value: id
      })
    })
    setTrialIds(selectorTrialIds)
    const selectedTrial = trialData.find(
      trial => trial.trialid === filters.trialId
    )
    setTrialEstates(selectedTrial)
  }
  function setTrialEstates(trial) {
    const trialEstate = trial.estate
    setEstates([
      {
        label: trialEstate,
        value: trialEstate
      }
    ])
    setTrialEstateReplicates()
  }
  async function setTrialEstateReplicates() {
    const reps = await TrialService.getTrialReplicates(filters.trialId)
    const trialReps = []
    reps.replicates.forEach(replicate => {
      trialReps.push({
        label: ` Rep ${replicate.replicate}`,
        value: replicate.replicate
      })
    })
    trialReps.unshift({
      label: `All Replicates`,
      value: `All`
    })
    console.log({ trialReps })
    setReplicates(trialReps)
  }
  async function setPlots() {
    const data = await PlotService.getTrialPlots(filters.trialId)
    console.log({ data })

    if (filters.replicate != "All") {
      // const plots = [...trialPlots]
      data.forEach(plot => {
        plot.replicate = filters.replicate
      })
      // setTrialPlots(plots)
    }
    setTrialPlots(data)
  }

  function getData(displaylength) {
    return trialPlots.filter((v, i) => {
      // v["rowNumber"] = i
      const start = displaylength * (activePage - 1)
      const end = start + displaylength
      return i >= start && i < end
    })
  }
  function handleChangePage(dataKey) {
    setPagination(() => ({ ...pagination, activePage: dataKey }))
  }

  function getNoPages() {
    return Math.ceil(trialPlots.length / displaylength)
  }

  function handleProgenyChange(value, idx) {
    const existingProgenies = [...progenies]
    const foundedProgeny = existingProgenies.find(
      pro => pro.progenyId === value
    )
    const data = [...trialPlots]
    data[idx].progeny = foundedProgeny.progeny
    data[idx].ortet = foundedProgeny.ortet ? foundedProgeny.ortet : "-"
    data[idx].fp = foundedProgeny.fp
    data[idx].mp = foundedProgeny.mp
    setTrialPlots(data)
    setDisabledProgenyIds([...disabledProgenyIds, value])
  }

  let checked = false
  let indeterminate = false

  if (checkStatus.length === 0) {
    checked = false
    indeterminate = false
  } else if (checkStatus.length > 0 && checkStatus.length < trialPlots.length) {
    checked = false
    indeterminate = true
  } else if (checkStatus.length === trialPlots.length) {
    checked = true
    indeterminate = false
  }
  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div>
        <Checkbox
          value={rowData[dataKey]}
          inline
          onChange={onChange}
          checked={checkedKeys.some(item => item === rowData[dataKey])}
        />
      </div>
    </Cell>
  )
  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
  }
  const handleCheckAll = (value, checked) => {
    const keys = checked ? trialPlots.map(item => item.plot) : []
    setCheckStatus(keys)
  }

  function UnderLinedText(props) {
    return (
      <span
        style={{
          fontWeight: "bold",
          textDecorationLine: "underline",
          fontSize: "16px"
        }}
      >
        {props.text}
      </span>
    )
  }

  function onEnterNpalm() {
    const plots = [...trialPlots]
    plots.forEach(plot => {
      plot["nPalm"] = parseInt(nPalm)
    })
    setTrialPlots(plots)
    setShow(false)
  }

  function onDeletePlot() {
    const data = [...trialPlots]
    for (let index in checkStatus) {
      data.splice(checkStatus[index + 1], 1)
      checkStatus.splice(index + 1, 1)
    }
    setTrialPlots(data)
  }

  function handleReplicateChange(value, replicate, idx) {
    const data = [...trialPlots]
    data[idx].replicate = value
    setTrialPlots(data)
  }
  function onSave() {
    console.log(trialPlots)
    setShowConfirmation(false)
  }

  function checkDisableStateForSave() {
    const plots = [...trialPlots]
    var found = false
    for (var i = 0; i < plots.length; i++) {
      const keys = Object.keys(plots[i])
      if (keys.length != 10) {
        found = true
        break
      }
    }
    console.log(found)
    return found
  }
  return (
    <div id="attachProgeny">
      {/* STEP 1 GENERATE TABLE START*/}
      <div>
        <h4>
          <span style={{ color: "#009D57" }}>Step 1:</span>{" "}
          <span style={{ color: "#353131f2" }}>Search Plots</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid">
          <Col sm={6} md={6} lg={3}>
            <ControlLabel>Trial ID</ControlLabel>
            <br />
            <SelectPicker
              data={trialIds}
              value={filters.trialId}
              onChange={(value, e) => setFilterData(value, "trialId")}
              style={{ width: 180 }}
            />
          </Col>
          <Col sm={6} md={6} lg={3}>
            <ControlLabel>Estate</ControlLabel>
            <br />
            <SelectPicker
              data={estates}
              value={filters.estate}
              onChange={(value, e) => setFilterData(value, "estate")}
              style={{ width: 180 }}
            />
          </Col>
          <Col sm={6} md={6} lg={3}>
            <ControlLabel>Replicate</ControlLabel>
            <br />
            <SelectPicker
              data={replicates}
              value={filters.replicate}
              disabled={!option.estate}
              onChange={(value, e) => setFilterData(value, "replicate")}
              style={{ width: 180 }}
            />
          </Col>
          <Col sm={5} md={4} lg={2}>
            <div className="show-col" style={{ padding: "25px 0px 0px 0px" }}>
              <Button
                className="btnApply"
                appearance="primary"
                onClick={onApply}
              >
                Apply
              </Button>
            </div>
          </Col>

          <Col sm={3} md={4} lg={2}>
            <div className="show-col">
              <Button
                className="btnResetFilter"
                appearance="subtle"
                //   onClick={onReset}
              >
                Reset Filter
              </Button>
            </div>
          </Col>
        </Row>
      </Grid>
      {/* STEP 1 GENERATE TABLE END */}
      <hr
        style={{ marginTop: "4rem", borderTop: "2px solid rgb(0 0 0 / 28%)" }}
      />

      {/* STEP 2 CUSTOMISE TABLE START*/}
      <div>
        <h4>
          <span style={{ color: "#009D57" }}>Step 2:</span>{" "}
          <span style={{ color: "#353131f2" }}>Attach Progenies</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid" id="dashboardTableSetting">
          <Col sm={6} md={6} lg={6} className="totalRecordLayout">
            <b>Total records ({trialPlots.length})</b>
          </Col>

          <FlexboxGrid justify="end">
            <Col sm={5} md={5} lg={4}>
              <FlexboxGrid.Item>
                <Button
                  appearance="primary"
                  className="addEstateBlockButton"
                  onClick={() => setShow(true)}
                >
                  Enter nPalm
                </Button>
              </FlexboxGrid.Item>
            </Col>

            <Col sm={4} md={4} lg={3}>
              <FlexboxGrid.Item>
                <div className="deleteButtonLayout">
                  <Button
                    className="deleteButton"
                    disabled={checkStatus.length === 0}
                    onClick={onDeletePlot}
                  >
                    Delete
                  </Button>
                </div>
              </FlexboxGrid.Item>
            </Col>
          </FlexboxGrid>
        </Row>
      </Grid>

      <Table wordWrap data={getData(displaylength)} autoHeight>
        <Column width={70} align="center" fixed>
          <HeaderCell className="tableHeader">
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              onChange={handleCheckAll}
            />
          </HeaderCell>
          <CheckCell
            dataKey="plot"
            checkedKeys={checkStatus}
            onChange={handleCheck}
          />
        </Column>

        <Column width={120} align="left">
          <HeaderCell className="tableHeader">Replicate</HeaderCell>
          <Cell>
            {(rowData, i) => {
              return (
                <SelectPicker
                  data={replicates.filter(rep => rep.value != "All")}
                  style={{ width: 224 }}
                  placeholder="-"
                  value={rowData.replicate}
                  disabled={filters.replicate != "All"}
                  onChange={(value, event) =>
                    handleReplicateChange(value, rowData.replicate, i)
                  }
                />
              )
            }}
          </Cell>
        </Column>

        <Column width={100} align="left">
          <HeaderCell className="tableHeader">Estate Block</HeaderCell>
          <Cell dataKey="estateblock">
            {rowData => {
              return <Input value={rowData.estateblock} disabled />
            }}
          </Cell>
        </Column>
        <Column width={150} align="left">
          <HeaderCell className="tableHeader">Design</HeaderCell>
          <Cell dataKey="design">
            {rowData => {
              return <Input value={rowData.design} disabled />
            }}
          </Cell>
        </Column>
        <Column width={100} align="left">
          <HeaderCell className="tableHeader">Plot</HeaderCell>
          <Cell dataKey="plot">
            {rowData => {
              return <Input value={`Plot ${rowData.plot}`} />
            }}
          </Cell>
        </Column>

        <Column width={100} align="left">
          <HeaderCell className="tableHeader">Subblock</HeaderCell>
          <Cell dataKey="subblock">
            {rowData => {
              return <Input value={rowData.subblock} />
            }}
          </Cell>
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Progeny ID</HeaderCell>
          <Cell>
            {(rowData, i) => {
              return (
                <SelectPicker
                  data={progenyIds}
                  style={{ width: 224 }}
                  placeholder="-"
                  //   disabledItemValues={disabledProgenyIds}
                  // cleanable = {true}
                  onChange={(value, event) => handleProgenyChange(value, i)}
                />
              )
            }}
          </Cell>
        </Column>

        <Column width={100} align="left">
          <HeaderCell className="tableHeader">Progeny</HeaderCell>
          <Cell>
            {rowData => {
              return <Input value={rowData.progeny} disabled />
            }}
          </Cell>
        </Column>

        <Column width={100} align="left">
          <HeaderCell className="tableHeader">Ortet</HeaderCell>
          <Cell>
            {rowData => {
              return <Input value={rowData.ortet} disabled />
            }}
          </Cell>
        </Column>

        <Column width={100} align="left">
          <HeaderCell className="tableHeader">FP</HeaderCell>
          <Cell>
            {rowData => {
              return <Input value={rowData.fp} disabled />
            }}
          </Cell>
        </Column>

        <Column width={100} align="left">
          <HeaderCell className="tableHeader">MP</HeaderCell>
          <Cell>
            {rowData => {
              return <Input value={rowData.mp} disabled />
            }}
          </Cell>
        </Column>

        <Column width={100} align="left">
          <HeaderCell className="tableHeader">nPalm</HeaderCell>
          <Cell>
            {rowData => {
              return <Input value={rowData.nPalm} />
            }}
          </Cell>
        </Column>
      </Table>

      <div>
        <Pagination
          {...pagination}
          pages={getNoPages()}
          maxButtons={2}
          activePage={activePage}
          onSelect={handleChangePage}
        />
      </div>
      {/* STEP 2 CUSTOMISE TABLE END*/}
      <Grid fluid>
        <Row className="show-grid" id="tableOption">
          <FlexboxGrid justify="end">
            <Col sm={5} md={5} lg={3}>
              <FlexboxGrid.Item>
                <Button appearance="subtle" className="btnAddTrial">
                  Cancel
                </Button>
              </FlexboxGrid.Item>
            </Col>
            <Col sm={5} md={5} lg={3}>
              <FlexboxGrid.Item>
                <Button
                  className="btnAddTrial"
                  appearance="primary"
                  onClick={() => setShowConfirmation(true)}
                  type="button"
                  disabled={checkDisableStateForSave()}
                >
                  Save
                </Button>
              </FlexboxGrid.Item>
            </Col>
          </FlexboxGrid>
        </Row>
      </Grid>
      {/* ENTER NPALM MODEL START */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          <Modal.Title style={{ color: "#009D57" }}>Enter nPalm</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "#444444" }}>
          You have a Total of{" "}
          <UnderLinedText text={`${trialPlots.length} Palms`} />.<br />
          Do you want to copy the value of nPalms to all Plots? Please enter
          value here:
          <br />
          <br />
          <Input
            placeholder="Enter number of Palms"
            value={nPalm}
            onChange={(value, e) => setnPalm(value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)} appearance="subtle">
            No
          </Button>
          <Button onClick={onEnterNpalm} appearance="primary">
            Enter nPalm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ENTER NPALM MODEL END */}

      {/* CONFIRMATION MODEL START */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header>
          <Modal.Title style={{ color: "#009D57" }}>Saving Plot</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "#444444" }}>
          Are you sure you want to save data for All the Plots ? All the Plots
          will be attached to a unique Progeny.
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowConfirmation(false)}
            appearance="subtle"
          >
            No
          </Button>
          <Button onClick={onSave} appearance="primary">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* CONFIRMATION MODEL END */}
    </div>
  )
}
export default AttachProgeny
