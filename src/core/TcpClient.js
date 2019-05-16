import net from 'net'
import { Buffer } from 'buffer'
import BufferBuilder from 'buffer-builder'
import Queue from 'queue-fifo'
import { observable } from 'mobx';

export default class TcpClient {
  @observable connected = false
  @observable connectionMessage = 'Initializing...'

  constructor(host, port) {
    this._port = port
    this._host = host
    this._socket = new net.Socket()
    this._socket.on('close', this._onClose)
    this._socket.on('data', this._onData)
    this._socket.on('ready', this._onReady)
    this._socket.on('error', this._onError)
    this._triggerConnect()
    this._header = null
    this._requestQueue = new Queue()
    this._headerBuilder = new BufferBuilder()
    this._payloadBuilder = new BufferBuilder()
  }

  request(type, payload, callback) {
    if (!this.connected) {
      callback(false)
      return
    }

    const outHeader = Buffer.alloc(6)
    outHeader.writeUInt16LE(type, 0)
    outHeader.writeUInt32LE(payload.length, 2)

    this._socket.write(outHeader)
    this._socket.write(payload)
    this._requestQueue.enqueue(callback)
  }

  _triggerConnect = () => {
    this._socket.connect(this._port, this._host)
  }

  _onClose = (hadError) => {
    this.connected = false

    while (!this._requestQueue.isEmpty()) {
      const handler = this._requestQueue.dequeue()
      handler(false)
    }

    setTimeout(this._triggerConnect, 10000)
  }

  _onReady = () => {
    this.connected = true

    this.connectionMessage = 'Succesfully connected'
  }

  _onData = (data) => {
    let offset = 0

    while (offset < data.length) {
      if (this._header == null) {
        const remaining = data.length - offset

        if (this._headerBuilder.length > 0 || remaining < 6) {
          const headerRequired = 6 - this._headerBuilder.length

          if (remaining < headerRequired) {
            this._headerBuilder.appendBuffer(data.slice(offset))
            return
          }
  
          this._headerBuilder.appendBuffer(data.slice(offset, offset + headerRequired))
          offset += headerRequired

          const headerBuffer = this._headerBuilder.get()
          this._headerBuilder = new BufferBuilder()
          
          this._header = {
            type: headerBuffer.readUInt16LE(0),
            length: headerBuffer.readUInt32LE(2)
          }
        } else {
          this._header = {
            type: data.readUInt16LE(offset),
            length: data.readUInt16LE(offset + 2)
          }

          offset += 6
        }
      }

      const remaining = data.length - offset

      if (this._payloadBuilder.length > 0 || remaining < this._header.length) {
        const payloadRequired = this._header.length - this._payloadBuilder.length

        if (remaining < payloadRequired) {
          this._payloadBuilder.appendBuffer(data.slice(offset))
          return
        }

        this._payloadBuilder.appendBuffer(data.slice(offset, offset + payloadRequired))
        offset += payloadRequired

        try {
          this._reportMessage(this._header.type, this._payloadBuilder.get())
        } catch (e) {
          console.error(e)
        }

        this._payloadBuilder = new BufferBuilder()
      } else {
        try {
          this._reportMessage(this._header.type, data.slice(offset, offset + this._header.length))
        } catch (e) {
          console.error(e)
        }

        offset += this._header.length
      }

      this._header = null
    }
  }

  _reportMessage = (messageType, payload) => {
    if (this._requestQueue.isEmpty()) {
      console.log("TCP: received message, but no handlers queued.")
    } else {
      const handler = this._requestQueue.dequeue()
      handler(true, messageType, payload)
    }
  }

  _onError = (error) => {
    console.log('arrr', error)

    if (this.connected) {
      this.connectionMessage = 'Disconnected: ' + error.message
    } else {
      this.connectionMessage = 'Connection attempt failed: ' + error.message
    }
  }
}
