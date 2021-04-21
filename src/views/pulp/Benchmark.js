import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  setDisplayAsDate,
  setLatestDate,
  setProcessLines
} from "../../redux/actions/dashboard.action"
import { Loader, Alert } from "rsuite"
import axios from "axios"
import { ACTION, CANCEL_REQUEST, MODULE } from "../../constants"
import Filter from "../../components/benchmark/Filter"
import { Scrollbars } from "react-custom-scrollbars"

// reactstrap components
import { Container, Row, Col } from "reactstrap"
import GeneralService from "../../services/general.service"
import KpiChart from "../../components/benchmark/KpiChart"
import { setBreadcrumb } from "../../redux/actions/app.action"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../config/Can"
import { ModuleAbility } from "../../models/ModuleAbility"

const BENCHMARK_TABS = {
  kpiBenchmarking: {
    name: "KPI Benchmarking",
    slug: "kpi-benchmarking"
  },
  projects: {
    name: "Projects",
    slug: "benchmark/projects"
  }
}

const Benchmark = props => {
  const [kpis, setKpis] = useState(null)
  const [selectedKPIs, setSelectedKPIs] = useState([])
  const [filterParams, setFilterParams] = useState({})
  const processLines = useSelector(state => state.dashboardReducer.processLines)
  const [isLoading, setIsLoading] = useState(false)
  const mill = useSelector(state => state.appReducer.mill)
  const dispatch = useDispatch()
  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)

  useEffect(() => {
    const { millId, buId } = mill
    const fetchData = async source1 => {
      setIsLoading(true)
      const param = {
        buId,
        millId,
        kpiCategoryIds: [2, 3, 4, 5]
      }
      await GeneralService.getLatestDate(param, source1).then(
        data => {
          dispatch(setLatestDate(data.datetime))
          dispatch(setDisplayAsDate(data.datetime))
        },
        error => {
          Alert.error("We got an unknown error.", 5000)
          console.log(error)
          return Promise.reject()
        }
      )
      await GeneralService.getAllProcessLines(param, source1).then(
        data => {
          dispatch(setProcessLines(data))
          setIsLoading(false)
        },
        error => {
          Alert.error("We got an unknown error.", 5000)
          console.log(error)
          return Promise.reject()
        }
      )
      await GeneralService.getKpis(param, source1).then(
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
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    const moduleAbilityObj = new ModuleAbility(
      MODULE.pulpBenchmarking,
      millId,
      buId
    )
    setModuleAbility({
      [MODULE.pulpBenchmarking]: moduleAbilityObj
    })
    if (ability.can(ACTION.access, moduleAbilityObj)) {
      fetchData(source)
      if (props.location.state && props.location.state.tab) {
        const { breadcrumb } = props.location.state
        dispatch(setBreadcrumb(breadcrumb))
        document.getElementById("root").click()
      } else {
        dispatch(
          setBreadcrumb(["Benchmark", BENCHMARK_TABS.kpiBenchmarking.name])
        )
      }
      return () => {
        source.cancel(CANCEL_REQUEST)
      }
    }
  }, [props, mill, dispatch, ability])

  const onFilter = params => {
    setSelectedKPIs(params.selectedKPIs)
    setFilterParams(params)
  }

  return (
    <>
      <main>
        <section id="benchmark" className="main-section">
          {isLoading ? (
            <Loader center content="Loading" />
          ) : (
            moduleAbility !== null &&
            ability.can(
              ACTION.access,
              moduleAbility[MODULE.pulpBenchmarking]
            ) && (
              <>
                <Filter
                  kpisCategories={kpis}
                  processLines={processLines}
                  onFilter={onFilter}
                />

                <Scrollbars
                  className="__content-tab"
                  style={{ height: `calc(100vh - 200px)` }}
                >
                  <Container
                    fluid
                    className={
                      filterParams.millId && filterParams.millId.length > 1
                        ? ""
                        : "d-none"
                    }
                  >
                    {selectedKPIs.map((kpiId, index) => {
                      return (
                        <Row
                          className="__row"
                          key={`consumption-kpi${kpiId}-${index}`}
                        >
                          <Col lg="12">
                            <KpiChart kpiId={kpiId} {...filterParams} />
                          </Col>
                        </Row>
                      )
                    })}
                  </Container>
                </Scrollbars>
              </>
            )
          )}
        </section>
      </main>
    </>
  )
}
export default Benchmark
