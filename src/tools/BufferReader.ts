import { Vector2, Vector3 } from '../features/emitter/FieldDefinitions'

export default class BufferReader {
  private buffer: Buffer
  private position: number
  private limit: number

  constructor(buffer: Buffer, offset?: number, length?: number) {
    this.buffer = buffer
    this.position = (typeof offset === 'undefined') ? 0 : offset
    this.limit = (typeof length === 'undefined') ? buffer.length : offset + length
  }

  remaining(): number {
    return this.limit - this.position
  }

  nextUInt8(): number {
    const result = this.buffer.readUInt8(this.position)
    this.position += 1
    return result
  }

  nextUInt32(): number {
    const result = this.buffer.readUInt32LE(this.position)
    this.position += 4
    return result
  }

  nextBitset32(): boolean[] {
    const compressed = this.nextUInt32()
    const bitset = []

    for (let i = 0; i < 32; i++) {
      bitset.push((compressed & (1 << i)) != 0)
    }

    return bitset
  }

  nextFloat(): number {
    return BufferReader.nextFloatOf(this)
  }

  private static nextFloatOf(reader: BufferReader): number {
    const result = reader.buffer.readFloatLE(reader.position)
    reader.position += 4
    return result
  }

  nextFloatBuffer(): number[] {
    return this.nextBuffer(BufferReader.nextFloatOf)
  }

  nextVector3(): Vector3 {
    return BufferReader.nextVector3Of(this)
  }

  private static nextVector3Of(reader: BufferReader): Vector3 {
    return {
      x: reader.nextFloat(),
      y: reader.nextFloat(),
      z: reader.nextFloat()
    }
  }

  nextVector3Buffer(): Vector3[] {
    return this.nextBuffer(BufferReader.nextVector3Of)
  }

  nextVector2(): Vector2 {
    return BufferReader.nextVector2Of(this)
  }

  private static nextVector2Of(reader: BufferReader): Vector2 {
    return {
      x: reader.nextFloat(),
      y: reader.nextFloat()
    }
  }

  nextVector2Buffer(): Vector2[] {
    return this.nextBuffer(BufferReader.nextVector2Of)
  }

  nextMatrix(): number[] {
    const values: number[] = []

    for (let i = 0; i < 16; i++) {
      values.push(this.nextFloat())
    }

    return values
  }
  
  nextUInt64(): number[] {
    const first = this.nextUInt32()
    const second = this.nextUInt32()
    
    return [second, first]
  }

  private nextBuffer<T>(readFunction: (BufferReader) => T): T[] {
    const count = this.nextUInt8()
    const values: T[] = []

    for (let i = 0; i < count; i++) {
      values.push(readFunction(this))
    }

    return values
  }

  nextString(): string {
    const length = this.nextUInt32()
    const result = this.buffer.toString('utf8', this.position, this.position + length)
    this.position += length
    return result
  }
}
