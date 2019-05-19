import { observable } from 'mobx';

export default class EmitterInfo {
  @observable detailsState = "notloaded"

  constructor(metadata) {
    this.name = metadata.name
    this.metadata = metadata
    this.details = null
  }
}
