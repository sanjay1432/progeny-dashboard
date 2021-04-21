import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import GeneralHelper from "../../../../helper/general.helper"
import {
  Form,
  FormGroup,
  FormControl,
  InputNumber,
  ControlLabel,
  Schema,
  SelectPicker
} from "rsuite"
const YEARS = GeneralHelper.generateArrayOfYears(20)

const { StringType, NumberType } = Schema.Types

const AnnualConfigDialogContent = ({ formValue, setFormValue, setFormRef }) => {
  const user = useSelector(state => state.authReducer.user)
  const [model, setModel] = useState(null)

  useEffect(() => {
    if (formValue) {
      setModel(
        Schema.Model({
          type: StringType().isRequired("Please select one production type."),
          year: NumberType().isRequired("Please select one year."),
          workingDays: NumberType().isRequired("This field is required."),
          annualTarget: NumberType().isRequired("This field is required.")
        })
      )
    }
  }, [formValue, user])
  if (!formValue) {
    return ""
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap">
        <Form
          model={model}
          ref={ref => setFormRef(ref)}
          formValue={formValue}
          onChange={value => {
            setFormValue({
              ...formValue,
              ...value
            })
          }}
        >
          <FormGroup>
            <ControlLabel>
              Production Type<span className="text-red">*</span>
            </ControlLabel>
            <FormControl
              name="type"
              className="opex-select"
              accepter={SelectPicker}
              searchable={false}
              cleanable={false}
              style={{ width: 250 }}
              data={GeneralHelper.getProductionTypes(formValue.millId)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              Year<span className="text-red">*</span>
            </ControlLabel>
            <FormControl
              name="year"
              className="opex-select"
              accepter={SelectPicker}
              cleanable={false}
              style={{ width: 250 }}
              data={YEARS}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              Working Days<span className="text-red">*</span>
            </ControlLabel>
            <FormControl
              min={0}
              accepter={InputNumber}
              style={{ width: 250 }}
              name="workingDays"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              Annual Target<span className="text-red">*</span>
            </ControlLabel>
            <FormControl
              min={0}
              accepter={InputNumber}
              style={{ width: 250 }}
              name="annualTarget"
            />
          </FormGroup>
        </Form>
      </div>
    </>
  )
}

export default AnnualConfigDialogContent
