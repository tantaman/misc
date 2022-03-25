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
  funcs
}) %}

edge -> "Edge<" _ name _ "," _ name _ ">" _ "as" _ name _ edgeFields _ edgeFunctions {%
  ([_kw, _ws, src, _ws2, _kw2, _ws3, dest, _ws4, _kw3, _ws5, _kw4, _ws6, name, fields, ws6, funcs]) => ({
    type: "edge",
    src,
    dest,
    name,
    fields,
    funcs
  })
%}
name -> [a-zA-Z_] [a-zA-Z0-9_]:* {% ([pre, post]) => pre + post.join("") %}

nodeFields -> "{" _ fieldDeclarations "}" {% ([_kw, _ws, decl]) => decl %}
nodeFunctions -> null | nodeFunctions "|" _ nodeFunction _

fieldDeclarations -> fieldDeclaration | fieldDeclarations fieldDeclaration {% ([e, declaration]) => e.concat(declaration) %}
fieldDeclaration -> name ":" _ fieldType "\n" _ {% ([name, _kw, _ws, [[definition]]]) => ({
  name,
  definition
}) %}

fieldType -> nonCompositeFieldType | compositeFieldType
nonCompositeFieldType -> idField | naturalLanguageField | enumField | timeField | currencyField | primitiveField

compositeFieldType -> arrayField | mapField
arrayField -> "Array<" _ fieldType _ ">" {% ([_kw, _ws, values]) => ({type: "array", values}) %}
mapField -> "Map<" _ nonCompositeFieldType _ "," _ fieldType _ ">" {%
  ([_kw, _ws, keys, _ws2, _kw2, _ws3, values]) => ({type: "map", keys, values})
%}

idField -> "ID<" _ name _ ">" {% ([_kw, _ws, of]) => ({type: "id", of }) %}
naturalLanguageField -> "NaturalLanguage<string>" {% () => ({type: "naturalLanguage"}) %}
enumField -> "Enumeration<" _ enumKeys _ ">" {% ([_kw, _ws, keys]) => ({type: "enumeration", keys}) %}
enumKeys -> name | enumKeys _ "|" _ name {% ([e, _ws, _kw, _ws2, key]) => (e.concat(key)) %}
timeField -> "Timestamp" {% () => ({type: "timestamp"}) %}
currencyField -> "Currency<" _ name _ ">" {% ([_kw, _ws, denomination]) => ({type: "currency", denomination}) %}
primitiveField -> "bool" | "int32" | "int64" | "float32" | "float64" | "uint32" | "uint64" | "string" {%
  (subtype) => ({type: "primitive", subtype})
%}


nodeFunction -> "OutboundEdges" | "InboundEdges" | "Index" | "Privacy"

edgeFields -> "{" _ (null | fieldDeclarations) "}" {% () => [] %}
edgeFunctions -> null | edgeFunctions "|" _ edgeFunction _

edgeFunction -> "Index" | "Invert"


inlineSpace -> [ \t\v\f]:* {% (_) => null %}

# storageEngine: postgres
# dbName: mealtrained

# Node<User> {
#   id: ID<User>
#   name: NaturalLanguage<string>
# } | Privacy {
#   AllowIf(Viewer is this)
#   AllowIf(
#     Trains.queryFromCreator(this).intersect(Trains.queryFromCreator(Viewer)).exists(),
#     'Viewer and the User share trains in common. Nit: check train privacy settings?',
#   )
# }

# Node<Train> {
#   id: ID<Train>
#   name: NaturalLanguage<string>
#   creatorId: ID<User>
#   status: Enumeration<Open | Created | Lapsed | Cancelled>
#   description: NaturalLanguage<string>
# } | OutboundEdges {
#   creator: FieldEdge<Train.creatorId>
#   participants: TrainToParticipantEdge
#   slots: ForeignKeyEdge<Slot.trainId>
# } | InboundEdges {
#   fromCreator: ForeignKeyEdge<Train.creatorId>
# } | Index {
#   id as primaryKey
#   creatorId
# } | Privacy {
#   AllowIf(Viewer is creator)
# } | StorageTypeOverrides {
#   field: override type...
# }

# Edge<Train, Participant> as TrainToParticipantEdge {
#   role: Bitmask<PARTICIPANT | RECIPIENT>
# } | Index {
#   unique(src, dest)
# } | Invert as ParticipantToTrainEdge

# Slot {
#   id: ID<Slot>
#   trainId: ID<Train>
#   timestamp: Timestamp
#   mealType: Enumeration<Breakfast | Lunch | Dinner | Snack | Other>
#   recipientResponse: Enumeration<Accepted | Declined> | null
#   sponsorId: ID<User>
# } | OutboundEdges {
#   sponsor: FieldEdge<Slot.sponsorId>
#   items: SlotToItemEdge
# } | InboundEdges {
#   fromSponsor: ForeignKeyEdge<Slot.sponsorId>
# } | Index {
#   trainId
#   sponsor
# }

# Edge<Slot, Item> as SlotToItemEdge {

# }

# Item {

# }

# Can we not inverse templates?
# E.g., someone declares a template to render data.
# Well the inverse of the template is parsing that data and its much cleaner than grammars.
