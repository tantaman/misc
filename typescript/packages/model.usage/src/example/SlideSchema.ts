import Schema from "@strut/model/schema/Schema.js";
import Edge from "@strut/model/schema/Edge.js";
import ComponentSchema from "./ComponentSchema.js";
import Field from "@strut/model/schema/Field.js";
import DeckSchema from "./DeckSchema.js";
import TypeGraphQL from "@strut/model/integrations/type_graphql/TypeGraphQL.js";
import SchemaConfig from "@strut/model/schema/SchemaConfig.js";

export default class SlideSchema extends Schema {
  config(config: SchemaConfig) {
    config.description("Represents a single slide within a deck");
  }

  edges() {
    return {
      components: Edge.foreignKey(ComponentSchema, "slide"),
      deck: Edge.field(DeckSchema).inverse(
        Edge.foreignKey(SlideSchema, "deck")
      ),
    };
  }

  fields() {
    return {
      id: Field.id.guid(),
      selected: Field.bool(),
      focused: Field.bool(),
      classes: Field.stringOf("CssClass"),
      style: Field.map(
        Field.stringOf("CssAttribute"),
        Field.stringOf("CssValue")
      ),
      deckId: Field.id.int(),
    };
  }

  integrations() {
    return [TypeGraphQL().expose(["id", "selected", "focused", "classes"])];
  }
}
