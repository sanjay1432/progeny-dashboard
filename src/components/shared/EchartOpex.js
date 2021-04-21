import React from "react"
import { useDispatch } from "react-redux"
import { setExpandChart } from "../../redux/actions/app.action"
import ReactEcharts from "echarts-for-react"
import { Icon, IconButton } from "rsuite"

const EchartOpex = ({
  chartTitle,
  showExpand = true,
  chartHeader,
  ...props
}) => {
  const dispatch = useDispatch()
  return (
    <div>
      <div className="d-flex align-items-center">
        <div className="chart-header">{chartHeader}</div>
        {showExpand && (
          <div className="expand-chart">
            <IconButton
              onClick={() => {
                dispatch(
                  setExpandChart({
                    data: props.option || {},
                    show: true,
                    title: chartTitle
                  })
                )
              }}
              appearance="default"
              size="xs"
              className="ml-2"
              icon={<Icon icon="expand" />}
            />
          </div>
        )}
      </div>

      <ReactEcharts {...props} />
    </div>
  )
}

export default EchartOpex
