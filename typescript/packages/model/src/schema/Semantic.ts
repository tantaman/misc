/*

We have to import semantic types do we not?

Field("int")

Semantic("typename", import())
  .storageType(Field(...));

And getter would return `typename` which is resolved by `import`.
Under the hood we'd save via `storageType`

These should be aliases and not require conversion...

If they require conversion we need to know if it is an
_identity conversion_ or an actual process as the latter
would impact query optimization.
*/

// import { tsImport } from "../../schema/ModuleConfig.js";
