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
  Modal,
  ControlLabel
} from "rsuite"
import EstateService from "../../services/estate.service"

import SubDirectoryIcon from "../../assets/img/icons/subdirectory_arrow_right_24px.svg"

import TrialService from "../../services/trial.service"
import { publish } from "../../services/pubsub.service"
const styles = { width: 280, display: "block", marginBottom: 10 }
const { Column, HeaderCell, Cell } = Table

const AttachProgeny = ({
  currentSubNavState,
  currentItem,
  option,
  ...props
}) => {
  const [trialIds, setTrialIds] = useState([])
  const [estates, setEstates] = useState([])
  const [replicates, setReplicates] = useState([])
  useEffect(() => {
    setTrials()
  }, [])
  const trialData = useSelector(
    state => state.dashboardDataReducer.result.trial
  )
  function setTrials() {
    const selectorTrialIds = []
    trialData.forEach(trial => {
      selectorTrialIds.push({
        label: trial.trialid,
        value: trial.trialid
      })
    })
    setTrialIds(selectorTrialIds)
    const selectedTrial = trialData.find(
      trial => trial.trialid === option.trial
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
    const reps = await TrialService.getTrialReplicates(option.trial)
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
              value={option.trial}
              // onChange={(value, e) => setSelectedSoilType(value)}
              style={{ width: 180 }}
            />
          </Col>
          <Col sm={6} md={6} lg={3}>
            <ControlLabel>Estate</ControlLabel>
            <br />
            <SelectPicker
              data={estates}
              value={option.estate}
              // onChange={(value, e) => setSelectedSoilType(value)}
              style={{ width: 180 }}
            />
          </Col>
          <Col sm={6} md={6} lg={3}>
            <ControlLabel>Replicate</ControlLabel>
            <br />
            <SelectPicker
              data={replicates}
              value="All"
              // onChange={(value, e) => setSelectedSoilType(value)}
              style={{ width: 180 }}
            />
          </Col>
          <Col sm={5} md={4} lg={2}>
            <div className="show-col" style={{ padding: "25px 0px 0px 0px" }}>
              <Button
                className="btnApply"
                appearance="primary"
                //   onClick={onApply}
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

      {/* STEP 2 CUSTOMISE TABLE END*/}
    </div>
  )
}
export default AttachProgeny
