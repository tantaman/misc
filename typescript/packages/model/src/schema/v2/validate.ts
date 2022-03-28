import { SchemaFile } from "../parser/SchemaType.js";

export type ValidationError = {
  message: string;
  severity: "warning" | "advice" | "error";
  type:
    | "duplicate-nodes"
    | "duplicate-edges"
    | "duplicate-fields"
    | "duplicate-ob-edges"
    | "duplicate-ib-edges"
    | "duplicate-extensions";
};

export default function validate(schemaFile: SchemaFile): ValidationError[] {
  return [];
}

export function stopsCodegen(error: ValidationError): boolean {
  return error.severity === "error";
}
