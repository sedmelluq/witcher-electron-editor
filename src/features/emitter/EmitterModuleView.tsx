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
        <div style={{ background: "#202020", border: "3px solid #444444", color: "#a0a0a0", margin: "10px", borderRadius: "5px" }}>
          <div style={{ padding: "10px", height: "17px", backgroundColor: "#181818", borderBottom: "3px solid #444444" }}><strong>{this.props.module.name}</strong></div>
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
