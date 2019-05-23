import React from 'react'
import EmitterInfo from './EmitterInfo'
import EmitterView from './EmitterView'
import BufferReader from '../../tools/BufferReader'
import { observable, computed } from 'mobx';

export default class EmitterFeature {
  featureBarKey = 'P'
  @observable emitters = {}
  @observable selectedEmitterName = ""

  constructor(tcpClient) {
    this._tcpClient = tcpClient
    this._refreshInterval = setInterval(this._refresh, 5000)
    setTimeout(this._refresh, 500)
  }

  fetchDetails(emitterName) {
    const emitter = this._findEmitter(emitterName)

    if (emitter) {
      this._fetchDetailsFor(emitter)
    }
  }

  _fetchDetailsFor(emitter) {
    if (emitter.detailsState == "notloaded" && this._tcpClient.connected) {
      const nameLength = Buffer.byteLength(emitter.name, 'utf8')
      const messageBuffer = Buffer.alloc(4 + nameLength)

      messageBuffer.writeUInt32LE(nameLength, 0)
      messageBuffer.write(emitter.name, 4, nameLength)

      const callback = this._handleEmitterDetailsMessage
      
      this._tcpClient.request(7, messageBuffer, (success, type, payload) => {
        callback(emitter, success, type, payload)
      })
    }
  }

  createView() {
    return React.createElement(EmitterView, { feature: this }, null)
  }

  selectEmitter(emitterName) {
    const emitter = this._findEmitter(emitterName)

    if (emitter) {
      this.selectedEmitterName = emitterName
      console.log('selection done', emitterName)

      this._fetchDetailsFor(emitter)
    }
  }

  @computed get selectedEmitter() {
    return this._findEmitter(this.selectedEmitterName)
  }

  _findEmitter(emitterName) {
    return Object.values(this.emitters).find(emitter => { return emitter.name === emitterName })
  }

  _refresh = () => {
    if (this._tcpClient.connected) {
      this._tcpClient.request(5, Buffer.alloc(0), this._handleEmitterListMessage)
    }
  }

  _handleEmitterDetailsMessage = (emitter, success, type, payload) => {
    if (!success) {
      console.log("Emitter details of ", emitter.name, ": failed due to connection error")
      emitter.detailsState = "failed"
    } else if (type != 8) {
      console.log("Emitter details of ", emitter.name, ": failed due to server error")
      emitter.detailsState = "failed"
    } else {
      const reader = new BufferReader(payload)
      
      try {
        if (reader.nextUInt8() == 1) {
          this._readEmitterDetails(emitter, reader)
          emitter.detailsState = "ready"
        } else {
          console.log("Emitter details of ", emitter.name, ": not found in game")
          emitter.detailsState = "missing"
        }
      } catch (error) {
        emitter.detailsState = "failed"
        console.log("Emitter details of ", emitter.name, ": failed with exception", error)
        return
      }
    }
  }

  _readEmitterDetails(emitter, reader) {
    const details = {
      initializersEnabled: reader.nextUInt32(),
      modificatorsEnabled: reader.nextUInt32(),
      alpha: reader.nextFloatBuffer(),
      color: reader.nextVector3Buffer(),
      lifetime: reader.nextFloatBuffer(),
      position: reader.nextVector3Buffer(),
      positionOffset: reader.nextFloat(),
      rotation: reader.nextFloatBuffer(),
      rotation3d: reader.nextVector3Buffer(),
      rotationRate: reader.nextFloatBuffer(),
      rotationRate3d: reader.nextVector3Buffer(),
      size: reader.nextVector2Buffer(),
      size3d: reader.nextVector3Buffer(),
      sizeKeepRatio: reader.nextUInt8(),
      spawnExtents: reader.nextVector3Buffer(),
      spawnInnerRadius: reader.nextFloatBuffer(),
      spawnOuterRadius: reader.nextFloatBuffer(),
      spawnWorldSpace: reader.nextUInt8(),
      spawnSurfaceOnly: reader.nextUInt8(),
      p0A8: reader.nextVector3(),
      spawnToLocalMatrix: reader.nextMatrix(),
      velocity: reader.nextVector3Buffer(),
      velocityWorldSpace: reader.nextUInt8(),
      velocityInheritScale: reader.nextFloatBuffer(),
      velocitySpreadScale: reader.nextFloatBuffer(),
      velocitySpreadConserveMomentum: reader.nextUInt8(),
      textureAnimationInitialFrame: reader.nextFloatBuffer(),
      p140: reader.nextUInt32(),
      p144: reader.nextUInt32(),
      p148: reader.nextUInt32(),
      velocityOverLife: reader.nextVector3Buffer(),
      accelerationDirection: reader.nextVector3Buffer(),
      accelerationScale: reader.nextFloatBuffer(),
      rotationOverLife: reader.nextFloatBuffer(),
      rotationRateOverLife: reader.nextFloatBuffer(),
      rotation3dOverLife: reader.nextVector3Buffer(),
      rotationRate3dOverLife: reader.nextVector3Buffer(),
      colorOverLife: reader.nextVector3Buffer(),
      alphaOverLife: reader.nextFloatBuffer(),
      sizeOverLife: reader.nextVector2Buffer(),
      size3dOverLife: reader.nextVector3Buffer(),
      textureAnimationSpeed: reader.nextFloatBuffer(),
      velocityTurbulizeScale: reader.nextVector3Buffer(),
      velocityTurbulizeTimelifeLimit: reader.nextFloatBuffer(),
      velocityTurbulizeNoiseInterval: reader.nextFloat(),
      velocityTurbulizeDuration: reader.nextFloat(),
      targetForceScale: reader.nextFloatBuffer(),
      targetKillRadius: reader.nextFloatBuffer(),
      targetMaxForce: reader.nextFloat(),
      targetPosition: reader.nextVector3Buffer(),
      spawnPositiveX: reader.nextUInt8(),
      spawnNegativeX: reader.nextUInt8(),
      spawnPositiveY: reader.nextUInt8(),
      spawnNegativeY: reader.nextUInt8(),
      spawnPositiveZ: reader.nextUInt8(),
      spawnNegativeZ: reader.nextUInt8(),
      spawnVelocity: reader.nextUInt8(),
      collisionTriggerGroupIndex: reader.nextUInt64(),
      collisionDynamicFriction: reader.nextFloat(),
      collisionStaticFriction: reader.nextFloat(),
      collisionRestitution: reader.nextFloat(),
      collisionVelocityDampening: reader.nextFloat(),
      collisionDisableGravity: reader.nextUInt8(),
      collisionUseGpu: reader.nextUInt8(),
      collisionRadius: reader.nextFloat(),
      collisionKillWhenCollide: reader.nextUInt8(),
      collisionSelfEmitterIndex: reader.nextUInt32(),
      collisionSpawnProbability: reader.nextFloat(),
      collisionSpawnParentEmitterIndex: reader.nextUInt32(),
      alphaByDistanceFar: reader.nextFloat(),
      alphaByDistanceNear: reader.nextFloat()
    }

    if (reader.position < reader.limit) {
      throw new Error ("Did not read all data from emitter")
    }

    emitter.loadModuleData(details)
  }

  _handleEmitterListMessage = (success, type, payload) => {
    if (!success) {
      return
    }

    const reader = new BufferReader(payload)
    const count = reader.nextUInt32()
    const newEmitters = {}

    for (let i = 0; i < count; i++) {
      const metadata = {
        name: reader.nextString(),
        directory: reader.nextString(),
        source: reader.nextString(),
        bundle: reader.nextString()
      }

      if (metadata.name in this.emitters) {
        newEmitters[metadata.name] = this.emitters[metadata.name]
      } else {
        newEmitters[metadata.name] = new EmitterInfo(metadata)
      }
    }

    this.emitters = newEmitters
  }
}
