import { BaseField } from './FieldDefinitions'
import EmitterBuilder from './EmitterBuilder';

export default class EmitterModule {
  public enabled: boolean = false

  constructor(public initializerFlag: number, public modificatorFlag: number, public name: string,
        public fields: Array<BaseField<{}>>) {
    
    this.name = name
    this.initializerFlag = initializerFlag
    this.modificatorFlag = modificatorFlag
    this.fields = fields
  }

  loadModuleData(moduleData: object) {
    this.enabled = this.isEnabledByFlags(moduleData)

    if (this.enabled) {
      for (let field of this.fields) {
        field.loadValue(moduleData)
      }
    }
  }

  buildModuleData(builder: EmitterBuilder) {
    if (!this.enabled) {
      return
    }

    for (let field of this.fields) {
      if (field.propertyName in builder.moduleData) {
        if (JSON.stringify(builder.moduleData[field.propertyName]) !== JSON.stringify(field.value)) {
          builder.errors.push("Conflicting values for " + field.propertyName + " from " + 
              builder.propertyProvider[field.propertyName] + " and " + this.name)
        }
      } else {
        builder.moduleData[field.propertyName] = field.value
        builder.propertyProvider[field.propertyName] = this.name
      }
    }

    builder.setInitializerFlag(this.initializerFlag)
    builder.setModificatorFlag(this.modificatorFlag)
  }

  private isEnabledByFlags(moduleData: object): boolean {
    if (this.initializerFlag !== 0) {
      return ((moduleData['initializersEnabled'] as number) & this.initializerFlag) != 0
    } else if (this.modificatorFlag !== 0) {
      return ((moduleData['modificatorsEnabled'] as number) & this.modificatorFlag) != 0
    } else {
      return true
    }
  }
}
