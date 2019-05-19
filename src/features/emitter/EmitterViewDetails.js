import './EmitterViewDetails.css'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer
export default class EmitterViewDetails extends React.Component {
  render() {
    if (!this.props.emitter) {
      return (
        <div className="emitter-details">
          <p>Nothing selected</p>
        </div>
      )
    }

    return (
      <div className="emitter-details">
        <h3>Name: {this.props.emitter.metadata.name}</h3>
        <h3>File: {this.props.emitter.metadata.source}</h3>
        <h3>Directory: {this.props.emitter.metadata.directory}</h3>
        <h3>Bundle: {this.props.emitter.metadata.bundle}</h3>
        <p>{this.props.emitter.detailsState}</p>
      </div>
    )
  }
}
