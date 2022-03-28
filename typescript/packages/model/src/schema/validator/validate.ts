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
