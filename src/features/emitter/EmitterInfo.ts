import EmitterModule from './EmitterModule'
import { observable } from 'mobx'
import { BufferSizePolicy, FloatBufferField, Vector2BufferField, Vector3BufferField, FloatField, BooleanField, Vector3Field, UInt32Field, UInt64Field } from './FieldDefinitions'
import EmitterBuilder from './EmitterBuilder'

export default class EmitterInfo {
  @observable public detailsState: string = 'notloaded'
  public details: object = null
  public name: string
  public metadata: object
  public modules: EmitterModule[]

  constructor(metadata: object) {
    this.name = metadata['name'] as string
    this.metadata = metadata
    this.details = null
    this.modules = null
  }

  loadModuleData(moduleData: object) {
    this.details = moduleData

    const periodicChange = new BufferSizePolicy(2, 63)
    const randomRange = new BufferSizePolicy(2, 2)
    const matrixBuffer = new BufferSizePolicy(16, 16)

    const modules = [
      new EmitterModule(0x00000001, 0, 'Alpha (periodic)', [
        new FloatBufferField('alpha', periodicChange)
      ]),
      new EmitterModule(0x00000002, 0, 'Alpha (random)', [
        new FloatBufferField('alpha', randomRange)
      ]),
      new EmitterModule(0x00000004, 0, 'Color (periodic)', [
        new Vector3BufferField('color', periodicChange)
      ]),
      new EmitterModule(0x00000008, 0, 'Color (random)', [
        new Vector3BufferField('color', randomRange)
      ]),
      new EmitterModule(0x00000010, 0, 'Lifetime (periodic)', [
        new FloatBufferField('lifetime', periodicChange)
      ]),
      new EmitterModule(0x00000020, 0, 'Lifetime (random)', [
        new FloatBufferField('lifetime', randomRange)
      ]),
      new EmitterModule(0x00000040, 0, 'Position (periodic)', [
        new Vector3BufferField('position', periodicChange),
        new FloatField('positionOffset')
      ]),
      new EmitterModule(0x00000080, 0, 'Position (random)', [
        new Vector3BufferField('position', randomRange),
        new FloatField('positionOffset')
      ]),
      new EmitterModule(0x00000100, 0, 'Rotation (periodic)', [
        new FloatBufferField('rotation', periodicChange)
      ]),
      new EmitterModule(0x00000200, 0, 'Rotation (random)', [
        new FloatBufferField('rotation', randomRange)
      ]),
      new EmitterModule(0x00000400, 0, 'Rotation 3D (periodic)', [
        new Vector3BufferField('rotation3d', periodicChange)
      ]),
      new EmitterModule(0x00000800, 0, 'Rotation 3D (random)', [
        new Vector3BufferField('rotation3d', randomRange)
      ]),
      new EmitterModule(0x00001000, 0, 'Rotation rate (periodic)', [
        new FloatBufferField('rotationRate', periodicChange)
      ]),
      new EmitterModule(0x00002000, 0, 'Rotation rate (random)', [
        new FloatBufferField('rotationRate', randomRange)
      ]),
      new EmitterModule(0x00004000, 0, 'Rotation rate 3D (periodic)', [
        new Vector3BufferField('rotationRate3d', periodicChange)
      ]),
      new EmitterModule(0x00008000, 0, 'Rotation rate 3D (random)', [
        new Vector3BufferField('rotationRate3d', randomRange)
      ]),
      new EmitterModule(0x00010000, 0, 'Size (periodic)', [
        new Vector2BufferField('size', periodicChange),
        new BooleanField('sizeKeepRatio')
      ]),
      new EmitterModule(0x00020000, 0, 'Size (random)', [
        new Vector2BufferField('size', randomRange),
        new BooleanField('sizeKeepRatio')
      ]),
      new EmitterModule(0x00040000, 0, 'Size 3D (periodic)', [
        new Vector2BufferField('size3d', periodicChange),
        new BooleanField('sizeKeepRatio')
      ]),
      new EmitterModule(0x00080000, 0, 'Size 3D (random)', [
        new Vector2BufferField('size3d', randomRange),
        new BooleanField('sizeKeepRatio')
      ]),
      new EmitterModule(0x00100000, 0, 'Spawn box', [
        new Vector3BufferField('spawnExtents', periodicChange),
        new BooleanField('spawnWorldSpace')
      ]),
      new EmitterModule(0x00200000, 0, 'Spawn circle', [
        new Vector3BufferField('spawnInnerRadius', periodicChange),
        new Vector3BufferField('spawnOuterRadius', periodicChange),
        new BooleanField('spawnWorldSpace'),
        new BooleanField('spawnSurfaceOnly'),
        new Vector3Field('p0A8'),
        new FloatBufferField('spawnToLocalMatrix', matrixBuffer)
      ]),
      new EmitterModule(0x00400000, 0, 'Spawn sphere', [
        new Vector3BufferField('spawnInnerRadius', periodicChange),
        new BooleanField('spawnPositiveX'),
        new BooleanField('spawnNegativeX'),
        new BooleanField('spawnPositiveY'),
        new BooleanField('spawnNegativeY'),
        new BooleanField('spawnPositiveZ'),
        new BooleanField('spawnNegativeZ'),
        new BooleanField('spawnVelocity')
      ]),
      new EmitterModule(0x00800000, 0, 'Velocity (periodic)', [
        new Vector3BufferField('velocity', periodicChange),
        new BooleanField('velocityWorldSpace')
      ]),
      new EmitterModule(0x01000000, 0, 'Velocity (random)', [
        new Vector3BufferField('velocity', randomRange),
        new BooleanField('velocityWorldSpace')
      ]),
      new EmitterModule(0x02000000, 0, 'Velocity inherit (periodic)', [
        new FloatBufferField('velocityInheritScale', periodicChange)
      ]),
      new EmitterModule(0x04000000, 0, 'Velocity inherit (random)', [
        new FloatBufferField('velocityInheritScale', randomRange)
      ]),
      new EmitterModule(0x08000000, 0, 'Velocity spread', [
        new FloatBufferField('velocitySpreadScale', periodicChange),
        new BooleanField('velocitySpreadConserveMomentum')
      ]),
      new EmitterModule(0x10000000, 0, 'Texture initial frame (periodic)', [
        new FloatBufferField('textureAnimationInitialFrame', periodicChange)
      ]),
      new EmitterModule(0x20000000, 0, 'Texture initial frame (random)', [
        new FloatBufferField('textureAnimationInitialFrame', randomRange)
      ]),
      new EmitterModule(0x40000000, 0, 'Collision spawn', [
        new FloatField('collisionSpawnProbability'),
        new UInt32Field('collisionSpawnParentEmitterIndex')
      ]),
      new EmitterModule(0, 0x00000001, 'Velocity over life (set)', [
        new Vector3BufferField('velocityOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000002, 'Velocity over life (multiply)', [
        new Vector3BufferField('velocityOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000004, 'Acceleration (local)', [
        new Vector3BufferField('accelerationDirection', periodicChange),
        new FloatBufferField('accelerationScale', periodicChange)
      ]),
      new EmitterModule(0, 0x00000008, 'Acceleration (world)', [
        new Vector3BufferField('accelerationDirection', periodicChange),
        new FloatBufferField('accelerationScale', periodicChange)
      ]),
      new EmitterModule(0, 0x00000010, 'Alpha over life (set)', [
        new FloatBufferField('alphaOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000020, 'Alpha over life (multiply)', [
        new FloatBufferField('alphaOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000040, 'Color over life (set)', [
        new Vector3BufferField('colorOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000080, 'Color over life (multiply)', [
        new Vector3BufferField('colorOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000100, 'Rotation over life (set)', [
        new FloatBufferField('rotationOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000200, 'Rotation over life (multiply)', [
        new FloatBufferField('rotationOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000400, 'Rotation rate over life (set)', [
        new FloatBufferField('rotationRateOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00000800, 'Rotation rate over life (multiply)', [
        new FloatBufferField('rotationRateOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00001000, 'Size over life (set)', [
        new Vector2BufferField('sizeOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00002000, 'Size over life (multiply)', [
        new Vector2BufferField('sizeOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00004000, 'Rotation 3D over life (set)', [
        new Vector3BufferField('rotation3dOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00008000, 'Rotation 3D over life (multiply)', [
        new Vector3BufferField('rotation3dOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00010000, 'Rotation rate 3D over life (set)', [
        new Vector3BufferField('rotationRate3dOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00020000, 'Rotation rate 3D over life (multiply)', [
        new Vector3BufferField('rotationRate3dOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00040000, 'Size 3D over life (set)', [
        new Vector3BufferField('size3dOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00080000, 'Size 3D over life (multiply)', [
        new Vector3BufferField('size3dOverLife', periodicChange)
      ]),
      new EmitterModule(0, 0x00100000, 'Texture animation (mode 0)', [
        new FloatBufferField('textureAnimationSpeed', periodicChange)
      ]),
      new EmitterModule(0, 0x00200000, 'Texture animation (mode 1)', [
        new FloatBufferField('textureAnimationSpeed', periodicChange)
      ]),
      new EmitterModule(0, 0x00400000, 'Target', [
        new Vector3BufferField('targetPosition', periodicChange),
        new FloatBufferField('targetForceScale', periodicChange),
        new FloatBufferField('targetKillRadius', periodicChange),
        new FloatField('targetMaxForce')
      ]),
      new EmitterModule(0, 0x00800000, 'Target node', [
        new FloatBufferField('targetForceScale', periodicChange),
        new FloatBufferField('targetKillRadius', periodicChange),
        new FloatField('targetMaxForce')
      ]),
      new EmitterModule(0, 0x01000000, 'Velocity turbulize', [
        new Vector3BufferField('velocityTurbulizeScale', periodicChange),
        new FloatBufferField('velocityTurbulizeTimelifeLimit', periodicChange),
        new FloatField('velocityTurbulizeNoiseInterval'),
        new FloatField('velocityTurbulizeDuration')
      ]),
      new EmitterModule(0, 0x02000000, 'Alpha over effect', []),
      new EmitterModule(0, 0x04000000, 'Collision', [
        new UInt64Field('collisionTriggerGroupIndex'),
        new FloatField('collisionDynamicFriction'),
        new FloatField('collisionStaticFriction'),
        new FloatField('collisionRestitution'),
        new FloatField('collisionVelocityDampening'),
        new BooleanField('collisionDisableGravity'),
        new BooleanField('collisionUseGpu'),
        new FloatField('collisionRadius'),
        new BooleanField('collisionKillWhenCollide'),
        new UInt32Field('collisionSelfEmitterIndex')
      ]),
      new EmitterModule(0, 0x08000000, 'Alpha by distance', [
        new FloatField('alphaByDistanceFar'),
        new FloatField('alphaByDistanceNear')
      ]),
      new EmitterModule(0, 0, 'Unassigned', [
        new UInt32Field('p140'),
        new UInt32Field('p144'),
        new UInt32Field('p148')
      ])
    ]

    for (let module of modules) {
      module.loadModuleData(moduleData)
    }

    this.modules = modules
    console.log(this.modules)
  }

  buildModuleData() {
    const builder = new EmitterBuilder()
    
    if (this.modules !== null) {
      for (let module of this.modules) {
        module.buildModuleData(builder)
      }
    }

    return builder
  }
}
