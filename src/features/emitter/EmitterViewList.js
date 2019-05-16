import './EmitterViewList.css'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer
export default class EmitterViewList extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick = (event) => {
    let emitterName = event.currentTarget.dataset.id
    this.props.feature.selectEmitter(emitterName)
  }

  render() {
    return (
      <div className="emitter-list">
        <ul>
        {this.props.feature.emitters.map((item, index) => (
          <li key={item.name} onClick={this.handleClick} data-id={item.name} className={this.props.selected == item.name ? "selected" : "unselected"}>
            <div className="emitter-list-name">{item.name}</div>
            <div className="emitter-list-source">{item.source}</div>
          </li>
        ))}
        </ul>
      </div>
    )
  }
}
