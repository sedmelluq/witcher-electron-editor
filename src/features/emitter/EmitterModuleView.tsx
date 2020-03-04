import React from "react";
import EmitterModule from "./EmitterModule";
import { AnyFieldView } from "./FieldViews";

interface EmitterModuleProps {
  module: EmitterModule
}

export default class EmitterModuleView extends React.Component<EmitterModuleProps> {
  render() {
    if (this.props.module.enabled) {
      const fields: object[] = []

      for (const field of this.props.module.fields) {
        fields.push(<AnyFieldView key={field.propertyName} field={field}></AnyFieldView>)
      }

      return (
        <div>
          Module <strong>{this.props.module.name}</strong>
          <div style={{ margin:"10px" }}>
            {fields}
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}
