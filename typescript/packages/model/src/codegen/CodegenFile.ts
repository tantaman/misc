import md5 from "md5";

export type CodegenFile = {
  readonly name: string;
  readonly contents: string;
};

export const ALGOL_TEMPLATE = "// SIGNED-SOURCE: <>\n";

export function sign(content: string, template: string) {
  return `${template.replace("<>", "<" + md5(content) + ">")}${content}`;
}
