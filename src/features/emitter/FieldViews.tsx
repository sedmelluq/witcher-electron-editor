import { FloatField, BaseField, Vector3Field, BaseBufferField, FloatBufferField, Vector3BufferField } from './FieldDefinitions'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

interface FieldValueProps<T> {
  field: T
}

@observer
export class FloatFieldView extends React.Component<FieldValueProps<FloatField>, any> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        { this.props.field.propertyName } (float): { this.props.field.value }
      </div>
    )
  }
}

@observer
export class Vector3FieldView extends React.Component<FieldValueProps<Vector3Field>, any> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        { this.props.field.propertyName } (Vector3): X { this.props.field.value.x } Y { this.props.field.value.y } Z { this.props.field.value.z }
      </div>
    )
  }
}

@observer
export class BufferFieldView<T> extends React.Component<FieldValueProps<BaseBufferField<T>>, any> {
  constructor(props) {
    super(props)
  }

  render() {
    const elements: object[] = []
    let type: string = null

    const field = this.props.field

    if (field instanceof FloatBufferField) {
      (field as FloatBufferField).value.forEach((element, index) => {
        elements.push(<div>[{index}] {element}</div>)
      })

      type = "float"
    } else if (field instanceof Vector3BufferField) {
      (field as Vector3BufferField).value.forEach((element, index) => {
        elements.push(<div>[{index}] X {element.x} Y {element.x} Z {element.x}</div>)
      })

      type = "Vector3"
    } else {
      type = "???"
    }

    return (
      <div>
        {this.props.field.propertyName} (float[{field.value.length}])
        <div style={{ margin: "10px" }}>{elements}</div>
      </div>
    )
  }
}

interface FieldViewProps {
  field: BaseField<{}>
}

export class AnyFieldView extends React.Component<FieldViewProps> {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.field instanceof FloatField) {
      return <FloatFieldView field={this.props.field}></FloatFieldView>
    } else if (this.props.field instanceof BaseBufferField) {
      return <BufferFieldView field={this.props.field}></BufferFieldView>
    } else {
      return (
        <div>
          { this.props.field.propertyName } (unknown type)
        </div>
      )
    }
  }
}
