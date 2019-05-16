import './BundleView.css'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer
export default class BundleView extends React.Component {
  _onKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.props.feature.search(this.textInput.value)
    }
  }

  render() {
    return (
      <div className="bundle-root">
        <input type="text" onKeyDown={this._onKeyDown} ref={(input) => this.textInput = input} />
        <br />
        <span>{this.props.feature.searchResult}</span>
      </div>
    )
  }
}
