import { Ability, AbilityBuilder, createAliasResolver } from "@casl/ability"
import store from "../redux/store"
import { ROLE_NAME, MODULE, ACTION } from "../constants/index"

const resolveAction = createAliasResolver({
  modify: [ACTION.add, ACTION.edit],
  access: [ACTION.read, "modify"]
})
const ability = new Ability([], { resolveAction })

let currentAuth

store.subscribe(() => {
  const prevAuth = currentAuth
  currentAuth = store.getState().authReducer
  if (prevAuth !== currentAuth) {
    ability.update(defineRulesFor(currentAuth))
  }
})

const buildCondition = (moduleName, role) => {
  return {
    module: moduleName,
    millId: role.millId,
    buId: role.buId
  }
}

function defineRulesFor(auth) {
  const { can, rules, cannot } = new AbilityBuilder(Ability)
  if (auth && auth.user && auth.user.roles) {
    const { roles } = auth.user
    if (roles) {
      roles.forEach(role => {
        switch (role.roleCode) {
          case ROLE_NAME.C01.roleCode:
          case ROLE_NAME.C02.roleCode:
          case ROLE_NAME.C03.roleCode:
          case ROLE_NAME.C04.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.finance, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.setting, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.threshold, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.annotation, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            break
          case ROLE_NAME.C05.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )

            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.finance, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.setting, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.threshold, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.annotation, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )

            break
          case ROLE_NAME.C06.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.finance, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.setting, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.threshold, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.annotation, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )

            break
          case ROLE_NAME.C07.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.threshold, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.annotation, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            break
          case ROLE_NAME.C08.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.finance, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.setting, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.threshold, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.annotation, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lcTarget, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lcIncident, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lcCookNumber, role)
            )
            break
          case ROLE_NAME.BU01.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.setting, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.threshold, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.annotation, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            break
          case ROLE_NAME.BU02.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.setting, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.threshold, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.annotation, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerBenchmarking, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.finance, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            break
          case ROLE_NAME.BU03.roleCode:
          case ROLE_NAME.BU04.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.setting, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.threshold, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.annotation, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            break
          case ROLE_NAME.BU05.roleCode:
          case ROLE_NAME.BU06.roleCode:
          case ROLE_NAME.BU07.roleCode:
          case ROLE_NAME.BU08.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.read,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            break
          case ROLE_NAME.BU09.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.dashboard, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.summary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.production, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.chemical, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.utility, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.wood, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.quality, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.rbComparison, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpiSummary, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.pulpContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spc, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcLogs, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.spcTargetDefinition, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.recoveryBoiler, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerKpi, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.powerContinuousImprovement, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.ciProjects, role)
            )
            break
          case ROLE_NAME.LC01.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lcTarget, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lcIncident, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lcCookNumber, role)
            )
            break
          case ROLE_NAME.LC02.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lcIncident, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lcCookNumber, role)
            )
            break
          case ROLE_NAME.LC03.roleCode:
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.overview, role)
            )
            can(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.lostcookAnalytics, role)
            )
            break
          default:
            cannot(
              ACTION.access,
              "ModuleAbility",
              buildCondition(MODULE.application, role)
            )
            break
        }
      })
    }
  }
  return rules
}

export default ability
