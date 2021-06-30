import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import { Grid, Row, Col, InputGroup, Input, Button } from "rsuite"
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

  const crossTypeData = [
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
      [e.target.name]: formData.mpFam + "." + e.target.value
    }))
  }

  function handleSelectFpFam(fpFam) {
    setFormData(() => ({ ...formData, fpFam }))
  }

  function handleSelectMpFam(mpFam) {
    setFormData(() => ({ ...formData, mpFam }))
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
          <Col>
            <Input
              name="progenyId"
              value={formData.progenyId}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Pop Var</p>
          </Col>
          <Col>
            <DataPicker
              dataType="popvar"
              dataValue={formData.popvar}
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, popvar: value }))
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Origin</p>
          </Col>
          <Col>
            <Input
              name="origin"
              value={formData.origin}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny Remark</p>
          </Col>
          <Col>
            <Input
              name="progenyremark"
              value={formData.progenyremark}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny</p>
          </Col>
          <Col>
            <Input
              name="progeny"
              value={formData.progeny}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Generation</p>
          </Col>
          <Col>
            <DataPicker
              dataType="generation"
              dataValue={formData.generation}
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, generation: value }))
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Ortet</p>
          </Col>
          <Col>
            <Input
              name="ortet"
              value={formData.ortet}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Fam</p>
          </Col>
          <Col>
            <DataPicker
              dataType="fpFam"
              dataValue={formData.fpFam}
              OriginalData={ProgenyData}
              onChange={fpFam => handleSelectFpFam(fpFam)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP</p>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Addon>{formData.fpFam}</InputGroup.Addon>
              <Input
                name="fp"
                value={formData.fp.split(".")[1]}
                onChange={(value, e) => handleFpChange(e)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Var</p>
          </Col>
          <Col>
            <DataPicker
              dataType="fpVar"
              dataValue={formData.fpVar}
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, fpVar: value }))
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Fam</p>
          </Col>
          <Col>
            <DataPicker
              dataType="mpFam"
              dataValue={formData.mpFam}
              OriginalData={ProgenyData}
              onChange={mpFam => handleSelectMpFam(mpFam)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP</p>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Addon>{formData.mpFam}</InputGroup.Addon>
              <Input
                name="mp"
                value={formData.mp.split(".")[1]}
                onChange={(value, e) => handleMpChange(e)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Var</p>
          </Col>
          <Col>
            <DataPicker
              dataType="mpVar"
              dataValue={formData.mpVar}
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, mpVar: value }))
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross</p>
          </Col>
          <Col>
            <Input
              name="cross"
              value={formData.fp + " x " + formData.mp}
              disabled
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross Type</p>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Addon>
                {formData.fpVar + "X" + formData.mpVar}
              </InputGroup.Addon>
              <DataPicker
                dataType="crossType"
                dataValue={formData.crossType.slice(4)}
                OriginalData={crossTypeData}
                onChange={value =>
                  setFormData(() => ({
                    ...formData,
                    crossType:
                      formData.fpVar + "X" + formData.mpVar + " " + value
                  }))
                }
              />
            </InputGroup>
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
