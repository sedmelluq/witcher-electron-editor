import React from 'react'
import ReactDOM from 'react-dom'
import Application from './Application'
import './index.css'
import CoreStore from './core/CoreStore';

const coreStore = new CoreStore()

ReactDOM.render(<Application core={coreStore}/>, (() => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
  return root
})())
