import React, { useEffect, useState } from "react"
import GeneralService from "../../services/general.service"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setMill, setBU } from "../../redux/actions/app.action"
import { setProcessLines } from "../../redux/actions/dashboard.action"
import { Alert, Grid, Row, Col, ButtonToolbar, IconButton, Icon } from "rsuite"
import axios from "axios"
import { ACTION, MILL_INFO, MODULE } from "../../constants"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../config/Can"
import { ModuleAbility } from "../../models/ModuleAbility"
import Kerinci from "../../assets/img/RGE-logo/Kerinci.png"
import Rizhao from "../../assets/img/RGE-logo/Rizhao.png"

const PowerOverviewPanel = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)

  useEffect(() => {
    setModuleAbility({
      kerinciPower: new ModuleAbility(
        MODULE.overview,
        MILL_INFO.kerinciPower.millId,
        MILL_INFO.kerinciPower.buId
      ),
      rizhaoPower: new ModuleAbility(
        MODULE.overview,
        MILL_INFO.rizhaoPower.millId,
        MILL_INFO.rizhaoPower.buId
      )
    })
  }, [])

  const gotoDashboard = async mill => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    await GeneralService.getAllProcessLines(
      { buId: mill.buId, millId: mill.millId },
      source
    ).then(
      data => {
        dispatch(setMill(mill))
        dispatch(setBU(mill.buId))
        dispatch(setProcessLines(data))
        history.push({
          pathname: "/main/power/dashboard",
          state: {
            mill
          }
        })
      },
      error => {
        Alert.error("We got an unknown error.", 5000)
        console.log(error)
        return Promise.reject()
      }
    )
  }

  return (
    <>
      <div className="opex-panel-content-overview power">
        <div className="__header">
          <Grid fluid>
            <Row>
              {moduleAbility &&
                ability.can(ACTION.access, moduleAbility.kerinciPower) && (
                  <Col md={6}>
                    <div className="_grid-content top">
                      <div className="header-logo">
                        <div>
                          <img src={Kerinci} alt="RGE Group" height={30} />
                        </div>
                        <ButtonToolbar>
                          <IconButton
                            onClick={() =>
                              gotoDashboard(MILL_INFO.kerinciPower)
                            }
                            icon={<Icon icon="th-large" />}
                            circle
                            size="sm"
                          />
                        </ButtonToolbar>
                      </div>
                    </div>
                  </Col>
                )}
              {moduleAbility &&
                ability.can(ACTION.access, moduleAbility.rizhaoPower) && (
                  <Col md={6}>
                    <div className="_grid-content top">
                      <div className="header-logo">
                        <div>
                          <img src={Rizhao} alt="RGE Group" height={30} />
                        </div>
                        <ButtonToolbar>
                          <IconButton
                            onClick={() => gotoDashboard(MILL_INFO.rizhaoPower)}
                            icon={<Icon icon="th-large" />}
                            circle
                            size="sm"
                          />
                        </ButtonToolbar>
                      </div>
                    </div>
                  </Col>
                )}
            </Row>
          </Grid>
        </div>
      </div>
    </>
  )
}

export default PowerOverviewPanel
