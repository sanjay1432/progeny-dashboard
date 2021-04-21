import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import GeneralHelper from "../../../../helper/general.helper"
import {
  DatePicker,
  Form,
  FormGroup,
  FormControl,
  InputNumber,
  ControlLabel,
  Schema,
  SelectPicker,
  DateRangePicker
} from "rsuite"
import { CONFIG_TYPE } from "../../../../constants"
const { before } = DateRangePicker

const { StringType, NumberType, DateType } = Schema.Types

const ProductionThresholdDialogContent = ({
  formValue,
  setFormValue,
  setFormRef,
  configType,
  processLines
}) => {
  const user = useSelector(state => state.authReducer.user)
  const [model, setModel] = useState(null)

  useEffect(() => {
    if (formValue) {
      setModel(
        Schema.Model({
          processLine:
            configType === CONFIG_TYPE.processLine
              ? StringType().isRequired("Please select one Process line.")
              : "",
          type:
            configType === CONFIG_TYPE.production
              ? StringType().isRequired("Please select one production type.")
              : "",
          threshold: NumberType().isRequired("This field is required."),
          maximum: NumberType().isRequired("This field is required."),
          startDate: DateType()
            .isRequired("This field is required.")
            .max(formValue.endDate, "Maximum is End date"),
          endDate: DateType()
            .isRequired("This field is required.")
            .min(formValue.startDate, "Minimum is Start date")
        })
      )
    }
  }, [configType, user, formValue])

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
          {CONFIG_TYPE.production === configType && (
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
          )}
          {CONFIG_TYPE.processLine === configType && (
            <FormGroup>
              <ControlLabel>
                Process Line<span className="text-red">*</span>
              </ControlLabel>
              {processLines && (
                <FormControl
                  readOnly={formValue.isDefault}
                  name="processLine"
                  className="opex-select"
                  labelKey="processLineName"
                  valueKey="processLineCode"
                  accepter={SelectPicker}
                  searchable={false}
                  cleanable={false}
                  style={{ width: 250 }}
                  data={processLines}
                />
              )}
            </FormGroup>
          )}
          <FormGroup>
            <ControlLabel>
              Threshold<span className="text-red">*</span>
            </ControlLabel>
            <FormControl
              max={Number.parseInt(formValue.maximum)}
              min={0}
              accepter={InputNumber}
              style={{ width: 250 }}
              name="threshold"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              Maximum<span className="text-red">*</span>
            </ControlLabel>
            <FormControl
              min={0}
              accepter={InputNumber}
              style={{ width: 250 }}
              name="maximum"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              Start Date<span className="text-red">*</span>
            </ControlLabel>
            <FormControl
              accepter={DatePicker}
              placement="auto"
              style={{ minWidth: 250 }}
              format="DD MMM YYYY"
              oneTap
              cleanable={false}
              name="startDate"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              End Date<span className="text-red">*</span>
            </ControlLabel>
            <FormControl
              accepter={DatePicker}
              disabledDate={before(formValue.startDate)}
              placement="auto"
              style={{ minWidth: 250 }}
              format="DD MMM YYYY"
              oneTap
              cleanable={false}
              name="endDate"
            />
          </FormGroup>
        </Form>
        <div className="gauge_chart">
          {GeneralHelper.buildGaugeChart({
            min: 0,
            value: Number.parseInt(formValue.threshold),
            threshold: Number.parseInt(formValue.threshold),
            max: Number.parseInt(formValue.maximum)
          })}
        </div>
      </div>
    </>
  )
}

export default ProductionThresholdDialogContent
