import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"

import { getDashboardData } from "../../redux/actions/dashboarddata.action"
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
  Modal,
  InputNumber
} from "rsuite"
import EstateService from "../../services/estate.service"

import SubDirectoryIcon from "../../assets/img/icons/subdirectory_arrow_right_24px.svg"
import CreateIcon from "../../assets/img/icons/create_24px.svg"
import TrialService from "../../services/trial.service"
import { publish } from "../../services/pubsub.service"

import SuccessModal from "../modal/masterData/success/success"
const styles = { width: 280, display: "block", marginBottom: 10 }
const { Column, HeaderCell, Cell } = Table
const initializeTrailState = {
  trialCode: "",
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


function findEstateBlocks(ebs, estate) {
  let estateBlocks = ebs.find(row => row.estate === estate)?.estateblocks
  const mappedEstateBlocks = []
  if(estateBlocks) {
    const assignedEstateBlocks = []
    estateBlocks.forEach(eb => {
      if(eb.assigned){
       assignedEstateBlocks.push(eb)
      }
    });
    for (let item in assignedEstateBlocks) {
      mappedEstateBlocks.push({
        label: assignedEstateBlocks[item].estateblock,
        value: assignedEstateBlocks[item].estateblock
      })
    }
  }
 
  return mappedEstateBlocks
}

export const EditCell = ({ rowData, dataKey, onChange, estatesWithBlocks, ...props }) => {
  const editing = rowData.status === "EDIT"
  const blocks = findEstateBlocks(estatesWithBlocks, rowData.estate)
  return (
    <Cell {...props} className={editing ? "table-content-editing" : ""}>
      {editing && dataKey !== "estateblock" ? (
        <input
          className="rs-input"
          type = {dataKey === "density"?"number":"text"}
          defaultValue={rowData[dataKey]}
          disabled={["estate", "replicate", "design", "soiltype"].includes(
            dataKey
          )}
          onChange={event => {
            onChange &&
              onChange(rowData.replicate,rowData.estate, dataKey, event.target.value)
          }}
        />
      ) : editing && dataKey === "estateblock" ? (
        <SelectPicker
          data={blocks}
          style={{ width: 224 }}
          placeholder="-"
          value={rowData.estateblock}
          onChange={value => {
            onChange && onChange(rowData.replicate,rowData.estate, dataKey, value)
          }}
        />
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Cell>
  )
}


const EditTrial = ({ currentSubNavState, currentItem, option, ...props }) => {
  const dispatch = useDispatch()
  const [trial, setTrial] = useState(initializeTrailState)
  const [trialTypes, setTrialTypes] = useState([])
  const [status, setStatus] = useState("")
  const [disabled, setDisabled] = useState("no")
  const [regenerateTable, setRegenerateTable] = useState(false)
  const [replicatesInEstate, setReplicatesInEstate] = useState([])
  const [ebList, setEbList] = useState([]);
  const [isSuccessModal, setSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState(null)
  const [regenerateEnabled, setRegenerateEnabled] = useState(false)

  const [existingReplicatesInEstate, setExistingReplicatesInEstate] = useState(
    []
  )
  const trialData = useSelector(state => state.dashboardDataReducer.result.trial)

  useEffect( () => {
    EstateService.getDesigns().then(response => {
      console.log({response})
      const designsData =  response.data;
      const data =  trialData.find((t)=> t.trialId === option.trial)
      const designObj = designsData.find((t)=> t.design === data.design)
      data.designId =  designObj.designId
      setTrial(data) 
      setStatus(data.status)

      let replicates = data.replicates
      const newSetOfReps = []
      replicates.forEach((reps, idx) => {
        const blocks = reps.estateblocks
        if (blocks && blocks.length < 2) {
          reps.estateblock = blocks[0].name
          reps.design = data.design
          reps.designId = designObj.designId
          reps.density = blocks[0].density
          reps.soiltype = blocks[0].soiltype
          newSetOfReps.push(reps)
        }
        if (blocks && blocks.length > 1) {
          const uni = reps
          delete uni.estateblock
          for (let i = 0; i < blocks.length; i++) {
            reps = {}
            reps["estateblock"] = blocks[i].name
            reps.density = blocks[i].density
            reps.soiltype = blocks[i].soiltype
            reps.design = data.design
            reps.designId = designObj.designId
            Object.keys(uni).forEach(key => (reps[key] = uni[key]));
            newSetOfReps.push(reps)
          }
        }
      })
      setExistingReplicatesInEstate(newSetOfReps)
      //Can be multiple estate in trial
      const estateReps = []
      data.estate.forEach(est => {
        estateReps.push({
          estate: est.name,
          replicate: est.replicate
        })
      })

      setReplicatesInEstate(estateReps)
    })
    

  }, [])

  const [estates, setEstates] = useState([])
  const [estatesWithBlocks, setEstatesWithBlocks] = useState([])
  const [designs, setDesigns] = useState([])
  const [isMultplicationValid, setMultplicationValid] = useState(null)

  const [checkStatusReplicates, setCheckStatusReplicate] = useState([])
  // const [estateblocks, setEstateblocks] = useState([])
  const [disbaledANR, setDisbaledANR] = useState(true)
  const [disbaledANRV, setDisbaledANRV] = useState(true)
  const [disbaledRD, setDisbaledRD] = useState(true)
  const [show, setShow] = useState(false)
  const [activeRow, setActiveRow] = useState(null)
  const [showRegenerateWarning, setShowRegenerateWarning] = useState(false)

  const dashboardData = useSelector((state) => state.dashboardDataReducer);

  useEffect(() => {
    fetchTypes()
    fetchEstates()
    fetchDesigns()
  }, [isMultplicationValid, trial])

  async function fetchEstates() {
    const mappedEstates =  dashboardData.result['estate']
    setEstatesWithBlocks(mappedEstates)
    const mappedEstate = []

    for (let item in mappedEstates) {
      mappedEstate.push({ label: mappedEstates[item].estate, value: mappedEstates[item].estate })
    }
    setEstates(mappedEstate)
  }
  async function fetchTypes() {
    const types = await TrialService.getTrialTypes()
    const { data } = await EstateService.getUpdatedEstateBlocks()
    setEbList(data)
    const mappedTypes = []

    for (let item in types) {
      mappedTypes.push({ label: types[item], value: types[item] })
    }
    setTrialTypes(mappedTypes)
  }  
  async function fetchDesigns() {
    const { data } = await EstateService.getDesigns()
    const mappedDesigns = []

    for (let item in data) {
      mappedDesigns.push({ label: data[item].design, value: data[item].designId })
    }
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
    const val =  e.target.value % 1 > 0 && ["nofprogeny", "nofsubblock", "nofplot_subblock"].includes(e.target.name) ? parseInt(e.target.value): e.target.value
    setTrial(() => ({ ...trial, [e.target.name]: val }));
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
      value = e.target.value?parseInt(e.target.value): 1;

      //UPDATE THE number of Replicare in Trial
      const currentnoOfRep =
        trial.nofreplicate !== "" ? parseInt(trial.nofreplicate) : 0
      const updatednoOfRep = currentnoOfRep + parseInt(e.target.value)
      setTrial(() => ({ ...trial, nofreplicate: updatednoOfRep.toString() }))
    }
    const list = [...replicatesInEstate]
    list[index][name] = value
    setReplicatesInEstate(list)
    setRegenerateEnabled(true)
    handleDisableState()
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
  function onSelectDesign(designId) {
    const designLabel =  designs.find((design)=> design.value ===  designId)
    setTrial(() => ({ ...trial, design: designLabel.label, designId }))
  }

  function onSelectType(type){
    setTrial(() => ({ ...trial, type }))
  }
  function onReGenerateTable() {
    const trialData = { ...trial }
    setExistingReplicatesInEstate([])
    for (let i = 0; i < replicatesInEstate.length; i++) {
      const noOfReps = parseInt(replicatesInEstate[i].replicate)
      for (let replicate = 0; replicate < noOfReps; replicate++) {
        const item = {
          estate: replicatesInEstate[i].estate,
          replicate: replicate + 1,
          estateblock: "",
          density: trialData.density,
          design: trialData.design,
          designId: trialData.designId,
          soiltype: ""
        }
        setExistingReplicatesInEstate(oldtableData => [...oldtableData, item])
      }
    }

    trialData["replicates"] = existingReplicatesInEstate

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
    let estateBlocks = ebList.find((row) => row.estate === estate);
    const assignedEstateBlocks = []
    if (estateBlocks) {
      estateBlocks = estateBlocks.estateblocks;
      estateBlocks.forEach(eb => {
       if(eb.assigned){
        assignedEstateBlocks.push(eb)
       }
     });
      // setEstateblocks(estateBlocks)
    }
    const mappedEstateBlocks = [];
    for (let item in assignedEstateBlocks) {
      mappedEstateBlocks.push({
        label: assignedEstateBlocks[item].estateblock,
        value: assignedEstateBlocks[item].estateblock,
      });
    }
    return mappedEstateBlocks;
  }

  async function handleEstateBlockChange(block, replicate, rowIndex) {
    if (block) {
      const foundedBlock = await findEstateBlock(block)
      const data = [...existingReplicatesInEstate]
      data[rowIndex].estateblock = block
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
      trial.nofreplicate !== "" ? parseInt(trial.nofreplicate) : 0
    const updatednoOfRep = currentnoOfRep + 1
    setTrial(() => ({ ...trial, nofreplicate: updatednoOfRep.toString() }))
    setExistingReplicatesInEstate(data)
  }
  function onAddingNewReplicateVarient() {
    const data = [...existingReplicatesInEstate]
    for (let index in checkStatusReplicates) {
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
    trial.status = status
    if (disabled === "yes") {
      TrialService.saveTrial(trial).then(
        data => {
          const savedData = {
            type: "TRIAL",
            data: trial,
            action: "CREATED"
          }
          dispatch(getDashboardData('trial'))
          setSuccessModal(true)
          setSuccessData(savedData)
        },
        err => console.log(err)
      )
    } else {
      TrialService.editTrial(trial).then(
        data => {
          const savedData = {
            type: "TRIAL",
            data: trial,
            action: "UPDATED"
          }
          dispatch(getDashboardData('trial'))
          setSuccessModal(true)
          setSuccessData(savedData)
        },
        err => console.log(err)
      )
    }
  }

  function hide() {
    setShow(false)
  }


  const ActionCell = ({ rowData, rowIndex, dataKey, onClick, ...props }) => {
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
                onClick && onClick(rowData.replicate, rowData.estate)
              }}
            />
            &nbsp;
            <IconButton
              icon={<Icon icon="close" />}
              circle
              color="red"
              size="xs"
              onClick={() => {
                // onClick && onClick(rowData.replicate)
                onCancel(rowIndex)
              }}
            />
          </>
        ) : (
          <img
            src={CreateIcon}
            alt=""
            onClick={() => {
              onClick && onClick(rowData.replicate, rowData.estate)
            }}
          />
        )}
        {/* </Button> */}
      </Cell>
    )
  }

  function onCancel(idx){
    const nextData = Object.assign([], existingReplicatesInEstate)
    nextData[idx] = activeRow
    setExistingReplicatesInEstate(nextData)
 }

  const handleChange = async (replicate,estate, key, value) => {
    const nextData = Object.assign([], existingReplicatesInEstate)
    if(key === "estateblock"){
       const foundedBlock = await findEstateBlock(value)
       console.log({foundedBlock})
       const trialReplicate  = nextData.find(item => item.replicate === replicate)
       trialReplicate.estateblocks[0].id = foundedBlock.id
       trialReplicate.estateblocks[0].name = foundedBlock.estateblock
       nextData.find(item => item.replicate === replicate)['soiltype'] = foundedBlock.soiltype
      //  nextData.find(item => item.replicate === replicate)['blockId'] = foundedBlock.id
    }
    nextData.find(item => item.replicate === replicate && item.estate === estate)[key] = value
    setExistingReplicatesInEstate(nextData)
  }


  const findEstateBlock = async (value)=>{
    const estateBlocksItems = []
    const { data } = await EstateService.getUpdatedEstateBlocks()
    data.forEach(estate => {
      estateBlocksItems.push(...estate.estateblocks)
    })
    // const estateBlocks = [
    //   ...new Set(
    //     estateBlocksItems
    //       .map(item => item.estateblock)
    //       // .map(block =>
    //       //   estateBlocksItems.find(eb => eb.estateblock === block)
    //       // )
    //   )
    // ]

    const foundedBlock = estateBlocksItems.find(eb => eb.estateblock === value)
    return foundedBlock
  }
  const handleEditState = (replicate, estate) => {
    const nextData = Object.assign([], existingReplicatesInEstate)
    nextData.map((row)=>(row.replicate === replicate && row.estate === estate)?row.status = row.status : row.status = null)
    const activeItem = nextData.find(item => item.replicate === replicate && item.estate === estate)
    setActiveRow({...activeItem})
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

  function CloseSuccessModal() {
    setSuccessModal(false)
    dispatch(clearBreadcrumb())
  }

  function getMultipleEstateString(estates) {
    let estateString = ""
    if (estates) {
      estates.forEach((element, idx) => {
        const pipe = estates.length - idx > 1 ? "|" : ""
        estateString += ` ${element.name} ${pipe}`
      })
    }

    return estateString
  }

   function handleDisableState() {
    const isEmpty = checkProperties(trial);
    let isEmptyreplicatesInEstate =  false
    replicatesInEstate.forEach(rpEs => {
      isEmptyreplicatesInEstate = checkProperties(rpEs);
    });
    // if (isEmpty || !isMultplicationValid || disabled === "no" ||isEmptyreplicatesInEstate) {
    //   return true
    // } else {
    //   return false
    // }
    return (isEmpty || !isMultplicationValid || disabled === "no" )?true:false
  }
  function checkProperties(obj) {
    for (var key in obj) {
      if (obj[key] === null || obj[key] === "") return true;
    }
    return false;
  }
  return (
    <div id="TrialAction">
      {/* STEP 1 Edit Trial START*/}
      <div>
        <h4 className="title">
          <span className="desc">Step 1:</span>{" "}
          <span className="purpose">Edit Trial</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Trial ID</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Trial ID"
              className="formField"
              name="trialCode"
              value={trial.trialCode}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>
        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Type</p>
          </Col>
          <Col md={10} lg={10}>
            <SelectPicker
              id="type"
              className="designPicker"
              data={trialTypes}
              value={trial.type}
              onSelect={type => onSelectType(type)}
              placeholder="Select Type"
              block
            />{" "}
          </Col>
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Trial</p>
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
        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Trial Remarks</p>
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

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Area (ha)</p>
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

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Planted Date</p>
          </Col>
          <Col md={5} lg={5}>
            {" "}
            <DatePicker
              size="lg"
              className="datePicker"
              placeholder="Enter Date"
              value={trial.planteddate}
              format="MM/YYYY"
              style={styles}
              name="planteddate"
              onSelect={date =>
                setTrial(() => ({ ...trial, planteddate: date }))
              }
            />
          </Col>
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Status</p>
          </Col>
          <Col md={5} lg={5}>
            <RadioGroup
              name="radioList"
              className="statusSelection"
              value={status}
              onChange={value => {
                setStatus(value)
              }}
              inline
              style={{ color: "#353131f2" }}
            >
              {/* <Radio value="active">Active</Radio> */}
              <Radio value="Canceled">Canceled</Radio>
              <Radio value="Closed">Closed</Radio>
            </RadioGroup>
          </Col>
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">
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
        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">No. of Progeny</p>
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

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">No. of Subblock and No.of Plot/Subblock</p>
          </Col>
          <Col md={5} lg={5}>
            <Input
              placeholder="No. of Subblock"
              className="subPlotInput"
              name="nofsubblock"
              value={trial.nofsubblock}
              disabled={disabled === "no"}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          <Col md={5} lg={5}>
            <Input
              placeholder="No. of Plot/Subblock "
              className="plotInput"
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
          <Row className="show-grid TrialFormLayout">
            {replicatesInEstate.map((input, i) => (
              <>
                <div key={i}>
                  <Col xs={12} style={{ width: "100%" }}>
                    <Col md={9} lg={8}>
                      {i < 1 ? (
                        <p className="labelForm">
                          No. of Replicates in Each Estate
                        </p>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col md={5} lg={5} style={{ "margin-bottom": "12px" }}>
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
                    <Col md={5} lg={5}>
                      <InputNumber
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
          <Row className="show-grid TrialFormLayout">
            <Col md={9} lg={8}>
              <p className="labelForm">Estate</p>
            </Col>
            <Col md={10} lg={10}>
              <Input
                className="formField"
                name="nofprogeny"
                value={getMultipleEstateString(trial.estate)}
                disabled={disabled === "no"}
              />
            </Col>
          </Row>
        )}

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">What is the design for the replicates ?</p>
          </Col>
          <Col md={10} lg={10}>
            <SelectPicker
              id="design"
              className="designPicker"
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

      <div className="buttonLayout">
        <Button
          appearance="primary"
          className="generateTableButton"
          onClick={() => setShowRegenerateWarning(true)}
          disabled={handleDisableState()}
        >
          <Icon icon="table" /> Regenerate Table
        </Button>
      </div>
      {/* STEP 1 Edit Trial END */}
      <hr className="lineBetweenStep" />

      {/* STEP 2 Edit Replicates in Trial START*/}
      <div>
        <h4 className="title">
          <span className="desc">Step 2:</span>{" "}
          <span className="purpose">Edit Replicates in Trial</span>
        </h4>
      </div>
      {regenerateTable ? (
        <>
          {/* TABLE WITH REGENERATED DATA  START*/}
          <Grid fluid>
            <Row className="show-grid TrialFormLayout">
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

          <Table
            wordWrap
            data={existingReplicatesInEstate}
            virtualized
            rowHeight={55}
            autoHeight
          >
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
                          alt=""
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

          <Table
            wordWrap
            data={existingReplicatesInEstate}
            virtualized
            rowHeight={55}
            autoHeight
          >
            <Column width={200}>
              <HeaderCell>Estate</HeaderCell>
              <EditCell dataKey="estate" onChange={handleChange} estatesWithBlocks = {ebList}/>
            </Column>

            <Column width={200}>
              <HeaderCell>Replicate</HeaderCell>
              <EditCell dataKey="replicate" onChange={handleChange} estatesWithBlocks = {ebList}/>
            </Column>

            <Column width={250}>
              <HeaderCell>Estate Block</HeaderCell>
              <EditCell dataKey="estateblock" onChange={handleChange} estatesWithBlocks = {ebList}/>
            </Column>

            <Column width={250}>
              <HeaderCell>Density</HeaderCell>
              <EditCell dataKey="density" onChange={handleChange} estatesWithBlocks = {ebList}/>
            </Column>

            <Column width={250}>
              <HeaderCell>Design</HeaderCell>
              <EditCell dataKey="design" onChange={handleChange} estatesWithBlocks = {ebList}/>
            </Column>
            <Column width={250}>
              <HeaderCell>Soil Type</HeaderCell>
              <EditCell dataKey="soiltype" onChange={handleChange} estatesWithBlocks = {ebList}/>
            </Column>
            <Column width={130}>
              <HeaderCell>Action</HeaderCell>
              <ActionCell dataKey="replicate" onClick={handleEditState} />
            </Column>
          </Table>

          {/* TABLE WITH NO REGENERATED DATA  END*/}
        </>
      )}

      <Grid fluid className="footerLayout">
        <Row className="show-grid TrialFormLayout">
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
          <UnderLinedText text={`Trial ${trial.trialCode}`} />. All the
          replicates inside the the Trial and the respective data associated
          with it might be <UnderLinedText text={"erased"} /> or{" "}
          <UnderLinedText text={"changed"} /> after you have saved this Trial.
        </Modal.Body>
        <Modal.Footer className="footerLayout">
          <Button
            className="yesButton"
            onClick={() => setShowRegenerateWarning(false)}
            appearance="subtle"
          >
            No
          </Button>
          <Button
            className="noButton"
            onClick={onReGenerateTable}
            appearance="primary"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* REGENERATE CONFIRMATION MODEL END */}
      {/* EDIT CONFIRMATION MODEL START */}
      <Modal id="SaveTrialModal" show={show} onHide={hide}>
        <Modal.Header>
          <Modal.Title className="title">Edit Trial</Modal.Title>
        </Modal.Header>
        <Modal.Body className="body">
          Are you sure to edit{" "}
          <UnderLinedText text={`Trial ${trial.trialCode}`} /> from the list?
          This might change data that is associate with it as well!
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hide} className="yesButton" appearance="subtle">
            No
          </Button>
          <Button
            onClick={onSaveTrial}
            className="noButton"
            appearance="primary"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* EDIT CONFIRMATION MODEL END */}


      <SuccessModal
                show={isSuccessModal}
                hide={CloseSuccessModal}
                data={successData}
              />
    </div>
  )
}
export default EditTrial
