export class BaseField<T> {
  public value: T = null

  constructor(public propertyName: string) {
    
  }

  loadValue(moduleData: object) {
    this.value = moduleData[this.propertyName] as T
  }
}

export class FloatField extends BaseField<number> {
  constructor(public propertyName: string) {
    super(propertyName)
  }
}

export class UInt32Field extends BaseField<number> {
  constructor(public propertyName: string) {
    super(propertyName)
  }
}

export class UInt64Field extends BaseField<Array<number>> {
  constructor(public propertyName: string) {
    super(propertyName)
  }
}

export class BooleanField extends BaseField<number> {
  constructor(public propertyName: string) {
    super(propertyName)
  }
}

export class Vector3 {
  constructor(public x: number, public y: number, public z: number) {

  }
}

export class Vector3Field extends BaseField<Vector3> {
  constructor(public propertyName: string) {
    super(propertyName)
  }
}

export class BufferSizePolicy {
  constructor(public minimum: number, public maximum: number) {
    
  }
}

export class BaseBufferField<T> extends BaseField<Array<T>> {
  constructor(propertyName: string, public sizePolicy: BufferSizePolicy) {
    super(propertyName)
  }
}

export class FloatBufferField extends BaseBufferField<number> {
  constructor(propertyName: string, sizePolicy: BufferSizePolicy) {
    super(propertyName, sizePolicy)
  }
}

export class Vector3BufferField extends BaseBufferField<Vector3> {
  constructor(propertyName: string, sizePolicy: BufferSizePolicy) {
    super(propertyName, sizePolicy)
  }
}

export class Vector2 {
  constructor(public x: number, public y: number) {
    
  }
}

export class Vector2BufferField extends BaseBufferField<Vector2> {
  constructor(propertyName: string, sizePolicy: BufferSizePolicy) {
    super(propertyName, sizePolicy)
  }
}
