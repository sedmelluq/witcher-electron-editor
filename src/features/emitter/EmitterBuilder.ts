export default class EmitterBuilder {
  public moduleData: object = {}
  public propertyProvider: object = {}
  public errors: Array<string> = []

  constructor() {
    this.moduleData['initializersEnabled'] = 0
    this.moduleData['modificatorsEnabled'] = 0
  }

  setInitializerFlag(flag: number) {
    const current = this.moduleData['initializersEnabled'] as number
    this.moduleData['initializersEnabled'] = current | flag
  }

  setModificatorFlag(flag: number) {
    const current = this.moduleData['modificatorsEnabled'] as number
    this.moduleData['modificatorsEnabled'] = current | flag
  }
}
