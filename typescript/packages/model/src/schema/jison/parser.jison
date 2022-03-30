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
  : PROPERTY_KEY id
    { $$ = [$1, $2] }
  ;

id
  : ID
    {$$ = yytext;}
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
  : name AS NODE nodeFields nodeFunctions