import { observable } from 'mobx'
import TcpClient from './TcpClient'
import EmitterFeature from '../features/emitter/EmitterFeature'
import BundleFeature from '../features/bundle/BundleFeature'

export default class CoreStore {
  tcpClient = new TcpClient('localhost', 3548)
  
  features = [
    new EmitterFeature(this.tcpClient),
    new BundleFeature(this.tcpClient)
  ]
}
