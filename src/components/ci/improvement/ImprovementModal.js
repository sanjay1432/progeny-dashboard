import React, { useEffect, useState } from "react"
import { setProcessLines } from "../../../redux/actions/dashboard.action"
import GeneralService from "../../../services/general.service"
import CIService from "../../../services/ci.service"
import { useSelector, useDispatch } from "react-redux"
import {
  Input,
  TagPicker,
  SelectPicker,
  DatePicker,
  Button,
  Modal,
  Alert
} from "rsuite"
import axios from "axios"
import { CANCEL_REQUEST } from "../../../constants"

const ImprovementModal = ({ show, selectedData, onToggle }) => {
  const processLines = useSelector(state => state.dashboardReducer.processLines)
  const [kpis, setKpis] = useState(null)
  const [projectTypes, setProjectTypes] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedKPIs, setSelectedKPIs] = useState([])
  const [selectedProjectType, setSelectedProjectType] = useState([])
  const [selectedProcessLines, setSelectedProcessLines] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async source => {
      setIsLoading(true)
      const param = {}
      await GeneralService.getAllProcessLines(param, source).then(
        data => {
          dispatch(setProcessLines(data))
          setIsLoading(false)
        },
        error => {
          Alert.error("We got an unknown error.", 5000)
          console.log(error)
          return Promise.reject()
        }
      )
      await GeneralService.getKpis(param, source).then(
        data => {
          setKpis(data)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
      await CIService.getProjectTypes(param, source).then(
        data => {
          setProjectTypes(data)
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
    setStartDate(selectedData ? selectedData.dateRange.startDate : null)
    setEndDate(selectedData ? selectedData.dateRange.endDate : null)
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
  }, [selectedData])

  const applyToggle = () => {
    if (onToggle) {
      onToggle(false)
    }
  }

  return (
    <Modal full overflow={true} show={show} backdrop="static">
      <Modal.Header>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="__new-row">
          <h2 className="__new-col">Project Initiative</h2>
        </div>
        <div className="__new-row">
          <Input
            maxLength={255}
            maxLength={250}
            type="text"
            name="select"
            id="txtProject"
            value={selectedData ? selectedData.projectInitiative : ""}
          />
        </div>

        <div className="__new-row">
          <h2 className="__new-col">Project Type</h2>
        </div>
        <div className="__new-row">
          <SelectPicker
            onChange={selected => setSelectedProjectType(selected)}
            placeholder="Select Project Type"
            className="mr-3"
            data={projectTypes}
            labelKey="projectTypeName"
            valueKey="projectTypeId"
            style={{ maxWidth: 400, minWidth: 150 }}
          />
        </div>

        <div className="__new-row justify-content-between align-items-center flex-wrap">
          <h2 className="__new-col">Start Date</h2>
          <h2 className="__new-col">End Date</h2>
        </div>

        <div className="__new-row justify-content-between align-items-center flex-wrap">
          <h2 className="__new-col">
            <DatePicker
              className="mr-3"
              appearance="default"
              cleanable={false}
              value={startDate}
              onChange={selected => setStartDate(selected)}
            />
          </h2>
          <h2 className="__new-col">
            <DatePicker
              className="mr-3"
              appearance="default"
              cleanable={false}
              value={endDate}
              onChange={selected => setEndDate(selected)}
            />
          </h2>
        </div>

        <div className="__new-row">
          <h2 className="__new-col">Project Leader</h2>
        </div>
        <div className="__new-row">
          <Input
            maxLength={255}
            type="text"
            name="select"
            id="txtProjectLeader"
            value={selectedData ? selectedData.projectLeader : ""}
          ></Input>
        </div>

        <div className="__new-row">
          <h2 className="__new-col">Project Co-Leader</h2>
        </div>
        <div className="__new-row">
          <Input
            maxLength={255}
            type="text"
            name="select"
            id="txtProjectCoLeader"
            value={selectedData ? selectedData.projectCoLeader : ""}
          ></Input>
        </div>

        <div className="__new-row justify-content-between align-items-center flex-wrap">
          <h2 className="__new-col">KPI</h2>
          <h2 className="__new-col">Process Line</h2>
        </div>
        <div className="__new-row justify-content-between align-items-center flex-wrap">
          <h2 className="__new-col">
            <TagPicker
              onChange={selected => setSelectedKPIs(selected)}
              placeholder="Select Categories"
              className="mr-3"
              data={kpis}
              labelKey="kpiNameWithUnit"
              valueKey="kpiId"
              style={{ maxWidth: 400, minWidth: 150 }}
            />
          </h2>
          <h2 className="__new-col">
            <SelectPicker
              onChange={selected => setSelectedProcessLines(selected)}
              placeholder="Select Processes"
              className="mr-3"
              data={processLines}
              labelKey="processLineCode"
              valueKey="processLineId"
              style={{ maxWidth: 400, minWidth: 150 }}
            />
          </h2>
        </div>

        <div className="__new-row">
          <h2 className="__new-col">Baseline</h2>
        </div>
        <div className="__new-row">
          <Input
            maxLength={255}
            type="text"
            name="select"
            id="txtProjectBaseline"
            value={selectedData ? selectedData.baseline : ""}
          ></Input>
        </div>

        <div className="__new-row">
          <h2 className="__new-col">Budget</h2>
        </div>
        <div className="__new-row">
          <Input
            maxLength={255}
            type="text"
            name="select"
            id="txtProjectBudget"
            value={selectedData ? selectedData.budget : ""}
          ></Input>
        </div>

        <div className="__new-row">
          <h2 className="__new-col">Target</h2>
        </div>
        <div className="__new-row">
          <Input
            maxLength={255}
            type="text"
            name="select"
            id="txtProjectTarget"
            value={selectedData ? selectedData.target : ""}
          ></Input>
        </div>

        <div className="__new-row">
          <h2 className="__new-col">Link</h2>
        </div>
        <div className="__new-row">
          <Input
            maxLength={255}
            type="text"
            name="select"
            id="txtProjectLink"
            value={selectedData ? selectedData.link : ""}
          ></Input>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="subtle" onClick={applyToggle}>
          Cancel
        </Button>{" "}
        <Button appearance="primary" onClick={applyToggle}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ImprovementModal
