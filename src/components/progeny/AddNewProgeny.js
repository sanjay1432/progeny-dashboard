import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import { Grid, Row, Col, Input, Button } from "rsuite"
import DataPicker from "./sharedComponent/DataPicker"

const initialForm = {
  progenyId: "",
  popvar: "",
  origin: "",
  progenyremark: "",
  progeny: "",
  generation: "",
  ortet: "",
  fp: "",
  fpVar: "",
  fpFam: "",
  mp: "",
  mpFam: "",
  mpVar: "",
  cross: "",
  crossType: ""
}
const AddNewProgeny = () => {
  const [formData, setFormData] = useState(initialForm)
  const dispatch = useDispatch()

  const ProgenyData = useSelector(
    state => state.dashboardDataReducer.result.progeny
  )

  function handleChange(e) {
    e.persist()
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }))
    console.log(formData)
  }

  return (
    <div id="ProgenyActionPage">
      <Grid fluid>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny ID</p>
          </Col>
          <Col>
            <Input name="progenyId" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Pop Var</p>
          </Col>
          <Col>
            <DataPicker
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
            <Input name="origin" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny Remark</p>
          </Col>
          <Col>
            <Input
              name="progenyremark"
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny</p>
          </Col>
          <Col>
            <Input name="progeny" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Generation</p>
          </Col>
          <Col>
            <DataPicker
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
            <Input name="ortet" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP</p>
          </Col>
          <Col>
            <Input name="fp" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Fam</p>
          </Col>
          <Col>
            <Input name="fpFam" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Var</p>
          </Col>
          <Col>
            <DataPicker
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
            <Input name="mp" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Fam</p>
          </Col>
          <Col>
            <Input name="mpFam" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Var</p>
          </Col>
          <Col>
            <DataPicker
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
            <Input name="cross" onChange={(value, e) => handleChange(e)} />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross Type</p>
          </Col>
          <Col>
            <Input name="crossType" onChange={(value, e) => handleChange(e)} />
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

export default AddNewProgeny
