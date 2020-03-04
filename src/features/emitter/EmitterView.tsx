import './EmitterView.css'
import EmitterViewDetails from './EmitterViewDetails'
import EmitterViewList from './EmitterViewList'
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import EmitterFeature from './EmitterFeature'

interface EmitterViewProperties {
  feature: EmitterFeature
}

@observer
export default class EmitterView extends React.Component<EmitterViewProperties, any> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="flex-has-columns flex-remaining-width">
        <EmitterViewList feature={this.props.feature} selected="" />
        <EmitterViewDetails emitter={this.props.feature.selectedEmitter} />
      </div>
    )
  }
}
