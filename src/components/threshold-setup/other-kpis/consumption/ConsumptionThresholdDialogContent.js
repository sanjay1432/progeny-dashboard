import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { CANCEL_REQUEST } from "../../../../constants/index"
import GeneralService from "../../../../services/general.service"
import axios from "axios"
import {
  DatePicker,
  Form,
  FormGroup,
  FormControl,
  InputNumber,
  ControlLabel,
  Schema,
  SelectPicker,
  Alert,
  DateRangePicker,
  Checkbox
} from "rsuite"
import GeneralHelper from "../../../../helper/general.helper"
const { before } = DateRangePicker

const { StringType, NumberType, DateType } = Schema.Types
const ConsumptionThresholdDialogContent = ({
  formValue,
  setFormValue,
  setFormRef,
  processLines
}) => {
  const mill = useSelector(state => state.appReducer.mill)
  const user = useSelector(state => state.authReducer.user)
  const [model, setModel] = useState(null)
  const [categories, setCategories] = useState([])
  const [kpis, setKpis] = useState([])
  const [enableRange, setEnableRange] = useState(false)
  const buId = useSelector(state => state.appReducer.buId)

  useEffect(() => {
    if (formValue) {
      setCategories(GeneralHelper.getKpiCategoryListByBUID(buId))
      let thresholdModel = NumberType().isRequired("This field is required.")
      let thresholdMaxModel = NumberType().isRequired("This field is required.")
      if (enableRange) {
        thresholdModel = thresholdModel.max(
          formValue.thresholdMax,
          "Maximum is Threshold max"
        )
      } else {
        thresholdMaxModel = null
      }

      setModel(
        Schema.Model({
          processLine: StringType().isRequired(
            "Please select one Process line."
          ),
          kpiCategory: NumberType().isRequired(
            "Please select one KPI category."
          ),
          kpiId: NumberType().isRequired("Please select one KPI."),
          startDate: DateType()
            .isRequired("This field is required.")
            .max(formValue.endDate, "Maximum is End date"),
          endDate: DateType()
            .isRequired("This field is required.")
            .min(formValue.startDate, "Minimum is Start date"),
          threshold: thresholdModel,
          thresholdMax: thresholdMaxModel
        })
      )
    }
  }, [formValue, user, buId, enableRange])

  useEffect(() => {
    if (formValue) {
      if (formValue.thresholdMax) {
        setEnableRange(true)
      }
    }
  }, [formValue])

  useEffect(() => {
    if (mill && formValue.kpiCategory) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      const param = {
        buId: mill.buId,
        millId: mill.millId,
        kpiCategoryIds: [formValue.kpiCategory]
      }
      GeneralService.getKpis(param, source).then(
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
    }
  }, [formValue.kpiCategory, mill])

  if (!formValue) {
    return ""
  }

  return (
    <>
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
        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <FormGroup>
              <ControlLabel>
                KPI Category<span className="text-red">*</span>
              </ControlLabel>
              {categories && (
                <FormControl
                  name="kpiCategory"
                  className="opex-select"
                  placeholder="Select Category"
                  labelKey="kpiCategoryName"
                  valueKey="kpiCategoryId"
                  accepter={SelectPicker}
                  searchable={false}
                  data={categories}
                  cleanable={false}
                  style={{ width: 250 }}
                />
              )}
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                Process Line<span className="text-red">*</span>
              </ControlLabel>
              {processLines && (
                <FormControl
                  placeholder="Select Process Line"
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
          </div>

          <div>
            <FormGroup>
              <ControlLabel>
                KPI<span className="text-red">*</span>
              </ControlLabel>
              {kpis && (
                <FormControl
                  placeholder="Select KPI"
                  labelKey="kpiNameWithUnit"
                  valueKey="kpiId"
                  data={kpis}
                  className="opex-select"
                  disabled={formValue.kpiCategory == null}
                  accepter={SelectPicker}
                  cleanable={true}
                  name="kpiId"
                  style={{ width: 250 }}
                />
              )}
            </FormGroup>

            <div className="_in-line">
              <FormGroup>
                <ControlLabel>
                  Threshold<span className="text-red">*</span>
                </ControlLabel>
                <FormControl
                  max={Number.parseInt(formValue.thresholdMax)}
                  min={0}
                  accepter={InputNumber}
                  style={{ width: 120 }}
                  name="threshold"
                />
              </FormGroup>
              <Checkbox
                checked={enableRange}
                onChange={(value, checked) => {
                  console.log(checked)
                  setEnableRange(checked)
                  if (!checked) {
                    setFormValue({
                      ...formValue,
                      thresholdMax: null
                    })
                  }
                }}
              >
                Within Range
              </Checkbox>
            </div>
            {enableRange && (
              <FormGroup>
                <ControlLabel>
                  Threshold Max<span className="text-red">*</span>
                </ControlLabel>
                <FormControl
                  min={0}
                  accepter={InputNumber}
                  style={{ width: 120 }}
                  name="thresholdMax"
                />
              </FormGroup>
            )}
          </div>
        </div>
      </Form>
    </>
  )
}

export default ConsumptionThresholdDialogContent
