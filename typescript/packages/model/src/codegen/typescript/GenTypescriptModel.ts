import { Edge, ForeignKeyEdge } from "../../schema/Edge.js";
import { asPropertyAccessor, upcaseAt } from "@strut/utils";
import CodegenStep from "../CodegenStep.js";
import { isValidPropertyAccessor } from "@strut/utils";
import { fieldToTsType } from "./tsUtils.js";
import { CodegenFile } from "../CodegenFile.js";
import TypescriptFile from "./TypescriptFile.js";
import { Node } from "../../schema/parser/SchemaType.js";

export default class GenTypescriptModel extends CodegenStep {
  static accepts(_schema: Node): boolean {
    return true;
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new TypescriptFile(
      this.schema.name + ".ts",
      `import Model, {Spec} from '@strut/model/Model.js';
import {SID_of} from '@strut/sid';
${this.getImportCode()}

export type Data = ${this.getDataShapeCode()};

${this.schema.extensions.type?.decorators?.join("\n")}
export default class ${this.schema.name}
  extends Model<Data> {
  ${this.getFieldCode()}
  ${this.getEdgeCode()}
}

${this.getSpecCode()}
`
    );
  }

  private getDataShapeCode(): string {
    const fieldProps = Object.values(this.schema.fields).map(
      (field) => `${asPropertyAccessor(field.name)}: ${fieldToTsType(field)}`
    );
    return `{
  ${fieldProps.join(",\n  ")}
}`;
  }

  private getImportCode(): string {
    const ret: string[] = [];
    for (const val of this.schema.extensions.module?.imports || []) {
      const name = val.name != null ? val.name + " " : "";
      const as = val.as != null ? "as " + val.as + " " : "";
      if (name === "") {
        ret.push(`import "${val.from}";`);
      } else {
        ret.push(`import ${name}${as}from '${val.from}';`);
      }
    }
    // for (const [_, edge] of Object.entries(this.schema.getEdges())) {
    //   ret.push(
    //     `import ${edge.getQueryTypeName()} from "./${edge.getQueryTypeName()}.js"`
    //   );
    //   ret.push(
    //     `import ${edge.getDest().getModelTypeName()} from "./${edge
    //       .getDest()
    //       .getModelTypeName()}.js"`
    //   );
    // }
    return ret.join("\n");
  }

  private getFieldCode(): string {
    return "";
    //     return Object.entries(this.schema.getFields())
    //       .map(
    //         ([key, field]) =>
    //           `  ${field.decorators.join("\n  ")}
    //   get ${key}(): ${fieldToTsType(field)} {
    //     return this.data${isValidPropertyAccessor(key) ? `.${key}` : `['${key}']`};
    //   }
    // `
    //       )
    //       .join("\n");
  }

  private getEdgeCode(): string {
    return "";
    //     return Object.entries(this.schema.getEdges())
    //       .map(
    //         ([key, edge]) =>
    //           `  query${upcaseAt(key, 0)}(): ${edge.getQueryTypeName()} {
    //     return ${edge.getQueryTypeName()}.${this.getFromMethodName(edge)}(
    //       this.id
    //     );
    //   }
    // `
    //       )
    //       .join("\n");
  }

  private getSpecCode(): string {
    return "";
    //     return `
    // export const spec: Spec<Data> = {
    //   createFrom(data: Data) {
    //     return new ${this.schema.getModelTypeName()}(data);
    //   },

    //   storageDescriptor: {
    //     nativeStorageType: "${this.schema.getConfig().storage.providerType}",
    //   },
    // }
    // `;
  }

  // TODO: not `fromFroeignId` but `fromForiegnKeyEdgeName` e.g., `fromSlideId`
  private getFromMethodName(edge: Edge): string {
    if (edge instanceof ForeignKeyEdge) {
      return `from${upcaseAt(edge.fieldName, 0)}`;
    }
    // Junction edges could be foreign id depending on what side of the junction we are
    return "fromId";
  }
}
