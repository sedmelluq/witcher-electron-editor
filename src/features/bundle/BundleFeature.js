import BundleView from './BundleView'
import React, { Component } from 'react'
import { observable } from 'mobx'

export default class BundleFeature {
  featureBarKey = 'B'

  @observable searchResult = "Perform a search"

  constructor(tcpClient) {
    this._tcpClient = tcpClient
  }

  createView() {
    return React.createElement(BundleView, { feature: this }, null)
  }

  search(input) {
    const searchNumber = parseInt(input)

    if (Number.isNaN(searchNumber)) {
      this.searchResult = "Not a number"
    } else if (this._tcpClient.connected) {
      this.searchResult = "Searching..."
      
      const searchMessage = Buffer.alloc(4)
      searchMessage.writeUInt32LE(searchNumber)

      this._tcpClient.request(10, searchMessage, this._handleSearchResultMessage)
    } else {
      this.searchResult = "Connection unavailable"
    }
  }

  _handleSearchResultMessage = (success, type, payload) => {
    if (!success) {
      this.searchResult = "Search failed"
      return;
    }

    const bundleNameLength = payload.readUInt32LE(0)
    const bundleName = payload.toString('utf8', 4, 4 + bundleNameLength)
    const fileNameLength = payload.readUInt32LE(4 + bundleNameLength)
    const fileName = payload.toString('utf8', 8 + bundleNameLength, 8 + bundleNameLength + fileNameLength)

    this.searchResult = fileName + " in " + bundleName
  }
}
