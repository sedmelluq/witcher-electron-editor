import './StatusBar.css'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer
export default class StatusBar extends React.Component {
  render() {
    return (
      <div className="status-bar">
        <div className={'status-bar-indicator' + (this.props.tcpClient.connected ? ' connected' : ' disconnected')}></div>
        <div className="status-bar-message">{this.props.tcpClient.connectionMessage}</div>
      </div>
    )
  }
}
