export class ModuleAbility {
  constructor(module, millId, buId) {
    this.module = module
    this.millId = millId
    this.buId = buId
  }
  static get modelName() {
    return "ModuleAbility"
  }
}
