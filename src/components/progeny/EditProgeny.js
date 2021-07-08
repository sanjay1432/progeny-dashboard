import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import { Grid, Row, Col, Input, Button } from "rsuite"
import DataPicker from "../SharedComponent/DataPicker"
import ProgenyService from "../../services/progeny.service"
import { publish } from "../../services/pubsub.service"

const EditProgeny = ({ option, ...props }) => {
  const initialForm = {
    progenyId: option.progenyId,
    popvar: option.popvar,
    origin: option.origin,
    progeny: option.progeny,
    progenyremark: option.progenyremark,
    generation: option.generation,
    ortet: option.ortet,
    fpFam: option.fpFam,
    fp: option.fp,
    fpVar: option.fpVar,
    mpFam: option.mpFam,
    mp: option.mp,
    mpVar: option.mpVar,
    cross: option.cross,
    crossType: option.crossType
  }

  const [formData, setFormData] = useState(initialForm)
  const dispatch = useDispatch()
  const ProgenyData = useSelector(
    state => state.dashboardDataReducer.result.progeny
  )

  const data = [
    {
      crossType: "sibbing"
    },
    {
      crossType: "selfing"
    },
    {
      crossType: "intercross"
    }
  ]

  const crossTypeData = data.map(item => {
    const addOn = formData.fpVar + "x" + formData.mpVar + " "
    return addOn.concat(item.crossType)
  })

  function handleChange(e) {
    e.persist()
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }))
  }

  function handleFpChange(e) {
    e.persist()
    setFormData(() => ({
      ...formData,
      [e.target.name]: formData.fpFam + "." + e.target.value
    }))
  }

  function handleMpChange(e) {
    e.persist()
    setFormData(() => ({
      ...formData,
      [e.target.name]: formData.mpFam + "," + e.target.value
    }))
  }

  function updateProgeny() {
    setFormData(() => ({
      ...formData,
      cross: formData.fp + " x " + formData.mp
    }))
    ProgenyService.updateProgeny(formData).then(
      data => {
        const savedData = {
          type: "PROGENY_UPDATE",
          data: formData,
          action: "UPDATE"
        }
        dispatch(clearBreadcrumb())
        publish(savedData)
      },
      error => {
        console.log(error.message)
      }
    )
  }

  return (
    <div id="ProgenyAction">
      <Grid fluid>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny ID</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              value={formData.progenyId}
              name="progenyId"
              onChange={(value, e) => handleChange(e)}
              placeholder="Key in Progeny ID"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Pop Var</p>
          </Col>
          <Col md={10} lg={10}>
            <DataPicker
              dataType="popvar"
              searchable="true"
              dataValue={initialForm.popvar}
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, popvar: value }))
              }
              placeholder="Choose or Create New Pop Var"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Origin</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              name="origin"
              value={formData.origin}
              onChange={(value, e) => handleChange(e)}
              placeholder="Key in Origin"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny Remark</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              name="progenyremark"
              value={formData.progenyremark}
              onChange={(value, e) => handleChange(e)}
              placeholder="Key in Progeny Remark"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              name="progeny"
              value={formData.progeny}
              onChange={(value, e) => handleChange(e)}
              placeholder="Key in Progeny"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Generation</p>
          </Col>
          <Col md={10} lg={10}>
            <DataPicker
              dataType="generation"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, generation: value }))
              }
              placeholder="Choose or Create New Generation"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Ortet</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              name="ortet"
              value={formData.ortet}
              onChange={(value, e) => handleChange(e)}
              placeholder="key in Ortet"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Fam</p>
          </Col>
          <Col md={10} lg={10}>
            <DataPicker
              dataType="fpFam"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, fpFam: value }))
              }
              placeholder="Choose or Create New FP Fam"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP</p>
          </Col>
          <Col md={5} lg={5}>
            {formData.fpFam === "" ? (
              <Input
                className="fpFamDisplay"
                name="fp"
                placeholder="FP"
                disabled
              />
            ) : (
              <Input
                className="fpFamDisplay"
                name="fp"
                value={formData.fpFam}
                disabled
              />
            )}
          </Col>
          <Col md={5} lg={5}>
            {formData.fpFam === "" ? (
              <Input
                className="fpInput"
                name="fp"
                placeholder="Palm Number"
                disabled
              />
            ) : (
              <Input
                className="fpInput"
                name="fp"
                value={formData.fp.split(".")[1]}
                placeholder="Palm Number"
                onChange={(value, e) => handleFpChange(e)}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Var</p>
          </Col>
          <Col md={10} lg={10}>
            <DataPicker
              dataType="fpVar"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, fpVar: value }))
              }
              placeholder="Choose or Create New FP Var"
            />
          </Col>
        </Row>

        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Fam</p>
          </Col>
          <Col md={10} lg={10}>
            <DataPicker
              dataType="mpFam"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, mpFam: value }))
              }
              placeholder="Choose or Create New MP Fam"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP</p>
          </Col>
          <Col md={5} lg={5}>
            {formData.fpFam === "" ? (
              <Input
                className="mpFamDisplay"
                name="mp"
                placeholder="MP"
                disabled
              />
            ) : (
              <Input
                className="mpFamDisplay"
                name="mfp"
                value={formData.mpFam}
                disabled
              />
            )}
          </Col>
          <Col md={5} lg={5}>
            {formData.mpFam === "" ? (
              <Input
                className="mpInput"
                name="mp"
                placeholder="Palm Number"
                disabled
              />
            ) : (
              <Input
                className="mpInput"
                name="mp"
                value={formData.mp.split(",")[1]}
                placeholder="Palm Number"
                onChange={(value, e) => handleMpChange(e)}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Var</p>
          </Col>
          <Col md={10} lg={10}>
            <DataPicker
              dataType="mpVar"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, mpVar: value }))
              }
              placeholder="Choose or Create New MP Var"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross</p>
          </Col>
          <Col md={10} lg={10}>
            {formData.fpFam === "" ||
            formData.fp === "" ||
            formData.mpFam === "" ||
            formData.mp === "" ? (
              <Input disabled placeholder="Please choose FP and MP" />
            ) : (
              <Input
                name="cross"
                value={formData.fp + " x " + formData.mp}
                onChange={value =>
                  setFormData(() => ({ ...formData, cross: value }))
                }
                disabled
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross Type</p>
          </Col>
          <Col md={10} lg={10}>
            {formData.fpVar === "" && formData.mpVar === "" ? (
              <Input placeholder="Please choose FP Var and MP Var" disabled />
            ) : (
              <DataPicker
                dataType="crossType"
                searchable="true"
                completedData={crossTypeData}
                onChange={value =>
                  setFormData(() => ({ ...formData, crossType: value }))
                }
                placeholder="Choose or Create New MP Var"
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={4} mdOffset={16} lg={4} lgOffset={16}>
            <Button
              className="cancelButton"
              appearance="subtle"
              onClick={() => dispatch(clearBreadcrumb())}
            >
              Cancel
            </Button>
          </Col>
          <Col md={4} lg={4}>
            <Button
              className="saveButton"
              appearance="primary"
              onClick={updateProgeny}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

export default EditProgeny
