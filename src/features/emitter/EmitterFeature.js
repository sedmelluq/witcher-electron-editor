import React from 'react'
import EmitterView from './EmitterView'
import { observable, computed } from 'mobx';

export default class EmitterFeature {
  featureBarKey = 'P'
  @observable emitters = []
  @observable selectedEmitterName = ""

  constructor(tcpClient) {
    this._tcpClient = tcpClient
    this._refreshInterval = setInterval(this._refresh, 5000)
    setTimeout(this._refresh, 500)
  }

  createView() {
    return React.createElement(EmitterView, { feature: this }, null)
  }

  selectEmitter(emitterName) {
    if (this.emitters.find(emitter => { return emitter.name === emitterName })) {
      this.selectedEmitterName = emitterName
      console.log('selection done', emitterName)
    }
  }

  @computed get selectedEmitter() {
    return this.emitters.find(emitter => { return emitter.name === this.selectedEmitterName })
  }

  _refresh = () => {
    if (this._tcpClient.connected) {
      this._tcpClient.request(5, Buffer.alloc(0), this._handleEmitterListMessage)
    }
  }

  _handleEmitterListMessage = (success, type, payload) => {
    if (!success) {
      return;
    }

    const count = payload.readUInt32LE(0)
    const items = []
    let position = 4

    for (let i = 0; i < count; i++) {
      let length = payload.readUInt32LE(position)
      const name = payload.toString('utf8', position + 4, position + 4 + length)
      position += 4 + length

      length = payload.readUInt32LE(position)
      const directory = payload.toString('utf8', position + 4, position + 4 + length)
      position += 4 + length

      length = payload.readUInt32LE(position)
      const source = payload.toString('utf8', position + 4, position + 4 + length)
      position += 4 + length

      length = payload.readUInt32LE(position)
      const bundle = payload.toString('utf8', position + 4, position + 4 + length)
      position += 4 + length

      items.push({
        name: name,
        source: source,
        directory: directory,
        bundle: bundle
      })
    }

    this.emitters = items
  }
}
