import './Application.css'
import React, { Component } from 'react'
import FeatureBar from './bars/feature/FeatureBar'
import StatusBar from './bars/status/StatusBar'
import Titlebar from 'react-electron-titlebar'
import CoreStore from './core/CoreStore'

interface ApplicationProps {
  core: CoreStore
}

interface ApplicationState {
  selectedFeatureKey: String
}

export default class Application extends React.Component<ApplicationProps, ApplicationState> {
  constructor(props) {
    super(props)

    this.state = {
      selectedFeatureKey: this.props.core.features.find((feature) => { return feature.featureBarKey }).featureBarKey
    };
  }

  updateFeatureSelection = (selection) => {
    this.setState({
      selectedFeatureKey: selection
    })
  }

  render() {
    let feature = this.props.core.features.find((feature) => { return feature.featureBarKey == this.state.selectedFeatureKey })
    let featureView = feature.createView()

    return (
      <div className="application flex-has-rows">
        <Titlebar title="The editor thingy" backgroundColor="#343434" className="title-bar" />

        <div className="flex-has-columns flex-remaining-height">
          <FeatureBar features={this.props.core.features} selectedFeatureKey={this.state.selectedFeatureKey} updateSelection={this.updateFeatureSelection} />
          {featureView}
        </div>

        <StatusBar tcpClient={this.props.core.tcpClient} />
      </div>
    )
  }
}
