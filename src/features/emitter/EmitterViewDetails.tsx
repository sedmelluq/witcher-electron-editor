import './EmitterViewDetails.css'
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import EmitterInfo from './EmitterInfo'
import EmitterModuleView from './EmitterModuleView'

interface EmitterViewDetailsProperties {
  emitter: EmitterInfo
}

@observer
export default class EmitterViewDetails extends React.Component<EmitterViewDetailsProperties, any> {
  constructor(props) {
    super(props)
  }

  render() {
    if (!this.props.emitter) {
      return (
        <div className="emitter-details flex-remaining-width">
          <p>Nothing selected</p>
        </div>
      )
    }

    const modules = this.props.emitter.modules
    const moduleViews: object[] = []

    if (modules) {
      for (const item of modules) {
        moduleViews.push(
          <EmitterModuleView key={item.name} module={item}></EmitterModuleView>
        )
      }
    }

    return (
      <div className="emitter-details flex-remaining-width scrollable">
        <h3>Name: {this.props.emitter.metadata.name}</h3>
        <h3>File: {this.props.emitter.metadata.source}</h3>
        <h3>Directory: {this.props.emitter.metadata.directory}</h3>
        <h3>Bundle: {this.props.emitter.metadata.bundle}</h3>
        <p>{this.props.emitter.detailsState}</p>
        {moduleViews}
      </div>
    )
  }
}
