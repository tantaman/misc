/*
jison grammar.jison tokens.jisonlex 
*/

%%

main
  : propertyList entities ENDOFFILE
    { $$ = {pramble: $propertyList, entities: $entities} }

propertyList
  : propertyList property
    { $$ = $1.concat($2) }
  |
    { $$ = [] }
  ;

property
  : propertyKey name
    { $$ = [$1, $2] }
  ;

propertyKey
  : PROPERTY_KEY
    { $$ = yytext }
  ;

entities
  : entities node
    { $$ = $1.concat($2) }
  | entities edge
    { $$ = $1.concat($2) }
  | entities nodeTrait
    { $$ = $1.concat($2) }
  |
    { $$ = [] }
  ;

node
  : name AS KW_NODE nodeFields nodeFunctions
    {{
      $$ = {
        type: "node",
        name: $name,
        fields: $nodeFields || []
        extensions: $nodeFunctions || []
      }
    }}
  ;

edge
  : name AS KW_EDGE L_ANGLE src COMMA dest R_ANGLE edgeFields edgeFunctions
    {{
      $$ = {
        type: "edge",
        src: {
          type: $src
        },
        dest: {
          type: $dest
        },
        name: $name,
        fields: $edgeFields || [],
        extensions: $edgeFunctions || []
      }
    }}
  ;

nodeTrait
  : name AS NODE_TRAIT nodeFields nodeFunctions
    {{
      $$ = {
        type: "nodeTrait",
        name: $name,
        fields: $nodeFields || []
        extensions: $nodeFunctions || []
      }
    }}
  ;

name
  : ID
    {$$ = yytext}
  ;

nodeFields
  : L_SQUIG fieldDeclarations R_SQUIG
    {$$ = $fieldDeclarations}
  ;

nodeFunctions
  :
    { $$ = [] }
  | nodeFunctions AMP nodeFunction
    { $$ = $1.concat($2) }
  ;

fieldDeclarations
  : 
    { $$ = [] }
  | fieldDeclarations fieldDeclaration
    { $$ = $1.concat($2) }
  ;

fieldDeclaration
  : propertyKey fieldType
    {{
      $$ = {
        name: $propertyKey,
        ...$fieldType
      }
    }}
  ;

fieldType
  : nonCompositeFieldType
  | compositeFieldType
  ;

nonCompositeFieldType
  : idField
  | naturalLanguageField
  | enumField
  | timeField
  | currencyField
  | primitiveField
  ;

compositeFieldType
  : arrayField
  | mapField
  ;

arrayField
  : KW_ARRAY L_ANGLE fieldType R_ANGLE
    {{
      $$ = {
        type: "array",
        values: $fieldType
      }
    }}
  ;

mapField
  : KW_MAP L_ANGLE nonCompositeFieldType COMMA fieldType R_ANGLE
    {{
      $$ = {
        type: "map",
        keys: $nonCompositeFieldType,
        values: $fieldType
      }
    }}
  ;

idField
  : KW_ID L_ANGLE name R_ANGLE
    { $$ = {type: "id", of: $name} }
  ;

naturalLanguageField
  : KW_NATURAL_LANGUAGE
    { $$ = {type: "naturalLanguage} }
  ;

enumField
  : KW_ENUMERATION L_ANGLE enumKeys R_ANGLE
    { $$ = {type: "enumeration", keys: $enumKeys } }
  ;

enumKeys
  : name
    { $$ = [$name] }
  | enumKeys PIPE name
    { $$ = $1.concat($3) }
  ;

bitmaskField
  : KW_BITMASK L_ANGLE enumKeys R_ANGLE
    { $$ = {type: "bitmask", keys: $enumKeys} }
  ;

timeField
  : KW_TIMESTAMP

/*
^^ this'll be problematic as the tokenizer will tokenize if the user names a node or edge after a kw.
Ohm? https://nextjournal.com/dubroy/ohm-parsing-made-easy
*/