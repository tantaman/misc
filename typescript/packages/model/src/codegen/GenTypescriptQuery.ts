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
class ${this.schema.getQueryTypeName()} extends DerivedQuery {
  static create() {
    return new ${this.schema.getQueryTypeName()}(
      Factory.createSourceQueryFor(schema),
      new ModelLoadExpression(schema),
    );
  }

  ${this.getFilterMethodsCode()}
}
`,
    };
  }

  getFilterMethodsCode(): string {
    return "";
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
      new ModelLoadExpression(schema),
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
