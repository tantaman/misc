import Schema from "schema/Schema";
import { SourceQuery } from "../Query";
import SQLSourceExpression, { SQLResult } from "./SQLSourceExpression";

export default class SQLSourceQuery extends SourceQuery<SQLResult> {
  constructor(schema: Schema) {
    super(new SQLSourceExpression(schema, { what: "model" }));
  }
}
