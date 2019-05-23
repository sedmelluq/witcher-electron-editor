import React, { ReactElement } from 'react'
import EmitterInfo from './EmitterInfo'
import EmitterView from './EmitterView'
import BufferReader from '../../tools/BufferReader'
import TcpClient from '../../core/TcpClient'
import { observable, computed } from 'mobx'

export default class EmitterFeature {
  public featureBarKey: string = 'P'
  @observable public emitters: object = {}
  @observable public selectedEmitterName: string = ''
  private tcpClient: TcpClient
  private refreshInterval: NodeJS.Timeout

  constructor(tcpClient: TcpClient) {
    this.tcpClient = tcpClient
    this.refreshInterval = setInterval(this.refresh, 5000)
    setTimeout(this.refresh, 500)
  }

  fetchDetails(emitterName: string) {
    const emitter = this.findEmitter(emitterName)

    if (emitter) {
      this.fetchDetailsFor(emitter)
    }
  }

  private fetchDetailsFor(emitter: EmitterInfo) {
    if (emitter.detailsState == "notloaded" && this.tcpClient.connected) {
      const nameLength = Buffer.byteLength(emitter.name, 'utf8')
      const messageBuffer = Buffer.alloc(4 + nameLength)

      messageBuffer.writeUInt32LE(nameLength, 0)
      messageBuffer.write(emitter.name, 4, nameLength)

      const callback = this.handleEmitterDetailsMessage
      
      this.tcpClient.request(7, messageBuffer, (success: boolean, type: number, payload: Buffer) => {
        callback(emitter, success, type, payload)
      })
    }
  }

  createView(): ReactElement {
    return React.createElement(EmitterView, { feature: this }, null)
  }

  selectEmitter(emitterName: string) {
    const emitter = this.findEmitter(emitterName)

    if (emitter) {
      this.selectedEmitterName = emitterName
      console.log('selection done', emitterName)

      this.fetchDetailsFor(emitter)
    }
  }

  @computed get selectedEmitter(): EmitterInfo {
    return this.findEmitter(this.selectedEmitterName)
  }

  private findEmitter(emitterName: string): EmitterInfo {
    return Object.values(this.emitters).find(emitter => { return emitter.name === emitterName })
  }

  private refresh = () => {
    if (this.tcpClient.connected) {
      this.tcpClient.request(5, Buffer.alloc(0), this.handleEmitterListMessage)
    }
  }

  private handleEmitterDetailsMessage = (emitter: EmitterInfo, success: boolean, type: number, payload: Buffer) => {
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
          this.readEmitterDetails(emitter, reader)
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

  private readEmitterDetails(emitter: EmitterInfo, reader: BufferReader) {
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

    if (reader.remaining() > 0) {
      throw new Error ("Did not read all data from emitter")
    }

    emitter.loadModuleData(details)
  }

  private handleEmitterListMessage = (success: boolean, type: number, payload: Buffer) => {
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
