import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import {
  Table,
  FlexboxGrid,
  Button,
  Icon,
  IconButton,
  Grid,
  Row,
  Col,
  Checkbox,
  Input,
  DatePicker,
  Radio,
  RadioGroup,
  SelectPicker,
  Modal
} from "rsuite"
import EstateService from "../../services/estate.service"

import SubDirectoryIcon from "../../assets/img/icons/subdirectory_arrow_right_24px.svg"
import CreateIcon from "../../assets/img/icons/create_24px.svg"
import TrialService from "../../services/trial.service"
import { publish } from "../../services/pubsub.service"
const styles = { width: 280, display: "block", marginBottom: 10 }
const { Column, HeaderCell, Cell } = Table
const initializeTrailState = {
  trialid: "",
  trial: "",
  trialremark: "",
  area: "",
  planteddate: "",
  nofprogeny: 0,
  nofreplicate: "",
  nofplot_subblock: 0,
  nofsubblock: 0,
  design: "",
  density: ""
}
const EditTrial = ({ currentSubNavState, currentItem, option, ...props }) => {
  console.log({ option })
  const dispatch = useDispatch()
  const [trial, setTrial] = useState(initializeTrailState)
  const [status, setStatus] = useState("")
  const [disabled, setDisabled] = useState("no")
  const [regenerateTable, setRegenerateTable] = useState(false)
  const [replicatesInEstate, setReplicatesInEstate] = useState([])
  const [existingReplicatesInEstate, setExistingReplicatesInEstate] = useState(
    []
  )
  useEffect(() => {
    // call an API and in the success or failure fill the data buy using setData function
    // it could be like below
    TrialService.getTrialReplicates(option.trial).then(data => {
      setTrial(data)
      setStatus(data.status)
      setExistingReplicatesInEstate(data.replicates)
      //Can be multiple estate in trial
      const estateReps = {
        estate: data.estate,
        replicate: data.nofreplicate
      }
      setReplicatesInEstate([estateReps])
    })
  }, [])

  const [estates, setEstates] = useState([])
  const [estatesWithBlocks, setEstatesWithBlocks] = useState([])
  const [designs, setDesigns] = useState([])
  const [isMultplicationValid, setMultplicationValid] = useState(null)

  const [checkStatusReplicates, setCheckStatusReplicate] = useState([])
  const [estateblocks, setEstateblocks] = useState([])
  const [disbaledANR, setDisbaledANR] = useState(true)
  const [disbaledANRV, setDisbaledANRV] = useState(true)
  const [disbaledRD, setDisbaledRD] = useState(true)
  const [show, setShow] = useState(false)
  const [showRegenerateWarning, setShowRegenerateWarning] = useState(false)
  useEffect(() => {
    fetchEstates()
    fetchDesigns()
  }, [isMultplicationValid, trial])

  async function fetchEstates() {
    const { data } = await EstateService.getUpdatedEstateBlocks()
    setEstatesWithBlocks(data)
    const mappedEstate = []

    for (let item in data) {
      mappedEstate.push({ label: data[item].estate, value: data[item].estate })
    }
    console.log(mappedEstate)
    setEstates(mappedEstate)
  }
  async function fetchDesigns() {
    const { data } = await EstateService.getDesigns()
    const mappedDesigns = []

    for (let item in data) {
      mappedDesigns.push({ label: data[item].design, value: data[item].design })
    }
    console.log(mappedDesigns)
    setDesigns(mappedDesigns)
  }
  function onInput(e) {
    if (
      ["nofprogeny", "nofsubblock", "nofplot_subblock"].includes(e.target.name)
    ) {
      //Check if Multiplication of No. of Subblock and No. of Plot/Subblock is equal to No. of Progeny.
      const isValid = verifyMultiplicationOfSubblockandPlot(
        e.target.name,
        e.target.value
      )

      setMultplicationValid(isValid)
    }
    e.persist()
    setTrial(() => ({ ...trial, [e.target.name]: e.target.value }))
  }
  // handle input change
  const handleTrialInEStateInputChange = (e, index, type) => {
    let name, value
    if (type === "select") {
      name = "estate"
      value = e
    } else {
      name = e.target.name
      value = e.target.value

      //UPDATE THE number of Replicare in Trial
      const currentnoOfRep =
        trial.nofreplicate != "" ? parseInt(trial.nofreplicate) : 0
      const updatednoOfRep = currentnoOfRep + parseInt(e.target.value)
      setTrial(() => ({ ...trial, nofreplicate: updatednoOfRep.toString() }))
    }
    const list = [...replicatesInEstate]
    list[index][name] = value
    setReplicatesInEstate(list)
  }
  function verifyMultiplicationOfSubblockandPlot(name, value) {
    const { nofprogeny, nofsubblock, nofplot_subblock } = trial
    const progenyNo = name === "nofprogeny" ? value : nofprogeny
    const subblockNo = name === "nofsubblock" ? value : nofsubblock
    const plot_subblockNo =
      name === "nofplot_subblock" ? value : nofplot_subblock
    const multi = parseInt(subblockNo) * parseInt(plot_subblockNo)
    return parseInt(progenyNo) === multi
  }

  function onAddTrialInEstate() {
    setReplicatesInEstate([
      ...replicatesInEstate,
      { estate: "", replicate: "" }
    ])
  }
  function onRemoveTrialInEstate(index) {
    const list = [...replicatesInEstate]
    list.splice(index, 1)
    setReplicatesInEstate(list)
  }
  function onSelectDesign(design) {
    setTrial(() => ({ ...trial, design }))
  }

  function onReGenerateTable() {
    const trialData = { ...trial }
    setExistingReplicatesInEstate([])
    for (let i = 0; i < replicatesInEstate.length; i++) {
      const noOfReps = parseInt(replicatesInEstate[i].replicate)
      console.log({ noOfReps })
      for (let replicate = 0; replicate < noOfReps; replicate++) {
        const item = {
          estate: replicatesInEstate[i].estate,
          replicate: replicate + 1,
          estateblock: "",
          density: trialData.density,
          design: trialData.design,
          soiltype: ""
        }
        console.log(item)
        setExistingReplicatesInEstate(oldtableData => [...oldtableData, item])
      }
    }

    trialData["replicates"] = existingReplicatesInEstate

    console.log({ trialData })
    setRegenerateTable(true)
    setShowRegenerateWarning(false)
    setDisbaledANR(false)
  }

  // GENERATE TABLE FUNCTIONS

  let checked = false
  let indeterminate = false
  const replicates = parseInt(trial.nofreplicate)
  if (checkStatusReplicates.length === replicates) {
    checked = true
  } else if (checkStatusReplicates.length === 0) {
    checked = false
  } else if (
    checkStatusReplicates.length > 0 &&
    checkStatusReplicates.length < replicates
  ) {
    indeterminate = true
  }

  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      {(rowData, i) => {
        return (
          <>
            <div>
              <Checkbox
                value={i}
                inline
                onChange={onChange}
                checked={checkedKeys.some(item => item === i)}
              />
            </div>
          </>
        )
      }}
    </Cell>
  )

  const handleCheckAllReplicates = (value, checked) => {
    const keys = checked ? existingReplicatesInEstate.map((item, i) => i) : []
    setCheckStatusReplicate(keys)
    // setDisbaledANRV(false)
    // setDisbaledRD(false)
  }

  const handleCheckReplicates = (value, checked) => {
    const keys = checked
      ? [...checkStatusReplicates, value]
      : checkStatusReplicates.filter(item => item !== value)
    setCheckStatusReplicate(keys)
    setDisbaledANRV(!checked)
    setDisbaledRD(!checked)
  }

  function getEstateBlocks(estate) {
    let estateBlocks = estatesWithBlocks.find(row => row.estate === estate)
    if (estateBlocks) {
      estateBlocks = estateBlocks.estateblocks
      setEstateblocks(estateBlocks)
    }

    const mappedEstateBlocks = []
    for (let item in estateBlocks) {
      mappedEstateBlocks.push({
        label: estateBlocks[item].estateblock,
        value: estateBlocks[item].estateblock
      })
    }
    return mappedEstateBlocks
  }

  function handleEstateBlockChange(block, replicate, rowIndex) {
    if (block) {
      const estateBlocksItems = []
      estatesWithBlocks.forEach(estate => {
        estateBlocksItems.push(...estate.estateblocks)
      })
      const estateBlocks = [
        ...new Set(
          estateBlocksItems
            .map(item => item.estateblock)
            .map(block =>
              estateBlocksItems.find(eb => eb.estateblock === block)
            )
        )
      ]

      const foundedBlock = estateBlocks.find(eb => eb.estateblock === block)
      const data = [...existingReplicatesInEstate]
      // data[rowIndex].estateblock = block
      data[rowIndex].blockId = foundedBlock.id
      data[rowIndex].soiltype = foundedBlock.soiltype
      setExistingReplicatesInEstate(data)
    } else {
      const data = [...existingReplicatesInEstate]
      data[rowIndex].estateblock = block
      setExistingReplicatesInEstate(data)
    }
  }
  function onAddingNewReplicate() {
    const data = [...existingReplicatesInEstate]
    let replicateObj = data[data.length - 1]
    const newRep = {
      estate: replicateObj.estate,
      replicate: parseInt(replicateObj.replicate) + 1,
      estateblock: replicateObj.estateblock,
      density: replicateObj.density,
      design: replicateObj.design,
      soiltype: replicateObj.soiltype
    }
    data[data.length] = newRep
    const currentnoOfRep =
      trial.nofreplicate != "" ? parseInt(trial.nofreplicate) : 0
    const updatednoOfRep = currentnoOfRep + 1
    setTrial(() => ({ ...trial, nofreplicate: updatednoOfRep.toString() }))
    setExistingReplicatesInEstate(data)
  }
  function onAddingNewReplicateVarient() {
    console.log(checkStatusReplicates)
    const data = [...existingReplicatesInEstate]
    console.log(data)
    for (let index in checkStatusReplicates) {
      console.log(checkStatusReplicates[index])
      const repIndex = checkStatusReplicates[index]
      const existingRep = data[repIndex]
      const variant = {
        estate: existingRep.estate,
        replicate: existingRep.replicate,
        estateblock: existingRep.estateblock,
        density: existingRep.density,
        design: existingRep.design,
        soiltype: existingRep.soiltype,
        isvariant: true
      }

      data.splice(repIndex + 1, 0, variant)
      setExistingReplicatesInEstate(data)
      console.log(existingRep)
    }
  }

  function deleteReplicate() {
    const data = [...existingReplicatesInEstate]
    for (let index in checkStatusReplicates) {
      data.splice(checkStatusReplicates[index], 1)
      checkStatusReplicates.splice(index, 1)
    }
    setExistingReplicatesInEstate(data)
  }

  function onSaveTrial() {
    setShow(false)
    trial["replicates"] = existingReplicatesInEstate
    console.log(trial)
    TrialService.editTrial(trial).then(
      data => {
        const savedData = {
          type: "TRIAL",
          data: trial,
          action: "UPDATED"
        }
        dispatch(clearBreadcrumb())
        publish(savedData)
      },
      err => console.log(err)
    )
  }

  function hide() {
    setShow(false)
  }

  const EditCell = ({ rowData, dataKey, onChange, ...props }) => {
    const editing = rowData.status === "EDIT"
    const blocks = getEstateBlocks(rowData.estate)
    return (
      <Cell {...props} className={editing ? "table-content-editing" : ""}>
        {editing && dataKey != "estateblock" ? (
          <input
            className="rs-input"
            defaultValue={rowData[dataKey]}
            disabled={["estate", "replicate", "design", "soiltype"].includes(
              dataKey
            )}
            onChange={event => {
              onChange &&
                onChange(rowData.replicate, dataKey, event.target.value)
            }}
          />
        ) : editing && dataKey === "estateblock" ? (
          <SelectPicker
            data={blocks}
            style={{ width: 224 }}
            placeholder="-"
            value={rowData.estateblock}
            onChange={value => {
              onChange && onChange(rowData.replicate, dataKey, value)
            }}
          />
        ) : (
          <span className="table-content-edit-span">{rowData[dataKey]}</span>
        )}
      </Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
    return (
      <Cell {...props} style={{ padding: "6px 0" }}>
        {/* <Button
          appearance="link"
          onClick={() => {
            onClick && onClick(rowData.replicate)
          }}
        > */}
        {rowData.status === "EDIT" ? (
          <>
            <IconButton
              icon={<Icon icon="check" />}
              circle
              color="green"
              size="xs"
              onClick={() => {
                onClick && onClick(rowData.replicate)
              }}
            />
            &nbsp;
            <IconButton
              icon={<Icon icon="close" />}
              circle
              color="red"
              size="xs"
              onClick={() => {
                onClick && onClick(rowData.replicate)
              }}
            />
          </>
        ) : (
          <img
            src={CreateIcon}
            onClick={() => {
              onClick && onClick(rowData.replicate)
            }}
          />
        )}
        {/* </Button> */}
      </Cell>
    )
  }

  const handleChange = (replicate, key, value) => {
    const nextData = Object.assign([], existingReplicatesInEstate)
    nextData.find(item => item.replicate === replicate)[key] = value
    setExistingReplicatesInEstate(nextData)
  }
  const handleEditState = replicate => {
    const nextData = Object.assign([], existingReplicatesInEstate)
    const activeItem = nextData.find(item => item.replicate === replicate)
    activeItem.status = activeItem.status ? null : "EDIT"
    setExistingReplicatesInEstate(nextData)
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

  function onTableInput(e, rowIndex) {
    e.persist()
    const data = [...existingReplicatesInEstate]
    data[rowIndex][e.target.name] = e.target.value
    setExistingReplicatesInEstate(data)
  }
  return (
    <div id="addNewTrial">
      {/* STEP 1 Edit Trial START*/}
      <div style={{ padding: "1rem" }}>
        <h4>
          <span style={{ color: "#009D57" }}>Step 1:</span>{" "}
          <span style={{ color: "#353131f2" }}>Edit Trial</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>Trail ID</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Trial ID"
              className="formField"
              name="trialid"
              value={trial.trialid}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>Trail</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Trial "
              className="formField"
              name="trial"
              value={trial.trial}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>Trial Remarks</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              componentClass="textarea"
              rows={3}
              placeholder="Key In Trial Remarks"
              className="formField trialRemark"
              name="trialremark"
              value={trial.trialremark}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>Area (ha)</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Area"
              className="formField"
              name="area"
              value={trial.area}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>Planted Date</p>
          </Col>
          <Col md={5} lg={5}>
            {" "}
            <DatePicker
              size="lg"
              className="datePicker"
              placeholder="Enter Date"
              format="MM/YYYY"
              style={styles}
              name="planteddate"
              onSelect={date =>
                setTrial(() => ({ ...trial, planteddate: date }))
              }
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>Status</p>
          </Col>
          <Col md={5} lg={5}>
            <RadioGroup
              name="radioList"
              value={status}
              onChange={value => {
                setStatus(value)
              }}
              inline
              style={{ color: "#353131f2" }}
            >
              <Radio value="active">Active</Radio>
              <Radio value="canceled">Canceled</Radio>
              <Radio value="finished">Finished</Radio>
            </RadioGroup>
          </Col>
        </Row>

        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2", marginBottom: 0 }}>
              Would you like to modify the data for the forms below?
            </p>
            <small style={{ fontSize: "14px", color: "grey" }}>
              (Please regenerate table to view changes)
            </small>
          </Col>
          <Col md={5} lg={5}>
            {" "}
            <RadioGroup
              name="radioList"
              value={disabled}
              onChange={value => {
                setDisabled(value)
              }}
              inline
              style={{ color: "#353131f2" }}
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>No. of Progeny</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in No.of Progeny"
              className="formField"
              name="nofprogeny"
              value={trial.nofprogeny}
              disabled={disabled === "no"}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>
              No. of Subblock and No.of Plot/Subblock
            </p>
          </Col>
          <Col md={5} lg={5}>
            <Input
              placeholder="No. of Subblock"
              className="formField noOfSubBlock"
              name="nofsubblock"
              value={trial.nofsubblock}
              disabled={disabled === "no"}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          <Col md={5} lg={5}>
            <Input
              placeholder="No. of Plot/Subblock "
              className="formField noOfPlot"
              name="nofplot_subblock"
              value={trial.nofplot_subblock}
              disabled={disabled === "no"}
              onChange={(value, e) => onInput(e)}
            />
            {isMultplicationValid === false ? (
              <>
                <p style={{ color: "red", fontSize: "12px" }}>
                  Multiplication of No. of Subblock and No. of Plot/Subblock
                  must be equal to No. of Progeny.{" "}
                </p>
              </>
            ) : (
              ""
            )}
          </Col>
        </Row>

        {disabled === "yes" ? (
          <Row className="show-grid">
            {replicatesInEstate.map((input, i) => (
              <>
                <div key={i}>
                  <Col xs={12} style={{ width: "100%" }}>
                    <Col xs={6}>
                      {i < 1 ? (
                        <p style={{ color: "#353131f2" }}>
                          No. of Replicates in Each Estate
                        </p>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col xs={3} style={{ "margin-bottom": "12px" }}>
                      <SelectPicker
                        data={estates}
                        placeholder="Select Estate"
                        value={input.estate}
                        onChange={(value, event) =>
                          handleTrialInEStateInputChange(value, i, "select")
                        }
                        block
                      />
                    </Col>
                    <Col xs={3}>
                      <Input
                        placeholder="Select No of Replicate"
                        className="formField"
                        value={input.replicate}
                        name="replicate"
                        onChange={(value, e) =>
                          handleTrialInEStateInputChange(e, i, "input")
                        }
                      />
                    </Col>
                    <IconButton
                      icon={<Icon icon="plus" />}
                      circle
                      color="green"
                      size="sm"
                      onClick={onAddTrialInEstate}
                    />
                    &nbsp;
                    {i > 0 ? (
                      <IconButton
                        icon={<Icon icon="close" />}
                        circle
                        color="red"
                        size="sm"
                        onClick={() => onRemoveTrialInEstate(i)}
                      />
                    ) : (
                      ""
                    )}
                  </Col>
                </div>
              </>
            ))}
          </Row>
        ) : (
          <Row className="show-grid">
            <Col md={6} lg={6}>
              <p style={{ color: "#353131f2" }}>Estate</p>
            </Col>
            <Col md={10} lg={10}>
              <Input
                className="formField"
                name="nofprogeny"
                value={trial.estate}
                disabled={disabled === "no"}
              />
            </Col>
          </Row>
        )}

        <Row className="show-grid">
          <Col md={6} lg={6}>
            <p style={{ color: "#353131f2" }}>
              What is the design for the replicates ?
            </p>
          </Col>
          <Col xs={6}>
            <SelectPicker
              id="design"
              data={designs}
              defaultValue={trial.design}
              onSelect={design => onSelectDesign(design)}
              block
              placeholder={trial.design}
              disabled={disabled === "no"}
            />{" "}
          </Col>
        </Row>
      </Grid>

      <div style={{ float: "right" }}>
        <Button
          appearance="primary"
          className="btnAddTrial"
          onClick={() => setShowRegenerateWarning(true)}
          disabled={disabled === "no" || !isMultplicationValid}
        >
          <Icon icon="table" /> Regenerate Table
        </Button>
      </div>
      {/* STEP 1 Edit Trial END */}
      <hr
        style={{ marginTop: "4rem", borderTop: "2px solid rgb(0 0 0 / 28%)" }}
      />

      {/* STEP 2 Edit Replicates in Trial START*/}
      <div style={{ padding: "1rem" }}>
        <h4>
          <span style={{ color: "#009D57" }}>Step 2:</span>{" "}
          <span style={{ color: "#353131f2" }}>Edit Replicates in Trial</span>
        </h4>
      </div>
      {regenerateTable ? (
        <>
          {/* TABLE WITH REGENERATED DATA  START*/}
          <Grid fluid>
            <Row className="show-grid" id="tableOption">
              <FlexboxGrid justify="end">
                <Col sm={5} md={5} lg={3}>
                  <FlexboxGrid.Item>
                    <Button
                      appearance="primary"
                      className="btnAddTrial"
                      onClick={onAddingNewReplicate}
                      disabled={disbaledANR}
                    >
                      Add New Replicate
                    </Button>
                  </FlexboxGrid.Item>
                </Col>
                <Col sm={5} md={5} lg={3}>
                  <FlexboxGrid.Item>
                    <Button
                      appearance="primary"
                      className="variant"
                      style={{ width: "158px" }}
                      onClick={onAddingNewReplicateVarient}
                      disabled={disbaledANRV}
                    >
                      Add Replicate Variant
                    </Button>
                  </FlexboxGrid.Item>
                </Col>
                <Col sm={5} md={5} lg={3}>
                  <FlexboxGrid.Item>
                    <Button
                      className="btnDelete"
                      onClick={deleteReplicate}
                      disabled={disbaledRD}
                    >
                      Delete
                    </Button>
                  </FlexboxGrid.Item>
                </Col>
              </FlexboxGrid>
            </Row>
          </Grid>

          <Table wordWrap data={existingReplicatesInEstate} autoHeight>
            <Column width={70} align="center" fixed>
              <HeaderCell className="tableHeader">
                <Checkbox
                  checked={checked}
                  indeterminate={indeterminate}
                  onChange={handleCheckAllReplicates}
                />
              </HeaderCell>
              <CheckCell
                dataKey="replicate"
                checkedKeys={checkStatusReplicates}
                onChange={handleCheckReplicates}
              />
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="tableHeader">Estate</HeaderCell>
              <Cell dataKey="estate">
                {rowData => {
                  return (
                    <>
                      {!rowData.isvariant ? (
                        <Input value={rowData.estate} disabled />
                      ) : (
                        ""
                      )}
                    </>
                  )
                }}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="tableHeader">Replicate</HeaderCell>
              <Cell dataKey="replicate">
                {rowData => {
                  return (
                    <>
                      {!rowData.isvariant ? (
                        <Input value={rowData.replicate} disabled />
                      ) : (
                        <img
                          src={SubDirectoryIcon}
                          style={{ margin: "0 50%" }}
                        />
                      )}
                    </>
                  )
                }}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="tableHeader">Estate Block</HeaderCell>
              <Cell>
                {(rowData, i) => {
                  return (
                    <SelectPicker
                      data={getEstateBlocks(rowData.estate)}
                      style={{ width: 224 }}
                      placeholder="-"
                      value={rowData.estateblock}
                      onChange={(value, event) =>
                        handleEstateBlockChange(value, rowData.replicate, i)
                      }
                    />
                  )
                }}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="tableHeader">Density</HeaderCell>
              <Cell>
                {(rowData, i) => {
                  return (
                    <Input
                      value={rowData.density}
                      name="density"
                      onChange={(value, e) => onTableInput(e, i)}
                    />
                  )
                }}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="tableHeader">Design</HeaderCell>
              <Cell>
                {(rowData, i) => {
                  return (
                    <Input
                      value={rowData.design}
                      name="design"
                      onChange={(value, e) => onTableInput(e, i)}
                      disabled
                    />
                  )
                }}
              </Cell>
            </Column>

            <Column width={200} align="left">
              <HeaderCell className="tableHeader">Soil Type</HeaderCell>
              <Cell>
                {(rowData, i) => {
                  return (
                    <Input
                      value={rowData.soiltype}
                      disabled
                      onChange={(value, e) => onTableInput(e, i)}
                      placeholder="-"
                    />
                  )
                }}
              </Cell>
            </Column>
          </Table>

          {/* TABLE WITH REGENERATED DATA  END*/}
        </>
      ) : (
        <>
          {/* TABLE WITH NO REGENERATED DATA  START*/}

          <Table wordWrap data={existingReplicatesInEstate} autoHeight>
            <Column width={200}>
              <HeaderCell>Estate</HeaderCell>
              <EditCell dataKey="estate" onChange={handleChange} />
            </Column>

            <Column width={200}>
              <HeaderCell>Replicate</HeaderCell>
              <EditCell dataKey="replicate" onChange={handleChange} />
            </Column>

            <Column width={300}>
              <HeaderCell>Estate Block</HeaderCell>
              <EditCell dataKey="estateblock" onChange={handleChange} />
            </Column>

            <Column width={300}>
              <HeaderCell>Density</HeaderCell>
              <EditCell dataKey="density" onChange={handleChange} />
            </Column>

            <Column width={300}>
              <HeaderCell>Design</HeaderCell>
              <EditCell dataKey="design" onChange={handleChange} />
            </Column>
            <Column width={300}>
              <HeaderCell>Soil Type</HeaderCell>
              <EditCell dataKey="soiltype" onChange={handleChange} />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>Action</HeaderCell>
              <ActionCell dataKey="replicate" onClick={handleEditState} />
            </Column>
          </Table>

          {/* TABLE WITH NO REGENERATED DATA  END*/}
        </>
      )}

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
                  onClick={() => setShow(true)}
                  type="button"
                >
                  Save
                </Button>
              </FlexboxGrid.Item>
            </Col>
          </FlexboxGrid>
        </Row>
      </Grid>
      {/* STEP 2 Edit Replicates in Trial END*/}

      {/* REGENERATE CONFIRMATION MODEL START */}
      <Modal
        show={showRegenerateWarning}
        onHide={() => setShowRegenerateWarning(false)}
      >
        <Modal.Header>
          <Modal.Title style={{ color: "#FF3A3A" }}>
            WARNING : Regenerate Table
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "#444444" }}>
          Are you sure to <UnderLinedText text={"regenerate table"} /> for{" "}
          <UnderLinedText text={`Trial ${trial.trialid}`} />. All the replicates
          inside the the Trial and the respective data associated with it might
          be <UnderLinedText text={"erased"} /> or{" "}
          <UnderLinedText text={"changed"} /> after you have saved this Trial.
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowRegenerateWarning(false)}
            appearance="subtle"
          >
            No
          </Button>
          <Button onClick={onReGenerateTable} appearance="primary">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* REGENERATE CONFIRMATION MODEL END */}
      {/* EDIT CONFIRMATION MODEL START */}
      <Modal show={show} onHide={hide}>
        <Modal.Header>
          <Modal.Title style={{ color: "#009D57" }}>Edit Trial</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "#444444" }}>
          Are you sure to edit{" "}
          <UnderLinedText text={`Trial ${trial.trialid}`} /> from the list? This
          might change data that is associate with it as well!
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hide} appearance="subtle">
            No
          </Button>
          <Button onClick={onSaveTrial} appearance="primary">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* EDIT CONFIRMATION MODEL END */}
    </div>
  )
}
export default EditTrial
