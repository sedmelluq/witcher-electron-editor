import EmitterModule from './EmitterModule'
import { observable } from 'mobx';
import { BufferSizePolicy, FloatBufferField, Vector2BufferField, Vector3BufferField, FloatField, BooleanField, Vector3Field, UInt32Field } from './FieldDefinitions';

export default class EmitterInfo {
  @observable public detailsState: string = 'notloaded'
  public details: object = null
  public name: string
  public metadata: object
  public modules: Array<EmitterModule>

  constructor(metadata: object) {
    this.name = metadata['name'] as string
    this.metadata = metadata
    this.details = null
    this.modules = null
  }

  loadDetails(moduleData: object) {
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
      new EmitterModule(0x10000000, 0, 'Init ??? (periodic)', [
        new FloatBufferField('p134', periodicChange)
      ]),
      new EmitterModule(0x20000000, 0, 'Init ??? (random)', [
        new FloatBufferField('p134', randomRange)
      ]),
      new EmitterModule(0x40000000, 0, 'Collision spawn', [
        new UInt32Field('collisionSpawnParentEmitterIndex')
      ])
    ]

    for (let module of modules) {
      module.loadValues(moduleData)
    }

    this.modules = modules
    console.log(this.modules)
  }
}
