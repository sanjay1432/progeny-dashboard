import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import { Grid, Row, Col, InputGroup, Input, Button } from "rsuite"
import DataPicker from "./sharedComponent/DataPicker"
import ProgenyService from "../../services/progeny.service"
import { publish } from "../../services/pubsub.service"

const AddNewProgeny = () => {
  const [manipulate, setManipulate] = useState(false)

  const initialForm = {
    progenyId: "",
    popvar: "",
    origin: "",
    progenyremark: "",
    progeny: "",
    generation: "",
    ortet: "",
    fpFam: "",
    fp: "",
    fpVar: "",
    mpFam: "",
    mp: "",
    mpVar: "",
    cross: "",
    crossType: ""
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
    console.log(formData)
  }

  function handleSelectFpFam(fpFam) {
    setFormData(() => ({ ...formData, fpFam }))
    console.log(formData)
    setManipulate(true)
  }

  function handleSelectMpFam(mpFam) {
    setFormData(() => ({ ...formData, mpFam }))
    console.log(formData)
    setManipulate(true)
  }

  function onSaveProgeny() {
    console.log(formData)
    ProgenyService.addNewProgeny(formData).then(
      data => {
        const savedData = {
          type: "PROGENY_ADD",
          data: formData,
          action: "CREATED"
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
            <p className="labelName">FP Fam</p>
          </Col>
          <Col>
            <DataPicker
              dataType="fpFam"
              OriginalData={ProgenyData}
              // onChange={value =>
              //   setFormData(() => ({ ...formData, ["fpFam"]: value }))
              // }
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
              {manipulate ? (
                <InputGroup.Addon>{formData.fpFam}</InputGroup.Addon>
              ) : (
                <InputGroup.Addon />
              )}

              <Input name="fp" onChange={(value, e) => handleChange(e)} />
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
              OriginalData={ProgenyData}
              onChange={value =>
                setFormData(() => ({ ...formData, ["fpVar"]: value }))
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
              {manipulate ? (
                <InputGroup.Addon>{formData.mpFam}</InputGroup.Addon>
              ) : (
                <InputGroup.Addon />
              )}
              <Input name="mp" onChange={(value, e) => handleChange(e)} />
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
            {manipulate ? (
              <Input
                name="cross"
                value={
                  formData.fpFam +
                  "." +
                  formData.fp +
                  " x " +
                  formData.mpFam +
                  "." +
                  formData.mp
                }
                disabled
              />
            ) : (
              <Input disabled />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross Type</p>
          </Col>
          <Col>
            <InputGroup>
              {manipulate ? (
                <InputGroup.Addon>
                  {formData.fpVar + "X" + formData.mpVar}
                </InputGroup.Addon>
              ) : (
                <InputGroup.Addon></InputGroup.Addon>
              )}
              <DataPicker
                dataType="crossType"
                OriginalData={crossTypeData}
                onChange={value =>
                  setFormData(() => ({
                    ...formData,
                    ["crossType"]:
                      formData.fpVar + "X" + formData.mpVar + " " + value
                  }))
                }
              />
            </InputGroup>
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
            <Button appearance="primary" onClick={onSaveProgeny}>
              Save
            </Button>
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

export default AddNewProgeny
