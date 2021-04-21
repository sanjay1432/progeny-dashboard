import { Modal } from "rsuite"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { setExpandChart } from "../../redux/actions/app.action"
import ReactEcharts from "echarts-for-react"

const ExpandChart = () => {
  const expandChart = useSelector(state => state.appReducer.expandChart)
  const dispatch = useDispatch()
  const hide = () => {
    dispatch(
      setExpandChart({
        ...expandChart,
        show: false
      })
    )
  }
  return (
    expandChart &&
    expandChart.data && (
      <Modal full overflow={true} show={expandChart.show} onHide={() => hide()}>
        <Modal.Header>
          <Modal.Title>{expandChart.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactEcharts
            style={{ minHeight: 500 }}
            notMerge={true}
            option={expandChart.data || {}}
          />
        </Modal.Body>
      </Modal>
    )
  )
}

export default ExpandChart
