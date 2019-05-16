import './FeatureBar.css'
import React, { Component } from 'react'

export default class FeatureBar extends React.Component {
  render() {
    return (
      <div className="feature-bar">
        <ul>
        {this.props.features.map((item, index) => (
          <li key={item.featureBarKey} onClick={this._handleClick} data-id={item.featureBarKey} className={this.props.selectedFeatureKey == item.featureBarKey ? "selected" : "unselected"}>
            {item.featureBarKey}
          </li>
        ))}
        </ul>
      </div>
    )
  }

  _handleClick = (event) => {
    let clickedKey = event.currentTarget.dataset.id
    this.props.updateSelection(clickedKey)
  }
}
