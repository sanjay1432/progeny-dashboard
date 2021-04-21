import React, { useEffect, useState } from "react"
import _ from "lodash"
import GeneralHelper from "../../helper/general.helper"
import Annotation from "./Annotation"
import EchartOpex from "./EchartOpex"

const ChartWithAnnotation = ({
  millId,
  kpiId,
  buId,
  processLines,
  chartOptions,
  annotations,
  chartTitle,
  chartHeader
}) => {
  const [isShowAnnotationDialog, setIsShowAnnotationDialog] = useState(false)
  const [annotationData, setAnnotationData] = useState(null)
  const [option, setOption] = useState(null)

  useEffect(() => {
    let chartOpt = _.cloneDeep(chartOptions)
    if (chartOpt) {
      chartOpt.xAxis.axisLabel.formatter = value =>
        GeneralHelper.chartDateFormatterAnnotation(annotations, value)
      setOption(chartOpt)
    }
  }, [chartOptions, annotations])

  const onChartClick = chartParam => {
    if (chartParam) {
      setIsShowAnnotationDialog(true)
      setAnnotationData({
        annotationDate: chartParam.name,
        processLine: chartParam.seriesName,
        processLineValue: chartParam.data,
        kpiId: kpiId,
        millId: millId,
        buId: buId,
        processLines: processLines
      })
    }
  }

  return (
    <>
      <EchartOpex
        chartTitle={chartTitle}
        chartHeader={chartHeader}
        style={{ height: "250px" }}
        notMerge={true}
        option={option || {}}
        onEvents={{ click: onChartClick }}
      />
      <Annotation
        setChartOption={setOption}
        annotationsDate={annotations}
        chartOptions={chartOptions}
        annotationData={annotationData}
        isShowAnnotationDialog={isShowAnnotationDialog}
        onClose={() => setIsShowAnnotationDialog(false)}
      />
    </>
  )
}

export default ChartWithAnnotation
