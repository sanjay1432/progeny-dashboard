import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import { Grid, Row, Col, Input, Button } from "rsuite"
import DataPicker from "./sharedComponent/DataPicker"

const EditProgeny = ({ option, ...props }) => {
  console.log(option)
  const initialForm = {
    progenyId: option.progenyId,
    popvar: option.popvar,
    origin: option.origin,
    progeny: option.progeny,
    progenyremark: option.progenyremark,
    generation: option.generation,
    ortet: option.ortet,
    fp: option.fp,
    fpVar: option.fpVar,
    fpFam: option.fpFam,
    mp: option.mp,
    mpFam: option.mpFam,
    mpVar: option.mpVar,
    cross: option.cross,
    crossType: option.crossType
  }
  const [formData, setFormData] = useState(initialForm)
  const dispatch = useDispatch()

  const ProgenyData = useSelector(
    state => state.dashboardDataReducer.result.progeny
  )

  function handleChange(e) {
    e.persist()
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }))
  }
  console.log(formData.progenyId)
  return (
    <div id="ProgenyActionPage">
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
              dataValue={formData.popvar}
              dataType="popvar"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, ["popvar"]: value }))
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
              dataValue={formData.generation}
              dataType="generation"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, ["generation"]: value }))
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
              value={formData.ortet}
              name="ortet"
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP</p>
          </Col>
          <Col>
            <Input
              name="fp"
              value={formData.fp}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Fam</p>
          </Col>
          <Col>
            <Input
              name="fpFam"
              value={formData.fpFam}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Var</p>
          </Col>
          <Col>
            <DataPicker
              dataValue={formData.fpVar}
              dataType="fpVar"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, ["mpVar"]: value }))
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP</p>
          </Col>
          <Col>
            <Input
              name="mp"
              value={formData.mp}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Fam</p>
          </Col>
          <Col>
            <Input
              name="mpFam"
              value={formData.mpFam}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Var</p>
          </Col>
          <Col>
            <DataPicker
              dataValue={formData.mpVar}
              dataType="mpVar"
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, ["mpVar"]: value }))
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
              value={formData.cross}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross Type</p>
          </Col>
          <Col>
            <Input
              name="crossType"
              value={formData.crossType}
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3} mdOffset={18} lg={3} lgOffset={18}>
            <Button
              appearance="subtle"
              onClick={() => dispatch(clearBreadcrumb())}
            >
              Cancel
            </Button>
          </Col>
          <Col md={3} lg={3}>
            <Button appearance="primary">Save</Button>
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

export default EditProgeny
