import { upcaseAt } from "@strut/utils";
import { getInverseForeignEdges } from "../../schema/schemaUtils.js";
import { Edge, ForeignKeyEdge } from "../../schema/Edge.js";
import Schema from "../../schema/Schema.js";
import { CodegenFile } from "../CodegenFile.js";
import CodegenStep from "../CodegenStep.js";
import FieldAndEdgeBase from "schema/FieldAndEdgeBase.js";
import TypescriptFile from "./TypescriptFile.js";

export default class GenTypescriptQuery extends CodegenStep {
  static accepts(_schema: Schema): boolean {
    return true;
  }

  constructor(private schema: Schema) {
    super();
  }

  // Nit:
  // we can technically return an array of files.
  // Since we can have edge data... so we'd need edge queries rather than a query per schema.
  // b/c structure on the edges...
  // TODO: de-duplicate imports by storing imports in an intermediate structure.
  gen(): CodegenFile {
    return new TypescriptFile(
      this.schema.getQueryTypeName() + ".ts",
      `import {DerivedQuery} from '@strut/model/query/Query.js';
import QueryFactory from '@strut/model/query/QueryFactory.js';
import {modelLoad, filter} from '@strut/model/query/Expression.js';
import {Predicate, default as P} from '@strut/model/query/Predicate.js';
import {ModelFieldGetter} from '@strut/model/query/Field.js';
import { SID_of } from '@strut/sid';
import ${this.schema.getModelTypeName()}, { Data, spec } from './${this.schema.getModelTypeName()}.js';
${this.getForeignKeyEdgeImports()}
${this.getEdgeImports()}

export default class ${this.schema.getQueryTypeName()} extends DerivedQuery<${this.schema.getModelTypeName()}> {
  static create() {
    return new ${this.schema.getQueryTypeName()}(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom),
    );
  }
  ${this.getFromIdMethodCode()}
  ${this.getFromForeignIdMethodsCode()}

  ${this.getFilterMethodsCode()}
  ${this.getHopMethodsCode()}
}
`
    );
  }

  private getFilterMethodsCode(): string {
    const ret: string[] = [];
    const fields = Object.entries(this.schema.getFields());
    const edges = getInverseForeignEdges(this.schema.getEdges());
    const combined: [string, FieldAndEdgeBase][] = [...fields, ...edges];
    for (const [key, field] of combined) {
      ret.push(`
      where${upcaseAt(field.fieldName, 0)}(p: Predicate<Data["${
        field.fieldName
      }"]>) {
        ${this.getFilterMethodBody(key, field)}
      }`);
    }
    return ret.join("\n");
  }

  private getFilterMethodBody(key: string, field: FieldAndEdgeBase): string {
    return `return new ${this.schema.getQueryTypeName()}(
      this,
      filter(
        new ModelFieldGetter<"${
          field.fieldName
        }", Data, ${this.schema.getModelTypeName()}>("${field.fieldName}"),
        p,
      ), 
    )`;
  }

  private getFromIdMethodCode(): string {
    return `
static fromId(id: SID_of<${this.schema.getModelTypeName()}>) {
  return this.create().whereId(P.equals(id));
}
`;
  }

  private getFromForeignIdMethodsCode(): string {
    const foreign = getInverseForeignEdges(this.schema.getEdges());

    return foreign.map(this.getFromForeignIdMethodCode).join("\n");
  }

  private getFromForeignIdMethodCode([key, edge]: [
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
            .getModelTypeName()}.js"`
      )
      .join("\n");
  }

  private getEdgeImports(): string {
    return Object.values(this.schema.getEdges())
      .map(
        (edge) =>
          `import {spec as ${edge
            .getDest()
            .getModelTypeName()}Spec} from "./${edge
            .getDest()
            .getModelTypeName()}.js"
          import ${edge.getQueryTypeName()} from "./${edge.getQueryTypeName()}"`
      )
      .join("\n");
  }

  private getHopMethodsCode(): string {
    // hop methods are edges
    // e.g., Deck.querySlides().queryComponents()
    return Object.values(this.schema.getEdges())
      .map((edge) => this.getHopMethod(edge))
      .join("\n");
  }

  private getHopMethod(edge: Edge): string {
    return `query${upcaseAt(edge.name, 0)}(): ${edge.getQueryTypeName()} {
      return new ${edge.getQueryTypeName()}(QueryFactory.createHopQueryFor(this, spec, ${edge
      .getDest()
      .getModelTypeName()}Spec),
      modelLoad(${edge.getDest().getModelTypeName()}Spec.createFrom),
      );
    }`;
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
