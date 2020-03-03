import { Socket } from 'net'
import { Buffer } from 'buffer'
import BufferBuilder from 'buffer-builder'
import Queue from 'queue-fifo'
import { observable } from 'mobx'

class MessageHeader {
  public type: number
  public length: number
}

export default class TcpClient {
  @observable public connected: boolean = false
  @observable public connectionMessage: string = 'Initializing...'
  private socket: Socket = new Socket()
  private requestQueue: Queue<(boolean, number?, Buffer?) => void> = new Queue()
  private header: MessageHeader = null
  private headerBuilder: BufferBuilder = new BufferBuilder()
  private payloadBuilder: BufferBuilder = new BufferBuilder()

  constructor(private host: string, private port: number) {
    this.socket.on('close', this.onClose)
    this.socket.on('data', this.onData)
    this.socket.on('ready', this.onReady)
    this.socket.on('error', this.onError)
    this.triggerConnect()
  }

  request(type: number, payload: Buffer, callback: (boolean, number?, Buffer?) => void) {
    if (!this.connected) {
      callback(false)
      return
    }

    const outHeader = Buffer.alloc(6)
    outHeader.writeUInt16LE(type, 0)
    outHeader.writeUInt32LE(payload.length, 2)

    this.socket.write(outHeader)
    this.socket.write(payload)
    this.requestQueue.enqueue(callback)
  }

  private triggerConnect = () => {
    this.socket.connect(this.port, this.host)
  }

  private onClose = (hadError: boolean) => {
    this.connected = false

    const queueSize = this.requestQueue.size()

    if (queueSize > 0) {
      console.log("TCP: marking", queueSize, "requests as failed because connection closed")

      while (!this.requestQueue.isEmpty()) {
        const handler = this.requestQueue.dequeue()
        handler(false)
      }
    }

    setTimeout(this.triggerConnect, 10000)
  }

  private onReady = () => {
    this.connected = true

    this.connectionMessage = 'Succesfully connected'
  }

  private onData = (data: Buffer) => {
    let offset = 0

    while (offset < data.length) {
      if (this.header == null) {
        const remaining = data.length - offset

        if (this.headerBuilder.length > 0 || remaining < 6) {
          const headerRequired = 6 - this.headerBuilder.length

          if (remaining < headerRequired) {
            this.headerBuilder.appendBuffer(data.slice(offset))
            return
          }
  
          this.headerBuilder.appendBuffer(data.slice(offset, offset + headerRequired))
          offset += headerRequired

          const headerBuffer = this.headerBuilder.get()
          this.headerBuilder = new BufferBuilder()
          
          this.header = {
            type: headerBuffer.readUInt16LE(0),
            length: headerBuffer.readUInt32LE(2)
          }
        } else {
          this.header = {
            type: data.readUInt16LE(offset),
            length: data.readUInt16LE(offset + 2)
          }

          offset += 6
        }
      }

      const remaining = data.length - offset

      if (this.payloadBuilder.length > 0 || remaining < this.header.length) {
        const payloadRequired = this.header.length - this.payloadBuilder.length

        if (remaining < payloadRequired) {
          this.payloadBuilder.appendBuffer(data.slice(offset))
          return
        }

        this.payloadBuilder.appendBuffer(data.slice(offset, offset + payloadRequired))
        offset += payloadRequired

        try {
          this.reportMessage(this.header.type, this.payloadBuilder.get())
        } catch (e) {
          console.error(e)
        }

        this.payloadBuilder = new BufferBuilder()
      } else {
        try {
          this.reportMessage(this.header.type, data.slice(offset, offset + this.header.length))
        } catch (e) {
          console.error(e)
        }

        offset += this.header.length
      }

      this.header = null
    }
  }

  private reportMessage = (messageType: number, payload: Buffer) => {
    if (this.requestQueue.isEmpty()) {
      console.log("TCP: received message, but no handlers queued.")
    } else {
      const handler = this.requestQueue.dequeue()
      handler(true, messageType, payload)
    }
  }

  private onError = (error: Error) => {
    if (this.connected) {
      this.connectionMessage = 'Disconnected: ' + error.message
    } else {
      this.connectionMessage = 'Connection attempt failed: ' + error.message
    }
  }
}
