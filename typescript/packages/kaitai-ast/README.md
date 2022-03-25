# About

We have grammars that we can convert into parsers.
Those parsers give us an AST.

But often we want a series of structs in our target language.

Kaitai-ast allows us to write a declarative set of rules to convert an AST to a series of structs. Inspired by [Kaitai Struct](https://kaitai.io/) which does the same for binary data.

# Potential format:
Could we literally just use the kaitai struct format but the input source is instead an ast?
And instead of taking "n bytes" we take a token and cast it to the desired type?

Well the AST can be arbitrarily ordered.

```

```