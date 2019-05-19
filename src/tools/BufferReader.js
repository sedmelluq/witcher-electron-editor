export default class BufferReader {
  constructor(buffer, offset, length) {
    this.buffer = buffer
    this.position = (typeof offset === 'undefined') ? 0 : offset
    this.limit = (typeof length === 'undefined') ? buffer.length : this.offset + length
  }

  nextUInt8() {
    const result = this.buffer.readUInt8(this.position)
    this.position += 1
    return result
  }

  nextUInt32() {
    const result = this.buffer.readUInt32LE(this.position)
    this.position += 4
    return result
  }

  nextBitset32() {
    const compressed = this.nextUInt32()
    const bitset = []

    for (let i = 0; i < 32; i++) {
      bitset.push((compressed & (1 << i)) != 0)
    }

    return bitset
  }

  nextFloat() {
    return this.constructor._nextFloatOf(this)
  }

  static _nextFloatOf(reader) {
    const result = reader.buffer.readFloatLE()
    reader.position += 4
    return result
  }

  nextFloatBuffer() {
    return this._nextBuffer(this.constructor._nextFloatOf)
  }

  nextVector3() {
    return this.constructor._nextVector3Of(this)
  }

  static _nextVector3Of(reader) {
    return {
      x: reader.nextFloat(),
      y: reader.nextFloat(),
      z: reader.nextFloat()
    }
  }

  nextVector3Buffer() {
    return this._nextBuffer(this.constructor._nextVector3Of)
  }

  nextVector2() {
    return this.constructor._nextVector2Of(this)
  }

  static _nextVector2Of(reader) {
    return {
      x: reader.nextFloat(),
      y: reader.nextFloat()
    }
  }

  nextVector2Buffer() {
    return this._nextBuffer(this.constructor._nextVector2Of)
  }

  nextMatrix() {
    const values = []

    for (let i = 0; i < 16; i++) {
      values.push(this.nextFloat())
    }

    return values
  }
  
  nextUInt64() {
    const first = this.nextUInt32()
    const second = this.nextUInt32()
    
    return [second, first]
  }

  _nextBuffer(readFunction) {
    const count = this.nextUInt8()
    const values = []

    for (let i = 0; i < count; i++) {
      values.push(readFunction(this))
    }

    return values
  }

  nextString() {
    const length = this.nextUInt32()
    const result = this.buffer.toString('utf8', this.position, this.position + length)
    this.position += length
    return result
  }
}
