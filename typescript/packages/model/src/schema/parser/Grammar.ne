# Parse Aphrodite schemas
# This is all well and good... but wouldn't it be easier if we could invert templates instead?
@builtin "whitespace.ne"
@builtin "number.ne"

main -> _ preamble _ entities _ {% ([ws, preamble, ws2, entities]) => ({
  preamble,
  entities
}) %}

preamble -> ((engineDeclaration dbDeclaration) | (dbDeclaration engineDeclaration)) {% ([[[engineOrDb, dbOrEngine]]]) => ({
  engine: engineOrDb.type === "engine" ? engineOrDb.name : dbOrEngine.name,
  db: engineOrDb.type === "db" ? engineOrDb.name : dbOrEngine.name
}) %}

engineDeclaration -> "storageEngine:" inlineSpace engine "\n" {% ([keyword, ws, [name]]) => ({type: "engine", name}) %}
dbDeclaration -> "dbName:" inlineSpace dbName "\n" {% ([keyword, ws, name]) => ({type: "db", name}) %}
engine -> "postgres" # | "mysql" | "neo4j" | "redis" | "redis-graph" | "singlestore" | "mariadb" | "gremlin" | "opencypher"
dbName -> [a-zA-Z0-9]:+ {% d => d[0].join("") %}

entities -> null | entities node {% ([e, node]) => (e.concat(node)) %} | entities edge {% ([e, edge]) => (e.concat(edge)) %}

node -> "Node<" _ name _ ">" _ nodeFields _ nodeFunctions {% ([kw, ws, name, ws2, kw2, ws3, fields, ws4, funcs]) => ({
  type: "node",
  name,
  fields,
  funcs: funcs || []
}) %}

edge -> "Edge<" _ name _ "," _ name _ ">" _ "as" _ name _ edgeFields _ edgeFunctions {%
  ([_kw, _ws, src, _ws2, _kw2, _ws3, dest, _ws4, _kw3, _ws5, _kw4, _ws6, name, fields, ws6, funcs]) => ({
    type: "edge",
    src,
    dest,
    name,
    fields,
    funcs: funcs || []
  })
%}
name -> [a-zA-Z_] [a-zA-Z0-9_]:* {% ([pre, post]) => pre + post.join("") %}

nodeFields -> "{" _ fieldDeclarations "}" {% ([_kw, _ws, decl]) => decl %}
nodeFunctions -> null | nodeFunctions "|" _ nodeFunction _ {% ([e, _kw, _ws, func]) => e.concat(func) %}

fieldDeclarations -> null | fieldDeclaration | fieldDeclarations fieldDeclaration {% ([e, declaration]) => e.concat(declaration) %}
fieldDeclaration -> name ":" _ fieldType "\n" _ {% ([name, _kw, _ws, [[definition]]]) => ({
  name,
  ...definition
}) %}

fieldType -> nonCompositeFieldType | compositeFieldType
nonCompositeFieldType -> idField | naturalLanguageField | enumField | timeField | currencyField | primitiveField

compositeFieldType -> arrayField | mapField
arrayField -> "Array<" _ fieldType _ ">" {% ([_kw, _ws, [[values]]]) => ({type: "array", values}) %}
mapField -> "Map<" _ nonCompositeFieldType _ "," _ fieldType _ ">" {%
  ([_kw, _ws, [keys], _ws2, _kw2, _ws3, [[values]]]) => ({type: "map", keys, values})
%}

idField -> "ID<" _ name _ ">" {% ([_kw, _ws, of]) => ({type: "id", of }) %}
naturalLanguageField -> "NaturalLanguage<string>" {% () => ({type: "naturalLanguage"}) %}
enumField -> "Enumeration<" _ enumKeys _ ">" {% ([_kw, _ws, keys]) => ({type: "enumeration", keys}) %}
enumKeys -> name | enumKeys _ "|" _ name {% ([e, _ws, _kw, _ws2, key]) => (e.concat(key)) %}
timeField -> "Timestamp" {% () => ({type: "timestamp"}) %}
currencyField -> "Currency<" _ name _ ">" {% ([_kw, _ws, denomination]) => ({type: "currency", denomination}) %}
primitiveField -> "bool" | "int32" | "int64" | "float32" | "float64" | "uint32" | "uint64" | "string" {%
  ([subtype]) => ({type: "primitive", subtype})
%}

nodeFunction -> "OutboundEdges" _ "{" _ edgeDeclarations "}" {% ([_kw, _ws, _kw2, _ws2, declarations]) => ({name: "outboundEdges", declarations}) %}
  | "InboundEdges" _ "{" _ edgeDeclarations "}" {% ([_kw, _ws, _kw2, _ws2, declarations]) => ({name: "inboundEdges", declarations}) %}
  | "Index" _ "{" _ indices "}" {% ([_kw, _ws, _kw2, _ws2, declarations]) => ({name: "index", declarations}) %}
  | "ReadPrivacy" _ "{" _ privacyPolicy "}"

edgeDeclarations -> null | edgeDeclaration | edgeDeclarations edgeDeclaration {% ([e, decl]) => e.concat(decl) %}
edgeDeclaration -> _ name ":" _ (
  inlineEdgeDefinition {% ([definition]) => definition %}
  | name "\n" {% ([reference]) => ({type: "edgeReference", reference}) %}
) {% ([_ws, name, _kw, _ws2, definition]) => ({
  name,
  ...definition
}) %}

inlineEdgeDefinition -> "Edge<" _ nameOrResolution _ ("," _ nameOrResolution _):? ">\n" _ {%
  ([_kw, _ws, src, _ws2, dest]) => ({
    type: "edge",
    src,
    dest: dest != null ? dest[2] : null,
  })
%}

nameOrResolution -> name {% ([type]) => ({type}) %} | name "." name {% ([type, _kw, column]) => ({type, column}) %}

indices -> null | indexDeclaration | indices indexDeclaration {% ([e, index]) => e.concat(index) %}
indexDeclaration -> _ (name ":" _ index | name) "\n" {% ([_ws, [name, _kw, _ws2, index, shortDef]]) => ({
  name,
  ...(index == null
    ? {type: "nonUnique", columns: [name]}
    : shortDef != null
      ? {type: "nonUnique", columns: shortDef}
      : index)
}) %}
index -> "unique(" _ nameList _ ")" {% ([_kw, _ws, columns]) => ({type: "unique", columns}) %}
  | nameList {% ([columns]) => ({type: "nonUnique", columns}) %}

nameList -> name | nameList _ "," _ name {% ([e, _ws, _kw, _ws2, name]) => e.concat(name) %}

privacyPolicy -> null

edgeFields -> "{" _  fieldDeclarations "}" {% () => [] %}
edgeFunctions -> null | edgeFunctions "|" _ edgeFunction _

edgeFunction -> "Index" _ "{" _ indices "}" | "Invert" _ "as" _ name


inlineSpace -> [ \t\v\f]:* {% (_) => null %}

# DSL Alternative
# const Person = node('Person');
# Person.fields({
#   id: ID(Person),
#   name: NaturalLanguage('string'),
#   walletId: ID(Wallet)
# }).outboundEdges({
#   wallet: Edge<Person.walletId>,
#   friends: Edge<Person, Person>
# }).inboundEdges({
#   ...
# }).index({
#   ...
# }).storageOverrides({})