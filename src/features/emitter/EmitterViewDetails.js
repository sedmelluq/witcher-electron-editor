import './EmitterViewDetails.css'
import React, { Component } from 'react'

export default class EmitterViewDetails extends React.Component {
  render() {
    if (!this.props.item) {
      return (
        <div className="emitter-details">
          <p>Nothing selected</p>
        </div>
      )
    }

    return (
      <div className="emitter-details">
        <h3>Name: {this.props.item.name}</h3>
        <h3>File: {this.props.item.source}</h3>
        <h3>Directory: {this.props.item.directory}</h3>
        <h3>Bundle: {this.props.item.bundle}</h3>
      </div>
    )
  }
}
