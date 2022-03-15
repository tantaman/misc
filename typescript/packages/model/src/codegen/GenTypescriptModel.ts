import Schema from "../schema/Schema.js";
import { Edge, ForeignKeyEdge } from "../schema/Edge.js";
import { upcaseAt } from "@strut/utils";
import CodegenStep from "./CodegenStep.js";
import { isValidPropertyAccessor } from "@strut/utils";
import { fieldToTsType } from "./tsUtils.js";
import { CodegenFile } from "./CodegenFile.js";

export default class GenTypescriptModel extends CodegenStep {
  constructor(private schema: Schema) {
    super();
  }

  gen(): CodegenFile {
    return {
      name: this.schema.getModelTypeName() + ".ts",
      contents: `import Model from '@strut/model/Model.js';
${this.getImportCode()}

export type Data = ${this.getDataShape()};

${this.schema.getConfig().class.decorators.join("\n")}
export default class ${this.schema.getModelTypeName()}
  extends Model<Data> {
  ${this.getFieldCode()}
  ${this.getEdgeCode()}
}

${this.getSpecCode()}
`,
    };
  }

  private getDataShape(): string {
    const props = Object.entries(this.schema.getFields()).map(
      ([key, field]) =>
        `${isValidPropertyAccessor(key) ? key : `'${key}'`}: ${fieldToTsType(
          field
        )}`
    );
    return `{
  ${props.join(",\n  ")}
}`;
  }

  private getImportCode(): string {
    const ret: string[] = [];
    for (const val of this.schema.getConfig().module.imports.values()) {
      const name = val.name != null ? val.name + " " : "";
      const as = val.as != null ? "as " + val.as + " " : "";
      ret.push(`import ${name}${as}from '${val.from}'`);
    }
    for (const [_, edge] of Object.entries(this.schema.getEdges())) {
      ret.push(
        `import ${edge.getQueryTypeName()} from "./${edge.getQueryTypeName()}.js"`
      );
    }
    return ret.join("\n");
  }

  private getFieldCode(): string {
    return Object.entries(this.schema.getFields())
      .map(
        ([key, field]) =>
          `  ${field.decorators.join("\n  ")}
  get ${key}(): ${fieldToTsType(field)} {
    return this.data${isValidPropertyAccessor(key) ? `.${key}` : `['${key}']`};
  }
`
      )
      .join("\n");
  }

  private getEdgeCode(): string {
    return Object.entries(this.schema.getEdges())
      .map(
        ([key, edge]) =>
          `  query${upcaseAt(key, 0)}(): ${edge.getQueryTypeName()} {
    return ${edge.getQueryTypeName()}.${this.getFromMethodName(edge)}(
      ${this.getIdGetter(key, edge)}
    );
  }
`
      )
      .join("\n");
  }

  private getSpecCode(): string {
    return `
export const spec = {
  createFrom(data: Data) {
    return new ${this.schema.getModelTypeName()}(data);
  },

  nativeStorageType: "${this.schema.getConfig().storage.providerType}",
}
`;
  }

  private getFromMethodName(edge: Edge): string {
    if (edge instanceof ForeignKeyEdge) {
      return "fromForeignId";
    }
    // Junction edges could be foreign id depending on what side of the junction we are
    return "fromId";
  }

  private getIdGetter(key, edge: Edge): string {
    if (edge instanceof ForeignKeyEdge) {
      return `this.id, '${edge.inverse.name}'`;
    } else {
      return `this.${key}Id`;
    }
  }
}
