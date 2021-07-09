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
import { clearBreadcrumb } from "../../redux/actions/app.action"

import DashboardService from "../../services/dashboarddata.service"

import TrialService from "../../services/trial.service"

import PlotService from "../../services/plot.service"

import ProgenyService from "../../services/progeny.service"

import SearchMessage from "../../assets/img/SearchMessage.svg"

import AttachMessage from "../../assets/img/AttachMessage.svg"
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
let progenyIdSet = []
let replicateSelector = "All"
const AttachProgeny = ({
  currentSubNavState,
  currentItem,
  option,
  ...props
}) => {
  const initialFilterState = {
    trialCode: option.trial,
    estate: "All",
    replicate: "All"
  }

  const [filters, setFilters] = useState(initialFilterState)
  const [editableTrial, setEditableTrial] = useState(true)
  const [show, setShow] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nPalm, setnPalm] = useState(16)
  const [nPalmValue, setNPalmValue] = useState(null)
  const [trialIds, setTrialIds] = useState([])
  const [estates, setEstates] = useState([])
  const [progenies, setProgenies] = useState([])
  const [progenyIds, setProgenyIds] = useState([])
  const [disabledRepIds, setDisabledRepIds] = useState({})
  const [replicates, setReplicates] = useState([])
  const [trialPlots, setTrialPlots] = useState([])
  const [trialEstatesBlocks, setTrialEstatesBlocks] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    setFilterTrialIds()
    setTrialEstateReplicates()
    if (option.trial) {
      setTrials()
      setPlots()
      setProgeny()
    }
  }, [])

  function onReset() {
    setFilters(() => ({ ...filters, trialCode: null, estate: null }))
    setTrialPlots([])
  }

  function setFilterTrialIds() {
    const selectorTrialIds = []
    const trialIdxs = [...new Set(trialData.map(trial => trial.trialCode))]
    trialIdxs.forEach(id => {
      selectorTrialIds.push({
        label: id,
        value: id
      })
    })
    setTrialIds(selectorTrialIds)
  }
  async function setProgeny() {
    const result = await DashboardService.getDashboardData("progeny")
    console.log(result.data)
    setProgenies(result.data)
    const selectorProgenyIds = []
    result.data.forEach(progeny => {
      selectorProgenyIds.push({
        label: progeny.progenyCode,
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
    if (name === "trialCode") {
      const selectedTrial = trialData.find(trial => trial.trialCode === value)

      setTrialEstates(selectedTrial)
    }
    setFilters(() => ({ ...filters, [name]: value }))
  }

  function onApply() {
    setTrials()
    setPlots()
    setProgeny()

    setTrialEstateReplicates()
  }

  function getEstateName(id) {
    const estateObj = estates.find(est => est.value === id)

    return estateObj ? estateObj.label : ""
  }
  function setTrials() {
    const selectedTrial = trialData.find(
      trial => trial.trialCode === filters.trialCode
    )

    setEditableTrial(selectedTrial.isEditable)
    setTrialEstates(selectedTrial)
  }
  function setTrialEstates(trial) {
    const trialEstate = []
    const trialEstateBlocks = []
    trialEstate.push({
      label: "All Estate",
      value: "All"
    })
    trial.estate.forEach(est => {
      trialEstate.push({
        label: est.name,
        value: est.id
      })
      for (let i = 0; i < est.estateblocks.length; i++) {
        trialEstateBlocks.push({
          label: `${est.name} - ${est.estateblocks[i].estateblock}`,
          id: est.estateblocks[i].blockId,
          name: est.estateblocks[i].estateblock,
          estate: est.name,
          value: `${est.name} - ${est.estateblocks[i].estateblock}`
        })
      }
    })

    // SET THE ESTATE BLOCKS WITH ESTATE NAME
    console.log({ trialEstateBlocks })
    setTrialEstatesBlocks(trialEstateBlocks)
    setEstates(trialEstate)
  }
  async function setTrialEstateReplicates() {
    const { trialId } = trialData.find(
      trial => trial.trialCode === filters.trialCode
    )
    const reps = await TrialService.getTrialReplicates(trialId)
    const trialReps = []
    const map = new Map()
    for (const item of reps.replicates) {
      if (!map.has(item.replicateId)) {
        map.set(item.replicateId, true) // set any value to Map
        trialReps.push({
          label: item.replicate,
          value: item.replicateId
        })
      }
    }
    trialReps.unshift({
      label: `All Replicates`,
      value: `All`
    })
    console.log({ trialReps })
    setReplicates(trialReps)
  }
  async function setPlots(replicate = undefined) {
    if (replicate) replicateSelector = replicate
    const { trialId } = trialData.find(
      trial => trial.trialCode === filters.trialCode
    )
    setLoading(true)
    const data = await PlotService.getTrialPlots(trialId)

    data.forEach(item => {
      item["blockId"] = item.estateblocks[0].id
      item["isUpdated"] = false
    })
    console.log({ data })

    if (replicateSelector != "All") {
      console.log(replicateSelector)
      const filteredReps = data.filter(d => d.replicate === replicateSelector)
      return setTrialPlots(filteredReps)
    } else {
      setTrialPlots(data)
    }
    setLoading(false)
  }

  function handleProgenyChange(value, idx, replicate) {
    console.log({ disabledRepIds })
    const existingProgenies = [...progenies]
    const foundedProgeny = existingProgenies.find(
      pro => pro.progenyId === value
    )
    const data = [...trialPlots]
    data[idx].progenyId = value
    data[idx].progeny = foundedProgeny.progeny
    data[idx].ortet = foundedProgeny.ortet ? foundedProgeny.ortet : "-"
    data[idx].fp = foundedProgeny.fp
    data[idx].mp = foundedProgeny.mp
    data[idx].isUpdated = true
    setTrialPlots(data)

    if (disabledRepIds[replicate]) {
      progenyIdSet = [...disabledRepIds[replicate], value]
    } else {
      progenyIdSet = [value]
    }

    setDisabledRepIds(() => ({ ...disabledRepIds, [replicate]: progenyIdSet }))
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
    setNPalmValue(parseInt(nPalm))
    setTrialPlots(plots)
    setShow(false)
  }

  function handlePlotChange(value, idx) {
    const data = [...trialPlots]
    data[idx].plotName = value
    data[idx].isUpdated = true
    setTrialPlots(data)
  }
  async function onSave() {
    const newArray = trialPlots.map(
      ({
        subblock,
        estateblock,
        estateblocks,
        design,
        fp,
        mp,
        ortet,
        replicate,
        progeny,
        ...keepAttrs
      }) => keepAttrs
    )
    const payload = {
      progenies: newArray.filter(progeny => progeny.isUpdated),
      nPalm: nPalmValue
    }
    await ProgenyService.attachProgeny(payload, filters.trialCode)
    setShowConfirmation(false)
  }

  function checkDisableStateForSave() {
    const plots = [...trialPlots]
    var found = false
    for (var i = 0; i < plots.length; i++) {
      const keys = Object.keys(plots[i])
      if (keys.length != 12) {
        found = true
        break
      }
    }
    return found
  }

  function getEstateBlocksItem(items) {
    const blocks = []
    items.forEach(block => {
      blocks.push({
        label: block.name,
        value: block.id
      })
    })
    return blocks
  }
  function handleEstateBlockChange(value, idx, estate) {
    const data = [...trialPlots]
    data[idx].blockId = value
    data[idx].estate = estate
    data[idx].isUpdated = true
    setTrialPlots(data)
  }

  function getEstateBlockValue(estate, id) {
    const block = estate
      ? trialEstatesBlocks.find(teb => teb.id === id && teb.estate === estate)
      : trialEstatesBlocks.find(teb => teb.id === id)
    return block.value
  }
  return (
    <div id="TrialAction">
      {/* STEP 1 GENERATE TABLE START*/}
      <div>
        <h4 className="title">
          <span className="desc">Step 1:</span>{" "}
          <span className="purpose">Search Plots</span>
        </h4>
      </div>

      <Grid fluid id="dashboardFilterPanel">
        <Row className="show-grid">
          <Col sm={6} md={6} lg={3}>
            <ControlLabel>Trial ID</ControlLabel>
            <br />
            <SelectPicker
              data={trialIds}
              value={filters.trialCode}
              onChange={(value, e) => setFilterData(value, "trialCode")}
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

          <Col sm={5} md={4} lg={2}>
            <Button
              className="applyButton"
              appearance="primary"
              onClick={onApply}
            >
              Apply
            </Button>
          </Col>

          <Col sm={3} md={4} lg={2}>
            <Button
              className="resetButton"
              appearance="subtle"
              onClick={onReset}
            >
              Reset Filter
            </Button>
          </Col>
        </Row>
      </Grid>
      {/* STEP 1 GENERATE TABLE END */}
      <hr className="lineBetweenStep" />

      {/* STEP 2 CUSTOMISE TABLE START*/}
      <div>
        <h4 className="title">
          <span className="desc">Step 2:</span>{" "}
          <span className="purpose">Attach Progenies</span>
        </h4>
      </div>
      {(() => {
        if (trialPlots.length && editableTrial) {
          return (
            <>
              <Grid fluid>
                <Row className="show-grid" id="dashboardTableSetting">
                  <Col sm={6} md={6} lg={6} className="totalRecordLayout">
                    <b>Total records ({trialPlots.length})</b>
                  </Col>

                  <FlexboxGrid justify="end">
                    <Col sm={5} md={5} lg={4}>
                      <FlexboxGrid.Item>
                        <SelectPicker
                          data={replicates}
                          value={replicateSelector}
                          disabled={!option.estate}
                          onChange={(value, e) => setPlots(value)}
                          style={{ width: 180 }}
                        />
                      </FlexboxGrid.Item>
                    </Col>
                    <Col sm={5} md={5} lg={4}>
                      <FlexboxGrid.Item>
                        <Button
                          appearance="primary"
                          className="nPalmButton"
                          onClick={() => setShow(true)}
                        >
                          Enter nPalm
                        </Button>
                      </FlexboxGrid.Item>
                    </Col>

                    <Col sm={5} md={5} lg={4}>
                      <FlexboxGrid.Item>
                        <div className="deleteButtonLayout">
                          <Button
                            className="btnAddTrial"
                            appearance="primary"
                            onClick={onSave}
                          >
                            Quick Save
                          </Button>
                        </div>
                      </FlexboxGrid.Item>
                    </Col>
                  </FlexboxGrid>
                </Row>
              </Grid>

              <Table
                virtualized
                wordWrap
                data={trialPlots}
                height={400}
                rowHeight={55}
                shouldUpdateScroll={false}
              >
                <Column width={120} align="left">
                  <HeaderCell className="tableHeader">Replicate</HeaderCell>
                  <Cell>
                    {(rowData, i) => {
                      return <Input value={rowData.replicate} disabled />
                    }}
                  </Cell>
                </Column>

                <Column width={170} align="left">
                  <HeaderCell className="tableHeader">Estate Block</HeaderCell>
                  <Cell dataKey="estateblock">
                    {(rowData, i) => {
                      if (filters.estate === "All") {
                        return (
                          <SelectPicker
                            data={trialEstatesBlocks}
                            value={getEstateBlockValue(
                              rowData.estate,
                              rowData.blockId
                            )}
                            style={{ width: 224 }}
                            placeholder="-"
                            onChange={(value, event) => {
                              const blockName = value.split("-")[1].trim()
                              const estateName = value.split("-")[0].trim()
                              const block = trialEstatesBlocks.find(
                                teb => teb.name === blockName
                              )
                              handleEstateBlockChange(block.id, i, estateName)
                            }}
                          />
                        )
                      } else if (rowData.estateblocks.length < 2) {
                        return (
                          <Input
                            value={rowData.estateblocks[0].name}
                            disabled
                          />
                        )
                      } else {
                        return (
                          <SelectPicker
                            data={getEstateBlocksItem(rowData.estateblocks)}
                            style={{ width: 224 }}
                            placeholder="-"
                            value={rowData.blockId}
                            onChange={(value, event) =>
                              handleEstateBlockChange(value, i, "")
                            }
                          />
                        )
                      }
                    }}
                  </Cell>
                </Column>
                <Column flexGrow={1} align="left">
                  <HeaderCell className="tableHeader">Design</HeaderCell>
                  <Cell dataKey="design">
                    {rowData => {
                      return <Input value={rowData.design} disabled />
                    }}
                  </Cell>
                </Column>
                <Column flexGrow={1} align="left">
                  <HeaderCell className="tableHeader">Plot</HeaderCell>
                  <Cell dataKey="plot">
                    {(rowData, i) => {
                      return (
                        <Input
                          value={rowData.plotName}
                          onChange={(value, event) =>
                            handlePlotChange(value, i)
                          }
                        />
                      )
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1} align="left">
                  <HeaderCell className="tableHeader">Subblock</HeaderCell>
                  <Cell dataKey="subblock">
                    {rowData => {
                      return <Input value={rowData.subblock} disabled />
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={2} align="left">
                  <HeaderCell className="tableHeader">Progeny ID</HeaderCell>
                  <Cell>
                    {(rowData, i) => {
                      return (
                        <SelectPicker
                          data={progenyIds}
                          style={{ width: 224 }}
                          placeholder="-"
                          disabledItemValues={disabledRepIds[rowData.replicate]}
                          // cleanable = {true}
                          value={rowData.progenyId}
                          onChange={(value, event) =>
                            handleProgenyChange(value, i, rowData.replicate)
                          }
                        />
                      )
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1} align="left">
                  <HeaderCell className="tableHeader">Progeny</HeaderCell>
                  <Cell>
                    {rowData => {
                      return <Input value={rowData.progeny} disabled />
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1} align="left">
                  <HeaderCell className="tableHeader">Ortet</HeaderCell>
                  <Cell>
                    {rowData => {
                      return <Input value={rowData.ortet} disabled />
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1} align="left">
                  <HeaderCell className="tableHeader">FP</HeaderCell>
                  <Cell>
                    {rowData => {
                      return <Input value={rowData.fp} disabled />
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1} align="left">
                  <HeaderCell className="tableHeader">MP</HeaderCell>
                  <Cell>
                    {rowData => {
                      return <Input value={rowData.mp} disabled />
                    }}
                  </Cell>
                </Column>

                <Column flexGrow={1} align="left">
                  <HeaderCell className="tableHeader">nPalm</HeaderCell>
                  <Cell>
                    {(rowData, i) => {
                      return (
                        <Input
                          value={rowData.nPalm}
                          onChange={(value, e) => {
                            const data = [...trialPlots]
                            data[i].nPalm = value
                            data[i].isUpdated = true
                            setTrialPlots(data)
                          }}
                        />
                      )
                    }}
                  </Cell>
                </Column>
              </Table>

              {/* STEP 2 CUSTOMISE TABLE END*/}
              <Grid fluid className="footerLayout attachProgeny">
                <Row className="show-grid">
                  <FlexboxGrid justify="end">
                    <Col sm={5} md={5} lg={3} className="cancelButtonLayout">
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
                    <Col sm={5} md={5} lg={3} className="completeButtonLayout">
                      <FlexboxGrid.Item>
                        <Button
                          className="saveButton"
                          appearance="primary"
                          onClick={() => setShowConfirmation(true)}
                          type="button"
                          disabled={checkDisableStateForSave()}
                        >
                          Complete
                        </Button>
                      </FlexboxGrid.Item>
                    </Col>
                  </FlexboxGrid>
                </Row>
              </Grid>
            </>
          )
        } else if (!editableTrial) {
          return (
            <div className="imageLayout">
              <img src={AttachMessage} alt="" />
              <p className="desc">
                Plots at{" "}
                <b className="title">
                  Trial ID {filters.trialCode} at Estate{" "}
                  {getEstateName(filters.estate)}{" "}
                </b>{" "}
                have data attached to the palms.
              </p>
            </div>
          )
        } else {
          return (
            <div className="imageLayout">
              <img src={SearchMessage} alt="" />
              <p className="desc">
                Please enter <b className="title">Trial ID and Estate</b> to
                attach progenies to plots
              </p>
            </div>
          )
        }
      })()}

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
          <Button appearance="primary">Yes</Button>
        </Modal.Footer>
      </Modal>
      {/* CONFIRMATION MODEL END */}
    </div>
  )
}
export default AttachProgeny
