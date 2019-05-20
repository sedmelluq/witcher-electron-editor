import { BaseField } from './FieldDefinitions'

export default class EmitterModule {
  public enabled: boolean = false

  constructor(public initializerFlag: number, public modificatorFlag: number, public name: string, public fields: Array<BaseField<{}>>) {
    this.name = name
    this.initializerFlag = initializerFlag
    this.modificatorFlag = modificatorFlag
    this.fields = fields
  }

  loadValues(moduleData: object) {
    this.enabled = this.isEnabledWith(moduleData)

    if (this.enabled) {
      for (let field of this.fields) {
        field.loadValue(moduleData)
      }
    }
  }

  private isEnabledWith(moduleData: object): boolean {
    if (this.initializerFlag !== 0) {
      return ((moduleData['initializersEnabled'] as number) & this.initializerFlag) != 0
    } else if (this.modificatorFlag !== 0) {
      return ((moduleData['modificatorsEnabled'] as number) & this.modificatorFlag) != 0
    } else {
      return true
    }
  }
}
