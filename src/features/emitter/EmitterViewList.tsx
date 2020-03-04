import './EmitterViewList.css'
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import EmitterFeature from './EmitterFeature'

interface EmitterViewListProperties {
  feature: EmitterFeature,
  selected: String
}

@observer
export default class EmitterViewList extends React.Component<EmitterViewListProperties> {
  constructor(props) {
    super(props)
  }

  handleClick = (event) => {
    let emitterName = event.currentTarget.dataset.id
    this.props.feature.selectEmitter(emitterName)
  }

  render() {
    const sortedEmitters = Object.values(this.props.feature.emitters)
    sortedEmitters.sort((a, b) => a.name.localeCompare(b.name))

    return (
      <div className="emitter-list scrollable">
        <ul>
        {sortedEmitters.map((item, index) => (
          <li key={item.name} onClick={this.handleClick} data-id={item.name} className={this.props.selected == item.name ? "selected" : "unselected"}>
            <div className="emitter-list-name">{item.name}</div>
            <div className="emitter-list-source">{item.metadata.source}</div>
          </li>
        ))}
        </ul>
      </div>
    )
  }
}
