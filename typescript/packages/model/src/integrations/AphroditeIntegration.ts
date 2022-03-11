import Schema from "../schema/Schema.js";

export default interface AphroditeIntegration {
  applyTo(schema: Schema): void;
}
