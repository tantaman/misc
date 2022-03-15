import { upcaseAt } from "@strut/utils";
import { getInverseForeignEdges } from "../schema/schemaUtils.js";
import { ForeignKeyEdge } from "../schema/Edge.js";
import { Field, FieldType } from "../schema/Field.js";
import Schema from "../schema/Schema.js";
import { CodegenFile } from "./CodegenFile.js";
import CodegenStep from "./CodegenStep.js";

export default class GenTypescriptQuery extends CodegenStep {
  constructor(private schema: Schema) {
    super();
  }

  // Nit:
  // we can technically return an array of files.
  // Since we can have edge data... so we'd need edge queries rather than a query per schema.
  // b/c structure on the edges...
  gen(): CodegenFile {
    return {
      name: this.schema.getQueryTypeName() + ".ts",
      contents: `import {DerivedQuery} from '@strut/model/query/Query';
import SourceQueryFactory from '@strut/model/query/SourceQueryFactory';
import {modelLoad, filter} from '@strut/model/query/Expression';
import {Predicate, default as P} from '@strut/model/query/Predicate';
import {ModelFieldGetter} from '@strut/model/query/Field';
import { SID_of } from '@strut/sid';
import ${this.schema.getModelTypeName()}, { Data, spec } from './${this.schema.getModelTypeName()}';
${this.getForeignKeyEdgeImports()}

export default class ${this.schema.getQueryTypeName()} extends DerivedQuery<Data, ${this.schema.getModelTypeName()}> {
  static create() {
    return new ${this.schema.getQueryTypeName()}(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom),
    );
  }
  ${this.getFromIdMethod()}
  ${this.getFromForeignIdMethods()}

  ${this.getFilterMethodsCode()}
}
`,
    };
  }

  private getFilterMethodsCode(): string {
    const ret: string[] = [];
    for (const [key, field] of Object.entries(this.schema.getFields())) {
      ret.push(`
      where${upcaseAt(key, 0)}(p: Predicate<Data["${key}"]>) {
        ${this.getFilterMethodBody(key, field)}
      }`);
    }
    return ret.join("\n");
  }

  private getFilterMethodBody(key: string, field: Field<FieldType>): string {
    return `return new ${this.schema.getQueryTypeName()}(
      this,
      filter(
        new ModelFieldGetter<"${key}", Data, ${this.schema.getModelTypeName()}>("${key}"),
        p,
      ), 
    )`;
  }

  private getFromIdMethod(): string {
    return `
static fromId(id: SID_of<${this.schema.getModelTypeName()}>) {
  return this.create().whereId(P.equals(id));
}
`;
  }

  private getFromForeignIdMethods(): string {
    const foreign = getInverseForeignEdges(this.schema.getEdges());

    return foreign.map(this.getFromForeignIdMethod).join("\n");
  }

  private getFromForeignIdMethod([key, edge]: [
    string,
    ForeignKeyEdge
  ]): string {
    return `
static from${upcaseAt(edge.fieldName, 0)}(id: SID_of<${edge
      .getDest()
      .getModelTypeName()}>) {
  return this.create().where${upcaseAt(edge.fieldName, 0)}(P.equals(id));
}
`;
  }

  private getForeignKeyEdgeImports(): string {
    const foreign = getInverseForeignEdges(this.schema.getEdges());

    return foreign
      .map(
        ([_, edge]) =>
          `import ${edge.getDest().getModelTypeName()} from "./${edge
            .getDest()
            .getModelTypeName()}"`
      )
      .join("\n");
  }
}

/*
Codegening the query shouldn't care what the underlying storage impl is.
Query layer is storage agnostic.

Thus we should use the `schema` to call into a `factory` which will construct the
`source query` / `source expression` based on the underlying storage type.
*/

/*
Derived query example:
SlideQuery extends DerivedQuery {
  static create() {
    return new SlideQuery(
      Factory.createSourceQueryFor(schema) // e.g., new SQLSourceQuery(schema),
      // convert raw db result into model load.
      // we'd want to move this expression to the end in plan optimizaiton.
      new ModelLoadExpression(Slide.createFromData)
    );
  }

  whereName(predicate: Predicate) {
    return new SlideQuery(
      this, // the prior query
      new ModelFilterExpression(field, predicate)
    );
  }
}
*/
