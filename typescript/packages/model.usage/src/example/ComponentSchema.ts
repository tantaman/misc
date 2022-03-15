import Edge from "@strut/model/schema/Edge.js";
import Field from "@strut/model/schema/Field.js";
import Schema from "@strut/model/schema/Schema.js";
import SchemaConfig from "@strut/model/schema/SchemaConfig.js";
import SlideSchema from "./SlideSchema.js";

export default class ComponentSchema extends Schema {
  config(config: SchemaConfig) {
    config.description("Represents a component that is placed on a slide");
  }

  fields() {
    return {
      id: Field.id.sid(),
      selected: Field.bool(),
      classes: Field.stringOf("CssClass"),
      style: Field.map(
        Field.stringOf("CssAttribute"),
        Field.stringOf("CssValue")
      ),
    };
  }

  edges() {
    return {
      slide: Edge.field(SlideSchema).inverse(
        Edge.foreignKey(ComponentSchema, "slide")
      ),
    };
  }
}
