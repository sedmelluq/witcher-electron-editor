import './EmitterView.css'
import EmitterViewDetails from './EmitterViewDetails'
import EmitterViewList from './EmitterViewList'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer
export default class EmitterView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="emitter-root">
        <EmitterViewList feature={this.props.feature} />
        <EmitterViewDetails item={this.props.feature.selectedEmitter} />
      </div>
    )
  }
}
