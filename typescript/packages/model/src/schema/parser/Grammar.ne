# Parse Aphrodite schemas
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

node -> "Node<" _ nodeTypeName _ ">" _ nodeFields _ nodeFunctions {% ([kw, ws, name, ws2, kw2, ws3, fields, ws4, funcs]) => ({
  name,
  fields,
  funcs
}) %}

edge -> "Edge<" _ nodeTypeName _ "," _ nodeTypeName _ ">" _ edgeFields _ edgeFunctions {%
  ([kw, ws, src, ws2, kw2, ws3, dest, ws4, kw3, ws5, fields, ws6, funcs]) => ({
    src,
    dest,
    fields,
    funcs
  })
%}
nodeTypeName -> [a-zA-Z_] [a-zA-Z0-9_-]:* {% ([pre, post]) => pre + post.join("") %}

nodeFields -> "{" _ "}" {% () => [] %}
nodeFunctions -> null | nodeFunctions "|" _ nodeFunction _

nodeFunction -> "OutboundEdges" | "InboundEdges" | "Index" | "Privacy"

edgeFields -> "{" _ "}" {% () => [] %}
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
# }

# Edge<Train, Participant> as TrainToParticipantEdge {
#   src: Train
#   dest: Participant
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
