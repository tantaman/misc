import { CodegenFile, SQL_TEMPLATE, sign } from "../CodegenFile.js";
// @ts-ignore
import prettier from "prettier";

export default class MySqlFile implements CodegenFile {
  #contents: string;

  constructor(public readonly name: string, contents: string) {
    this.#contents = contents;
  }

  get contents(): string {
    return sign(
      // todo: use https://github.com/zeroturnaround/sql-formatter
      prettier.format(this.#contents, {
        plugins: ["prettier-plugin-sql"],
      }),
      SQL_TEMPLATE
    );
  }
}
