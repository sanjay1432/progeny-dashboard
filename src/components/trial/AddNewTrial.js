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
const AddNewTrial = ({ currentSubNavState, currentItem, option, ...props }) => {
  const dispatch = useDispatch()
  const [trial, setTrial] = useState(initializeTrailState)
  const [disabledGenerateTable, setDisabledGenerateTable, getValue] = useState(
    true
  )
  const [estates, setEstates] = useState([])
  const [estatesWithBlocks, setEstatesWithBlocks] = useState([])
  const [tableData, setTableData] = useState([])
  const [designs, setDesigns] = useState([])
  const [isMultplicationValid, setMultplicationValid] = useState(null)
  const [radioInputForTrialInEState, setRadioInputForTrialInEState] = useState(
    "yes"
  )
  const [radioInputForSameDensity, setRadioInputForSameDensity] = useState("no")
  const [inputListForTrialInEState, setInputListForTrialInEState] = useState([
    { estate: "", estatenofreplicate: "" }
  ])

  const [checkStatusReplicates, setCheckStatusReplicate] = useState([])
  const [estateblocks, setEstateblocks] = useState([])
  const [disbaledANR, setDisbaledANR] = useState(true)
  const [disbaledANRV, setDisbaledANRV] = useState(true)
  const [disbaledRD, setDisbaledRD] = useState(true)
  const [show, setShow] = useState(false)
  useEffect(() => {
    fetchEstates()
    fetchDesigns()
    handleDisableState()
  }, [isMultplicationValid, trial, radioInputForSameDensity, tableData])
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
    handleDisableState()
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
    const list = [...inputListForTrialInEState]
    list[index][name] = value
    setInputListForTrialInEState(list)
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
  function onRadioInputTrialInEState(e) {
    setRadioInputForTrialInEState(e)
  }
  function onRadioInputSameDensity(e) {
    if (radioInputForSameDensity === "no") {
      trial["density"] = ""
    }
    setRadioInputForSameDensity(e)
  }
  function onAddTrialInEstate() {
    setInputListForTrialInEState([
      ...inputListForTrialInEState,
      { estate: "", estatenofreplicate: "" }
    ])
  }
  function onRemoveTrialInEstate(index) {
    const list = [...inputListForTrialInEState]
    list.splice(index, 1)
    setInputListForTrialInEState(list)
  }
  function onSelectDesign(design) {
    setTrial(() => ({ ...trial, design }))
    handleDisableState()
  }

  function onSelectEstate(estate) {
    setTrial(() => ({ ...trial, estate }))
    handleDisableState()
  }
  async function handleDisableState() {
    console.log(trial)
    console.log({ radioInputForSameDensity })
    if (radioInputForSameDensity === "no") {
      delete trial["density"]
    }
    const isEmpty = checkProperties(trial)
    console.log({ isEmpty })
    if (isEmpty || !isMultplicationValid) {
      setDisabledGenerateTable(true)
    } else {
      setDisabledGenerateTable(false)
    }
  }
  function onGenerateTable() {
    console.log(trial)
    console.log(inputListForTrialInEState)
    console.log(radioInputForTrialInEState)
    setTableData([])

    if (radioInputForTrialInEState === "yes") {
      const noOfReplicates = parseInt(trial.nofreplicate)
      for (let replicate = 0; replicate < noOfReplicates; replicate++) {
        const item = {
          estate: trial.estate,
          replicate: replicate + 1,
          estateblock: "",
          density: trial.density,
          design: trial.design,
          soiltype: ""
        }
        console.log(item)
        setTableData(oldtableData => [...oldtableData, item])
      }
    } else {
      console.log(inputListForTrialInEState)
      for (let i = 0; i < inputListForTrialInEState.length; i++) {
        const noOfReps = parseInt(
          inputListForTrialInEState[i].estatenofreplicate
        )
        console.log({ noOfReps })
        for (let replicate = 0; replicate < noOfReps; replicate++) {
          const item = {
            estate: inputListForTrialInEState[i].estate,
            replicate: replicate + 1,
            estateblock: "",
            density: trial.density,
            design: trial.design,
            soiltype: ""
          }
          console.log(item)
          setTableData(oldtableData => [...oldtableData, item])
        }
      }
    }
    setDisbaledANR(false)
  }
  function checkProperties(obj) {
    for (var key in obj) {
      if (obj[key] === null || obj[key] === "") return true
    }
    return false
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
    const keys = checked ? tableData.map((item, i) => i) : []
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

      const soilType = estateBlocks.find(eb => eb.estateblock === block)
        .soiltype
      const data = [...tableData]
      data[rowIndex].estateblock = block
      data[rowIndex].soiltype = soilType
      setTableData(data)
    } else {
      const data = [...tableData]
      data[rowIndex].estateblock = block
      setTableData(data)
    }
  }
  function onAddingNewReplicate() {
    const data = [...tableData]
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
    setTableData(data)
  }
  function onAddingNewReplicateVarient() {
    console.log(checkStatusReplicates)
    const data = [...tableData]
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
      setTableData(data)
      console.log(existingRep)
    }
  }

  function deleteReplicate() {
    const data = [...tableData]
    for (let index in checkStatusReplicates) {
      data.splice(checkStatusReplicates[index], 1)
      checkStatusReplicates.splice(index, 1)
    }
    setTableData(data)
  }

  function onSaveTrial() {
    trial["replicates"] = tableData
    console.log(trial)
    TrialService.saveTrial(trial).then(
      data => {
        const savedData = {
          type: "TRIAL",
          data: trial,
          action: "CREATED"
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
  return (
    <div id="addNewTrial">
      {/* STEP 1 GENERATE TABLE START*/}
      <div>
        <h4>
          <span style={{ color: "#009D57" }}>Step 1:</span>{" "}
          <span style={{ color: "#353131f2" }}>Generate Table</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>Trail ID</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Trial ID"
              className="formField"
              name="trialid"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>
        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>Trail</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Trial "
              className="formField"
              name="trial"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>
        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>Trial Remarks</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              componentClass="textarea"
              rows={3}
              placeholder="Key In Trial Remarks"
              className="formField trialRemark"
              name="trialremark"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>Area (ha)</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Area"
              className="formField"
              name="area"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
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

        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>No. of Progeny</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in No.of Progeny"
              className="formField"
              name="nofprogeny"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>
              No. of Subblock and No.of Plot/Subblock
            </p>
          </Col>
          <Col md={5} lg={5}>
            <Input
              placeholder="No. of Subblock"
              className="formField noOfSubBlock"
              name="nofsubblock"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          <Col md={5} lg={5}>
            <Input
              placeholder="No. of Plot/Subblock "
              className="formField noOfPlot"
              name="nofplot_subblock"
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

        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>
              This Trial will be in the same Estate?
            </p>
          </Col>
          <Col md={5} lg={5}>
            {" "}
            <RadioGroup
              name="radioList"
              value={radioInputForTrialInEState}
              onChange={value => {
                onRadioInputTrialInEState(value)
              }}
              inline
              style={{ color: "#353131f2" }}
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </RadioGroup>
          </Col>
          {radioInputForTrialInEState === "yes" ? (
            <Col xs={3}>
              <SelectPicker
                data={estates}
                style={{ width: 224 }}
                placeholder="Select Estate"
                onSelect={estate => onSelectEstate(estate)}
              />{" "}
            </Col>
          ) : (
            ""
          )}
        </Row>
        {radioInputForTrialInEState === "no" ? (
          <Row className="show-grid newTrialFormLayout">
            {inputListForTrialInEState.map((input, i) => (
              <>
                <div key={i}>
                  <Col xs={12} style={{ width: "100%" }}>
                    <Col xs={8}>
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
                        name="estatenofreplicate"
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
          ""
        )}
        {radioInputForTrialInEState === "yes" ? (
          <Row className="show-grid newTrialFormLayout">
            <Col md={8} lg={6}>
              <p style={{ color: "#353131f2" }}>No. of Replicates</p>
            </Col>
            <Col md={6} lg={6}>
              <Input
                placeholder="Enter Number of Replicate for this Trial"
                className="formField"
                name="nofreplicate"
                onChange={(value, e) => onInput(e)}
              />
            </Col>
          </Row>
        ) : (
          ""
        )}

        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>
              Do all replicates have the same density?
            </p>
          </Col>
          <Col md={5} lg={5}>
            {" "}
            <RadioGroup
              name="radioList"
              value={radioInputForSameDensity}
              onChange={value => {
                onRadioInputSameDensity(value)
              }}
              inline
              style={{ color: "#353131f2" }}
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </RadioGroup>
          </Col>
          {radioInputForSameDensity === "yes" ? (
            <Col xs={3}>
              <Input
                placeholder="Enter Density"
                name="density"
                className="formField"
                onChange={(value, e) => onInput(e)}
              />
            </Col>
          ) : (
            ""
          )}
        </Row>

        <Row className="show-grid newTrialFormLayout">
          <Col md={8} lg={6}>
            <p style={{ color: "#353131f2" }}>
              What is the design for the replicates ?
            </p>
          </Col>
          <Col xs={6}>
            <SelectPicker
              id="design"
              data={designs}
              onSelect={design => onSelectDesign(design)}
              placeholder="Choose Design"
              block
            />{" "}
          </Col>
        </Row>
      </Grid>

      <div style={{ float: "right" }}>
        <Button
          appearance="primary"
          className="btnAddTrial"
          onClick={onGenerateTable}
          disabled={disabledGenerateTable}
        >
          <Icon icon="table" /> Generate Table
        </Button>
      </div>
      {/* STEP 1 GENERATE TABLE END */}
      <hr
        style={{ marginTop: "4rem", borderTop: "2px solid rgb(0 0 0 / 28%)" }}
      />

      {/* STEP 2 CUSTOMISE TABLE START*/}
      <div style={{ padding: "1rem" }}>
        <h4>
          <span style={{ color: "#009D57" }}>Step 2:</span>{" "}
          <span style={{ color: "#353131f2" }}>Customise Table</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid newTrialFormLayout">
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

      <Table wordWrap data={tableData} autoHeight>
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
                    <img src={SubDirectoryIcon} style={{ margin: "0 50%" }} />
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
            {rowData => {
              return <Input value={rowData.density} />
            }}
          </Cell>
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Design</HeaderCell>
          <Cell>
            {rowData => {
              return <Input value={rowData.design} disabled />
            }}
          </Cell>
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Soil Type</HeaderCell>
          <Cell>
            {rowData => {
              return <Input value={rowData.soiltype} disabled placeholder="-" />
            }}
          </Cell>
        </Column>
      </Table>

      <Grid fluid>
        <Row className="show-grid newTrialFormLayout" id="tableOption">
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
      {/* STEP 2 CUSTOMISE TABLE END*/}

      {/* CONFIRMATION MODEL START */}
      <Modal show={show} onHide={hide}>
        <Modal.Header>
          <Modal.Title style={{ color: "#009D57" }}>Saving Trial</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "#444444" }}>
          Are you sure you want to save this{" "}
          <span
            style={{
              fontWeight: "bold",
              textDecorationLine: "underline",
              fontSize: "16px"
            }}
          >
            Trial {trial.trialid}
          </span>{" "}
          ? This Trial and it’s replicate will be created inside the system.
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
      {/* CONFIRMATION MODEL END */}
    </div>
  )
}
export default AddNewTrial
