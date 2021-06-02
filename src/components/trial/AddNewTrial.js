import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Table,
  FlexboxGrid,
  Container,
  Button,
  Icon,
  IconButton,
  InputPicker,
  Grid,
  Row,
  Col,
  Checkbox,
  CheckboxGroup,
  Pagination,
  Modal,
  Message,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  ButtonToolbar,
  Input,
  DatePicker,
  Radio,
  RadioGroup,
  SelectPicker
} from "rsuite"
import "./AddNewTrial.css"
const styles = { width: 280, display: "block", marginBottom: 10 }
const data = [
  {
    label: "Eugenia",
    value: "Eugenia",
    role: "Master"
  },
  {
    label: "Kariane",
    value: "Kariane",
    role: "Master"
  },
  {
    label: "Louisa",
    value: "Louisa",
    role: "Master"
  },
  {
    label: "Marty",
    value: "Marty",
    role: "Master"
  },
  {
    label: "Kenya",
    value: "Kenya",
    role: "Master"
  },
  {
    label: "Hal",
    value: "Hal",
    role: "Developer"
  },
  {
    label: "Julius",
    value: "Julius",
    role: "Developer"
  },
  {
    label: "Travon",
    value: "Travon",
    role: "Developer"
  },
  {
    label: "Vincenza",
    value: "Vincenza",
    role: "Developer"
  },
  {
    label: "Dominic",
    value: "Dominic",
    role: "Developer"
  },
  {
    label: "Pearlie",
    value: "Pearlie",
    role: "Guest"
  },
  {
    label: "Tyrel",
    value: "Tyrel",
    role: "Guest"
  },
  {
    label: "Jaylen",
    value: "Jaylen",
    role: "Guest"
  },
  {
    label: "Rogelio",
    value: "Rogelio",
    role: "Guest"
  }
]
const initializeTrailState = {
  trialid: "",
  trial: "",
  trialremark: "",
  area: "",
  planteddate: "",
  nofprogeny: "",
  nofreplicate: "",
  nofplot_subblock: "",
  nofsubblock: ""
}
const AddNewTrial = ({ currentSubNavState, currentItem, option, ...props }) => {
  const [trial, setTrial] = useState(initializeTrailState)

  function onInput(e) {
    e.persist()
    setTrial(() => ({ ...trial, [e.target.name]: e.target.value }))
  }

  function onGenerateTable() {
    console.log(trial)
  }
  return (
    <>
      {/* STEP 1 GENERATE TABLE */}
      <div style={{ padding: "1rem" }}>
        <h4>
          <span style={{ color: "#009D57" }}>Step 1:</span>{" "}
          <span style={{ color: "#353131f2" }}>Generate Table</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>Trail ID</p>
          </Col>
          <Col xs={6}>
            <Input
              placeholder="Key in Trial ID"
              className="formField"
              name="trialid"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>Trail</p>
          </Col>
          <Col xs={6}>
            <Input
              placeholder="Key in Trial "
              className="formField"
              name="trial"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>Trial Remarks</p>
          </Col>
          <Col xs={6}>
            <Input
              componentClass="textarea"
              rows={3}
              placeholder="Key In Trial Remarks"
              className="formField"
              name="trialremark"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>Area (ha)</p>
          </Col>
          <Col xs={6}>
            <Input
              placeholder="Key in Area"
              className="formField"
              name="area"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>Planted Date</p>
          </Col>
          <Col xs={6}>
            {" "}
            <DatePicker
              size="lg"
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
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>No. of Progeny</p>
          </Col>
          <Col xs={6}>
            <Input
              placeholder="Key in No.of Progeny"
              className="formField"
              name="nofprogeny"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>
              No. of Subblock and No.of Plot/Subblock
            </p>
          </Col>
          <Col xs={3}>
            <Input
              placeholder="No. of Subblock"
              className="formField"
              name="nofsubblock"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          <Col xs={3}>
            <Input
              placeholder="No. of Plot/Subblock "
              className="formField"
              name="nofplot_subblock"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>
              This Trial will be in the same Estate?
            </p>
          </Col>
          <Col xs={3}>
            {" "}
            <RadioGroup name="radioList" inline style={{ color: "#353131f2" }}>
              <Radio value="A">Yes</Radio>
              <Radio value="B">No</Radio>
            </RadioGroup>
          </Col>
          <Col xs={3}>
            <SelectPicker
              data={data}
              style={{ width: 224 }}
              placeholder="Select Estate"
            />{" "}
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>No. of Replicates</p>
          </Col>
          <Col xs={6}>
            <Input
              placeholder="Enter Number of Replicate for this Trial"
              className="formField"
              name="nofreplicate"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>
              Do all replicates have the same density?
            </p>
          </Col>
          <Col xs={3}>
            {" "}
            <RadioGroup name="radioList" inline style={{ color: "#353131f2" }}>
              <Radio value="A">Yes</Radio>
              <Radio value="B">No</Radio>
            </RadioGroup>
          </Col>
          <Col xs={3}>
            <Input className="formField" />
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={6}>
            <p style={{ color: "#353131f2" }}>
              What is the design for the replicates ?
            </p>
          </Col>
          <Col xs={6}>
            <SelectPicker data={data} placeholder="Choose Design" />{" "}
          </Col>
        </Row>
      </Grid>

      <div style={{ float: "right" }}>
        <Button
          appearance="primary"
          className="btnAddTrial"
          onClick={onGenerateTable}
        >
          <Icon icon="table" /> Generate Table
        </Button>
      </div>
    </>
  )
}
export default AddNewTrial