import { Field, FieldType } from "../../schema/Field.js";
import { tsImport } from "../../schema/ModuleConfig.js";
import Schema from "../../schema/Schema.js";
import { select } from "@strut/utils";
import AphroditeIntegration from "../AphroditeIntegration.js";

interface TypeGraphQLOptions {
  nullable: boolean;
  description: string;
}

export class TypeGraphQL implements AphroditeIntegration {
  private fieldsOrEdges: string[] = [];

  expose(fieldsOrEdges: string[]) {
    this.fieldsOrEdges = fieldsOrEdges;
    return this;
  }

  applyTo(schema: Schema): void {
    select(this.fieldsOrEdges, schema.getFields()).forEach((field) => {
      field?.decorator(this.createFieldDecorator(schema, field));
    });

    schema.getConfig().module.import(
      // TODO: clean up to be smart imports based on usage
      tsImport("{ Field, ObjectType, Int, Float, ID }", null, "type-graphql"),
      tsImport(null, null, "reflect-metadata")
    );

    schema
      .getConfig()
      .class.decorator(
        `@ObjectType({description: "${schema.getConfig().getDescription()}"})`
      );
  }

  private createFieldDecorator(schema: Schema, field: Field<FieldType>) {
    // TODO: add imports to the schema.
    const options = {} as TypeGraphQLOptions;
    options.nullable = !field.isRequired;
    options.description = field.description;

    let optionsString = "";
    if (Object.values(options).filter((x) => !!x).length > 0) {
      optionsString = `, {${options.nullable ? "nullable: true," : ""} ${
        options.description ? `description: '${options.description}'` : ""
      }}`;
    }

    const type = this.getGraphQLType(field);
    return `@Field(_ => ${type}${optionsString})`;
  }

  private getGraphQLType(field: Field<FieldType>): string {
    switch (field.storageType) {
      case "id":
        return "ID";
      case "boolean":
        return "Boolean";
      case "string":
        return "String";
      case "int32":
      // TODO: does typegraphql convert > 53 bit ints to strings for js?
      case "int64":
      case "uint64":
        return "Int";
      default:
        throw new Error(
          `${field.storageType} is not yet support by the TypeGraphQL integration`
        );
    }
  }
}

export default function tgql() {
  return new TypeGraphQL();
}
